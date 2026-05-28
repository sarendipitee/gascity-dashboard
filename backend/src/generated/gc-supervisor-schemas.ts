/* eslint-disable */
// Generated from backend/openapi/gc-supervisor.openapi.json. Do not edit.
export const gcSupervisorComponentSchemas: Record<string, unknown> = {
  "FormulaDetailResponse": {
    "additionalProperties": false,
    "properties": {
      "deps": {
        "items": {
          "$ref": "#/components/schemas/FormulaPreviewEdgeResponse"
        },
        "type": [
          "array",
          "null"
        ]
      },
      "description": {
        "type": "string"
      },
      "name": {
        "type": "string"
      },
      "preview": {
        "$ref": "#/components/schemas/FormulaPreviewResponse"
      },
      "steps": {
        "items": {
          "$ref": "#/components/schemas/FormulaStepResponse"
        },
        "type": [
          "array",
          "null"
        ]
      },
      "var_defs": {
        "items": {
          "$ref": "#/components/schemas/FormulaVarDefResponse"
        },
        "type": [
          "array",
          "null"
        ]
      },
      "version": {
        "type": "string"
      }
    },
    "required": [
      "name",
      "description",
      "version",
      "var_defs",
      "steps",
      "deps",
      "preview"
    ],
    "type": "object"
  },
  "FormulaPreviewEdgeResponse": {
    "additionalProperties": false,
    "properties": {
      "from": {
        "type": "string"
      },
      "kind": {
        "type": "string"
      },
      "to": {
        "type": "string"
      }
    },
    "required": [
      "from",
      "to"
    ],
    "type": "object"
  },
  "FormulaPreviewNodeResponse": {
    "additionalProperties": false,
    "properties": {
      "id": {
        "type": "string"
      },
      "kind": {
        "type": "string"
      },
      "scope_ref": {
        "type": "string"
      },
      "title": {
        "type": "string"
      }
    },
    "required": [
      "id",
      "title",
      "kind"
    ],
    "type": "object"
  },
  "FormulaPreviewResponse": {
    "additionalProperties": false,
    "properties": {
      "edges": {
        "items": {
          "$ref": "#/components/schemas/FormulaPreviewEdgeResponse"
        },
        "type": [
          "array",
          "null"
        ]
      },
      "nodes": {
        "items": {
          "$ref": "#/components/schemas/FormulaPreviewNodeResponse"
        },
        "type": [
          "array",
          "null"
        ]
      }
    },
    "required": [
      "nodes",
      "edges"
    ],
    "type": "object"
  },
  "FormulaStepResponse": {
    "additionalProperties": false,
    "properties": {
      "assignee": {
        "type": "string"
      },
      "id": {
        "type": "string"
      },
      "kind": {
        "type": "string"
      },
      "labels": {
        "items": {
          "type": "string"
        },
        "type": [
          "array",
          "null"
        ]
      },
      "metadata": {
        "additionalProperties": {
          "type": "string"
        },
        "type": "object"
      },
      "title": {
        "type": "string"
      },
      "type": {
        "type": "string"
      }
    },
    "required": [
      "id",
      "title",
      "kind"
    ],
    "type": "object"
  },
  "FormulaVarDefResponse": {
    "additionalProperties": false,
    "properties": {
      "default": {},
      "description": {
        "type": "string"
      },
      "enum": {
        "items": {
          "type": "string"
        },
        "type": [
          "array",
          "null"
        ]
      },
      "name": {
        "type": "string"
      },
      "pattern": {
        "type": "string"
      },
      "required": {
        "type": "boolean"
      },
      "type": {
        "type": "string"
      }
    },
    "required": [
      "name",
      "type"
    ],
    "type": "object"
  },
  "HealthOutputBody": {
    "additionalProperties": false,
    "properties": {
      "city": {
        "description": "City name.",
        "type": "string"
      },
      "status": {
        "description": "Health status.",
        "examples": [
          "ok"
        ],
        "type": "string"
      },
      "uptime_sec": {
        "description": "Server uptime in seconds.",
        "format": "int64",
        "type": "integer"
      },
      "version": {
        "description": "Server version.",
        "type": "string"
      }
    },
    "required": [
      "status",
      "uptime_sec"
    ],
    "type": "object"
  },
  "ListBodySessionResponse": {
    "additionalProperties": false,
    "properties": {
      "items": {
        "description": "The list of items.",
        "items": {
          "$ref": "#/components/schemas/SessionResponse"
        },
        "type": [
          "array",
          "null"
        ]
      },
      "next_cursor": {
        "description": "Cursor for the next page of results.",
        "type": "string"
      },
      "partial": {
        "description": "True when one or more backends failed and the list is incomplete.",
        "type": "boolean"
      },
      "partial_errors": {
        "description": "Human-readable errors from backends that failed during aggregation.",
        "items": {
          "type": "string"
        },
        "type": [
          "array",
          "null"
        ]
      },
      "total": {
        "description": "Total number of items matching the query.",
        "format": "int64",
        "type": "integer"
      }
    },
    "required": [
      "items",
      "total"
    ],
    "type": "object"
  },
  "LogicalNode": {
    "additionalProperties": false,
    "type": "object"
  },
  "OutputTurn": {
    "additionalProperties": false,
    "properties": {
      "role": {
        "type": "string"
      },
      "text": {
        "type": "string"
      },
      "timestamp": {
        "type": "string"
      }
    },
    "required": [
      "role",
      "text"
    ],
    "type": "object"
  },
  "PaginationInfo": {
    "additionalProperties": false,
    "properties": {
      "has_older_messages": {
        "type": "boolean"
      },
      "returned_message_count": {
        "format": "int64",
        "type": "integer"
      },
      "total_compactions": {
        "format": "int64",
        "type": "integer"
      },
      "total_message_count": {
        "format": "int64",
        "type": "integer"
      },
      "truncated_before_message": {
        "type": "string"
      }
    },
    "required": [
      "has_older_messages",
      "total_message_count",
      "returned_message_count",
      "total_compactions"
    ],
    "type": "object"
  },
  "ScopeGroup": {
    "additionalProperties": false,
    "type": "object"
  },
  "SessionRawMessageFrame": {
    "description": "Provider-native transcript frame. Gas City forwards the exact JSON the provider wrote to its session log, so the shape is provider-specific and can be any JSON value. The producing provider is identified by the Provider field on the enclosing envelope; consumers dispatch per-provider frame parsing keyed by that identifier.",
    "title": "Session raw transcript frame"
  },
  "SessionResponse": {
    "additionalProperties": false,
    "properties": {
      "active_bead": {
        "type": "string"
      },
      "activity": {
        "type": "string"
      },
      "agent_kind": {
        "type": "string"
      },
      "alias": {
        "type": "string"
      },
      "attached": {
        "type": "boolean"
      },
      "configured_named_session": {
        "type": "boolean"
      },
      "context_pct": {
        "format": "int64",
        "type": "integer"
      },
      "context_window": {
        "format": "int64",
        "type": "integer"
      },
      "created_at": {
        "type": "string"
      },
      "display_name": {
        "type": "string"
      },
      "id": {
        "type": "string"
      },
      "kind": {
        "type": "string"
      },
      "last_active": {
        "type": "string"
      },
      "last_nudge_delivered_at": {
        "type": "string"
      },
      "last_output": {
        "type": "string"
      },
      "metadata": {
        "additionalProperties": {
          "type": "string"
        },
        "type": "object"
      },
      "model": {
        "type": "string"
      },
      "options": {
        "additionalProperties": {
          "type": "string"
        },
        "type": "object"
      },
      "pool": {
        "type": "string"
      },
      "provider": {
        "type": "string"
      },
      "reason": {
        "type": "string"
      },
      "rig": {
        "type": "string"
      },
      "running": {
        "type": "boolean"
      },
      "session_name": {
        "type": "string"
      },
      "state": {
        "type": "string"
      },
      "submission_capabilities": {
        "$ref": "#/components/schemas/SubmissionCapabilities"
      },
      "template": {
        "type": "string"
      },
      "title": {
        "type": "string"
      }
    },
    "required": [
      "id",
      "template",
      "state",
      "title",
      "provider",
      "session_name",
      "created_at",
      "attached",
      "running"
    ],
    "type": "object"
  },
  "SessionTranscriptGetResponse": {
    "additionalProperties": false,
    "properties": {
      "format": {
        "description": "conversation, text, or raw.",
        "type": "string"
      },
      "id": {
        "type": "string"
      },
      "messages": {
        "description": "Populated for raw format; provider-native frames emitted verbatim as the provider wrote them.",
        "items": {
          "$ref": "#/components/schemas/SessionRawMessageFrame"
        },
        "type": [
          "array",
          "null"
        ]
      },
      "pagination": {
        "$ref": "#/components/schemas/PaginationInfo"
      },
      "provider": {
        "description": "Producing provider identifier (claude, codex, gemini, open-code, etc.). Consumers use this to dispatch per-provider frame parsing.",
        "type": "string"
      },
      "template": {
        "type": "string"
      },
      "turns": {
        "description": "Populated for conversation/text formats.",
        "items": {
          "$ref": "#/components/schemas/OutputTurn"
        },
        "type": [
          "array",
          "null"
        ]
      }
    },
    "required": [
      "id",
      "template",
      "provider",
      "format"
    ],
    "type": "object"
  },
  "SubmissionCapabilities": {
    "additionalProperties": false,
    "properties": {
      "supports_follow_up": {
        "type": "boolean"
      },
      "supports_interrupt_now": {
        "type": "boolean"
      }
    },
    "required": [
      "supports_follow_up",
      "supports_interrupt_now"
    ],
    "type": "object"
  },
  "WorkflowBeadResponse": {
    "additionalProperties": false,
    "properties": {
      "assignee": {
        "type": "string"
      },
      "attempt": {
        "format": "int64",
        "type": "integer"
      },
      "id": {
        "type": "string"
      },
      "kind": {
        "type": "string"
      },
      "logical_bead_id": {
        "type": "string"
      },
      "metadata": {
        "additionalProperties": {
          "type": "string"
        },
        "type": "object"
      },
      "scope_ref": {
        "type": "string"
      },
      "status": {
        "type": "string"
      },
      "step_ref": {
        "type": "string"
      },
      "title": {
        "type": "string"
      }
    },
    "required": [
      "id",
      "title",
      "status",
      "kind",
      "metadata"
    ],
    "type": "object"
  },
  "WorkflowDepResponse": {
    "additionalProperties": false,
    "properties": {
      "from": {
        "type": "string"
      },
      "kind": {
        "type": "string"
      },
      "to": {
        "type": "string"
      }
    },
    "required": [
      "from",
      "to"
    ],
    "type": "object"
  },
  "WorkflowSnapshotResponse": {
    "additionalProperties": false,
    "properties": {
      "beads": {
        "items": {
          "$ref": "#/components/schemas/WorkflowBeadResponse"
        },
        "type": [
          "array",
          "null"
        ]
      },
      "deps": {
        "items": {
          "$ref": "#/components/schemas/WorkflowDepResponse"
        },
        "type": [
          "array",
          "null"
        ]
      },
      "logical_edges": {
        "items": {
          "$ref": "#/components/schemas/WorkflowDepResponse"
        },
        "type": [
          "array",
          "null"
        ]
      },
      "logical_nodes": {
        "items": {
          "$ref": "#/components/schemas/LogicalNode"
        },
        "type": [
          "array",
          "null"
        ]
      },
      "partial": {
        "type": "boolean"
      },
      "resolved_root_store": {
        "type": "string"
      },
      "root_bead_id": {
        "type": "string"
      },
      "root_store_ref": {
        "type": "string"
      },
      "scope_groups": {
        "items": {
          "$ref": "#/components/schemas/ScopeGroup"
        },
        "type": [
          "array",
          "null"
        ]
      },
      "scope_kind": {
        "type": "string"
      },
      "scope_ref": {
        "type": "string"
      },
      "snapshot_event_seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "snapshot_version": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "stores_scanned": {
        "items": {
          "type": "string"
        },
        "type": [
          "array",
          "null"
        ]
      },
      "workflow_id": {
        "type": "string"
      }
    },
    "required": [
      "workflow_id",
      "root_bead_id",
      "root_store_ref",
      "scope_kind",
      "scope_ref",
      "beads",
      "deps",
      "logical_nodes",
      "logical_edges",
      "scope_groups",
      "partial",
      "resolved_root_store",
      "stores_scanned",
      "snapshot_version"
    ],
    "type": "object"
  }
};
