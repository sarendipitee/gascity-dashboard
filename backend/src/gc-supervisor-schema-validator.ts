import { gcSupervisorComponentSchemas } from './generated/gc-supervisor-schemas.js';

type PathSegment = string | number;
type SchemaRecord = Readonly<Record<string, unknown>>;

export interface OpenApiValidationIssue {
  readonly path: readonly PathSegment[];
  readonly expected: string;
}

export function validateGcSupervisorComponent(
  componentName: string,
  value: unknown,
): OpenApiValidationIssue | undefined {
  return validateSchema(componentSchema(componentName), value, [], new Set());
}

export function openApiIssuePath(path: readonly PathSegment[]): string {
  if (path.length === 0) return 'payload';
  return `payload${path.map((part) => {
    if (typeof part === 'number') return `[${part}]`;
    return `.${part}`;
  }).join('')}`;
}

function validateSchema(
  schema: SchemaRecord,
  value: unknown,
  path: readonly PathSegment[],
  seenRefs: ReadonlySet<string>,
): OpenApiValidationIssue | undefined {
  const ref = stringProp(schema, '$ref');
  if (ref !== undefined) {
    if (seenRefs.has(ref)) return undefined;
    const nextSeen = new Set(seenRefs);
    nextSeen.add(ref);
    return validateSchema(resolveRef(ref), value, path, nextSeen);
  }

  const discriminatorIssue = validateDiscriminator(schema, value, path, seenRefs);
  if (discriminatorIssue !== null) return discriminatorIssue;

  const oneOf = recordArrayProp(schema, 'oneOf');
  if (oneOf !== undefined) {
    return validateOneOf(oneOf, value, path, seenRefs);
  }

  const anyOf = recordArrayProp(schema, 'anyOf');
  if (anyOf !== undefined) {
    return validateAnyOf(anyOf, value, path, seenRefs);
  }

  const allOf = recordArrayProp(schema, 'allOf');
  if (allOf !== undefined) {
    for (const item of allOf) {
      const issue = validateSchema(item, value, path, seenRefs);
      if (issue !== undefined) return issue;
    }
  }

  if ('const' in schema && !Object.is(value, schema.const)) {
    return issue(path, JSON.stringify(schema.const));
  }

  const enumValues = schema.enum;
  if (Array.isArray(enumValues) && !enumValues.some((item) => Object.is(item, value))) {
    return issue(path, `one of ${enumValues.map((item) => JSON.stringify(item)).join(', ')}`);
  }

  return validateTypedSchema(schema, value, path, seenRefs);
}

function validateDiscriminator(
  schema: SchemaRecord,
  value: unknown,
  path: readonly PathSegment[],
  seenRefs: ReadonlySet<string>,
): OpenApiValidationIssue | undefined | null {
  const discriminator = recordProp(schema, 'discriminator');
  if (discriminator === undefined) return null;
  const propertyName = stringProp(discriminator, 'propertyName');
  const mapping = recordProp(discriminator, 'mapping');
  if (propertyName === undefined || mapping === undefined || !isRecord(value)) return null;
  const discriminant = value[propertyName];
  if (typeof discriminant !== 'string') return null;
  const mappedRef = mapping[discriminant];
  if (typeof mappedRef !== 'string') return null;
  return validateSchema({ $ref: mappedRef }, value, path, seenRefs);
}

function validateOneOf(
  choices: readonly SchemaRecord[],
  value: unknown,
  path: readonly PathSegment[],
  seenRefs: ReadonlySet<string>,
): OpenApiValidationIssue | undefined {
  let matches = 0;
  let firstIssue: OpenApiValidationIssue | undefined;
  for (const choice of choices) {
    const issue = validateSchema(choice, value, path, seenRefs);
    if (issue === undefined) {
      matches += 1;
    } else {
      firstIssue ??= issue;
    }
  }
  if (matches === 1) return undefined;
  if (matches === 0) return firstIssue ?? issue(path, 'one matching schema');
  return issue(path, 'exactly one matching schema');
}

function validateAnyOf(
  choices: readonly SchemaRecord[],
  value: unknown,
  path: readonly PathSegment[],
  seenRefs: ReadonlySet<string>,
): OpenApiValidationIssue | undefined {
  let firstIssue: OpenApiValidationIssue | undefined;
  for (const choice of choices) {
    const issue = validateSchema(choice, value, path, seenRefs);
    if (issue === undefined) return undefined;
    firstIssue ??= issue;
  }
  return firstIssue ?? issue(path, 'one matching schema');
}

function validateTypedSchema(
  schema: SchemaRecord,
  value: unknown,
  path: readonly PathSegment[],
  seenRefs: ReadonlySet<string>,
): OpenApiValidationIssue | undefined {
  const types = schemaTypes(schema);
  if (value === null) {
    return types.includes('null') ? undefined : issue(path, expectedTypes(types));
  }

  const nonNullTypes = types.filter((type) => type !== 'null');
  if (nonNullTypes.length === 0) {
    if (recordProp(schema, 'properties') !== undefined) {
      return validateObjectSchema(schema, value, path, seenRefs);
    }
    if (recordProp(schema, 'items') !== undefined) {
      return validateArraySchema(schema, value, path, seenRefs);
    }
    return undefined;
  }

  let firstIssue: OpenApiValidationIssue | undefined;
  for (const type of nonNullTypes) {
    const typeIssue = validateSingleType(schema, type, value, path, seenRefs);
    if (typeIssue === undefined) return undefined;
    firstIssue ??= typeIssue;
  }
  return firstIssue ?? issue(path, expectedTypes(types));
}

function validateSingleType(
  schema: SchemaRecord,
  type: string,
  value: unknown,
  path: readonly PathSegment[],
  seenRefs: ReadonlySet<string>,
): OpenApiValidationIssue | undefined {
  switch (type) {
    case 'array':
      return validateArraySchema(schema, value, path, seenRefs);
    case 'boolean':
      return typeof value === 'boolean' ? undefined : issue(path, 'boolean');
    case 'integer':
      return typeof value === 'number' && Number.isInteger(value)
        ? validateNumberBounds(schema, value, path)
        : issue(path, 'integer');
    case 'number':
      return typeof value === 'number' && Number.isFinite(value)
        ? validateNumberBounds(schema, value, path)
        : issue(path, 'number');
    case 'object':
      return validateObjectSchema(schema, value, path, seenRefs);
    case 'string':
      return typeof value === 'string' ? undefined : issue(path, 'string');
    default:
      return issue(path, type);
  }
}

function validateArraySchema(
  schema: SchemaRecord,
  value: unknown,
  path: readonly PathSegment[],
  seenRefs: ReadonlySet<string>,
): OpenApiValidationIssue | undefined {
  if (!Array.isArray(value)) return issue(path, 'array');
  const itemSchema = recordProp(schema, 'items');
  if (itemSchema === undefined) return undefined;
  for (const [index, item] of value.entries()) {
    const itemIssue = validateSchema(itemSchema, item, [...path, index], seenRefs);
    if (itemIssue !== undefined) return itemIssue;
  }
  return undefined;
}

function validateObjectSchema(
  schema: SchemaRecord,
  value: unknown,
  path: readonly PathSegment[],
  seenRefs: ReadonlySet<string>,
): OpenApiValidationIssue | undefined {
  if (!isRecord(value)) return issue(path, 'object');

  const required = stringArrayProp(schema, 'required') ?? [];
  for (const key of required) {
    if (!Object.hasOwn(value, key) || value[key] === undefined) {
      return issue([...path, key], 'present');
    }
  }

  const properties = recordProp(schema, 'properties') ?? {};
  for (const [key, propertySchema] of Object.entries(properties)) {
    if (!Object.hasOwn(value, key) || value[key] === undefined) continue;
    if (!isRecord(propertySchema)) continue;
    const propertyIssue = validateSchema(propertySchema, value[key], [...path, key], seenRefs);
    if (propertyIssue !== undefined) return propertyIssue;
  }

  const additional = schema.additionalProperties;
  if (additional === false) {
    for (const key of Object.keys(value)) {
      if (!Object.hasOwn(properties, key)) return issue([...path, key], 'absent');
    }
    return undefined;
  }
  if (isRecord(additional)) {
    for (const [key, propertyValue] of Object.entries(value)) {
      if (Object.hasOwn(properties, key)) continue;
      const propertyIssue = validateSchema(additional, propertyValue, [...path, key], seenRefs);
      if (propertyIssue !== undefined) return propertyIssue;
    }
  }
  return undefined;
}

function validateNumberBounds(
  schema: SchemaRecord,
  value: number,
  path: readonly PathSegment[],
): OpenApiValidationIssue | undefined {
  const minimum = numberProp(schema, 'minimum');
  if (minimum !== undefined && value < minimum) return issue(path, `>= ${minimum}`);
  const maximum = numberProp(schema, 'maximum');
  if (maximum !== undefined && value > maximum) return issue(path, `<= ${maximum}`);
  return undefined;
}

function schemaTypes(schema: SchemaRecord): readonly string[] {
  const type = schema.type;
  if (typeof type === 'string') return [type];
  if (Array.isArray(type)) return type.filter((item): item is string => typeof item === 'string');
  if (schema.nullable === true) return ['null'];
  return [];
}

function expectedTypes(types: readonly string[]): string {
  if (types.length === 0) return 'valid';
  return types.join(' or ');
}

function componentSchema(name: string): SchemaRecord {
  const schema = gcSupervisorComponentSchemas[name];
  if (!isRecord(schema)) {
    throw new Error(`gc supervisor OpenAPI schema ${name} is not generated`);
  }
  return schema;
}

function resolveRef(ref: string): SchemaRecord {
  const prefix = '#/components/schemas/';
  if (!ref.startsWith(prefix)) {
    throw new Error(`unsupported gc supervisor OpenAPI ref ${ref}`);
  }
  return componentSchema(ref.slice(prefix.length));
}

function issue(
  path: readonly PathSegment[],
  expected: string,
): OpenApiValidationIssue {
  return { path, expected };
}

function recordProp(schema: SchemaRecord, key: string): SchemaRecord | undefined {
  const value = schema[key];
  return isRecord(value) ? value : undefined;
}

function recordArrayProp(schema: SchemaRecord, key: string): readonly SchemaRecord[] | undefined {
  const value = schema[key];
  if (!Array.isArray(value)) return undefined;
  return value.filter(isRecord);
}

function stringProp(schema: SchemaRecord, key: string): string | undefined {
  const value = schema[key];
  return typeof value === 'string' ? value : undefined;
}

function numberProp(schema: SchemaRecord, key: string): number | undefined {
  const value = schema[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function stringArrayProp(schema: SchemaRecord, key: string): readonly string[] | undefined {
  const value = schema[key];
  if (!Array.isArray(value)) return undefined;
  return value.filter((item): item is string => typeof item === 'string');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
