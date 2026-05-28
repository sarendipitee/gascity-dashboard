/* eslint-disable */
// Generated from backend/openapi/gc-supervisor.openapi.json. Do not edit.
export const gcSupervisorComponentSchemas: Record<string, unknown> = {
  "AdapterEventPayload": {
    "additionalProperties": false,
    "properties": {
      "account_id": {
        "type": "string"
      },
      "provider": {
        "type": "string"
      }
    },
    "required": [
      "provider",
      "account_id"
    ],
    "type": "object"
  },
  "Bead": {
    "additionalProperties": false,
    "properties": {
      "assignee": {
        "type": "string"
      },
      "created_at": {
        "format": "date-time",
        "type": "string"
      },
      "dependencies": {
        "items": {
          "$ref": "#/components/schemas/Dep"
        },
        "type": [
          "array",
          "null"
        ]
      },
      "description": {
        "type": "string"
      },
      "ephemeral": {
        "type": "boolean"
      },
      "from": {
        "type": "string"
      },
      "id": {
        "type": "string"
      },
      "issue_type": {
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
      "needs": {
        "items": {
          "type": "string"
        },
        "type": [
          "array",
          "null"
        ]
      },
      "parent": {
        "type": "string"
      },
      "priority": {
        "format": "int64",
        "type": [
          "integer",
          "null"
        ]
      },
      "ref": {
        "type": "string"
      },
      "status": {
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
      "issue_type",
      "created_at"
    ],
    "type": "object"
  },
  "BeadEventPayload": {
    "additionalProperties": false,
    "properties": {
      "bead": {
        "$ref": "#/components/schemas/Bead"
      }
    },
    "required": [
      "bead"
    ],
    "type": "object"
  },
  "BoundEventPayload": {
    "additionalProperties": false,
    "properties": {
      "conversation_id": {
        "type": "string"
      },
      "provider": {
        "type": "string"
      },
      "session_id": {
        "type": "string"
      }
    },
    "required": [
      "provider",
      "conversation_id",
      "session_id"
    ],
    "type": "object"
  },
  "CityCreateSucceededPayload": {
    "additionalProperties": false,
    "properties": {
      "name": {
        "description": "Resolved city name.",
        "type": "string"
      },
      "path": {
        "description": "Resolved absolute city directory path.",
        "type": "string"
      },
      "request_id": {
        "description": "Correlation ID from the 202 response.",
        "type": "string"
      }
    },
    "required": [
      "request_id",
      "name",
      "path"
    ],
    "type": "object"
  },
  "CityLifecyclePayload": {
    "additionalProperties": false,
    "properties": {
      "name": {
        "type": "string"
      },
      "path": {
        "type": "string"
      }
    },
    "required": [
      "name",
      "path"
    ],
    "type": "object"
  },
  "CityUnregisterSucceededPayload": {
    "additionalProperties": false,
    "properties": {
      "name": {
        "description": "City name that was unregistered.",
        "type": "string"
      },
      "path": {
        "description": "Absolute city directory path.",
        "type": "string"
      },
      "request_id": {
        "description": "Correlation ID from the 202 response.",
        "type": "string"
      }
    },
    "required": [
      "request_id",
      "name",
      "path"
    ],
    "type": "object"
  },
  "Dep": {
    "additionalProperties": false,
    "properties": {
      "depends_on_id": {
        "type": "string"
      },
      "issue_id": {
        "type": "string"
      },
      "type": {
        "type": "string"
      }
    },
    "required": [
      "issue_id",
      "depends_on_id",
      "type"
    ],
    "type": "object"
  },
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
  "GroupCreatedEventPayload": {
    "additionalProperties": false,
    "properties": {
      "conversation_id": {
        "type": "string"
      },
      "mode": {
        "type": "string"
      },
      "provider": {
        "type": "string"
      }
    },
    "required": [
      "provider",
      "conversation_id",
      "mode"
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
  "InboundEventPayload": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "conversation_id": {
        "type": "string"
      },
      "provider": {
        "type": "string"
      },
      "target_session": {
        "type": "string"
      }
    },
    "required": [
      "provider",
      "conversation_id",
      "actor",
      "target_session"
    ],
    "type": "object"
  },
  "ListBodyBead": {
    "additionalProperties": false,
    "properties": {
      "items": {
        "description": "The list of items.",
        "items": {
          "$ref": "#/components/schemas/Bead"
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
  "ListBodyWireEvent": {
    "additionalProperties": false,
    "properties": {
      "items": {
        "description": "The list of items.",
        "items": {
          "$ref": "#/components/schemas/TypedEventStreamEnvelope"
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
  "MailEventPayload": {
    "additionalProperties": false,
    "properties": {
      "message": {
        "$ref": "#/components/schemas/Message"
      },
      "rig": {
        "type": "string"
      }
    },
    "required": [
      "rig"
    ],
    "type": "object"
  },
  "MailListBody": {
    "additionalProperties": false,
    "properties": {
      "items": {
        "description": "The list of messages.",
        "items": {
          "$ref": "#/components/schemas/Message"
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
        "description": "True when one or more rig providers failed and the list is not authoritative.",
        "type": "boolean"
      },
      "partial_errors": {
        "description": "Per-provider errors when partial is true.",
        "items": {
          "type": "string"
        },
        "type": [
          "array",
          "null"
        ]
      },
      "total": {
        "description": "Total number of messages matching the query.",
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
  "Message": {
    "additionalProperties": false,
    "properties": {
      "body": {
        "type": "string"
      },
      "cc": {
        "items": {
          "type": "string"
        },
        "type": [
          "array",
          "null"
        ]
      },
      "created_at": {
        "format": "date-time",
        "type": "string"
      },
      "from": {
        "type": "string"
      },
      "id": {
        "type": "string"
      },
      "priority": {
        "format": "int64",
        "type": "integer"
      },
      "read": {
        "type": "boolean"
      },
      "reply_to": {
        "type": "string"
      },
      "rig": {
        "type": "string"
      },
      "subject": {
        "type": "string"
      },
      "thread_id": {
        "type": "string"
      },
      "to": {
        "type": "string"
      }
    },
    "required": [
      "id",
      "from",
      "to",
      "subject",
      "body",
      "created_at",
      "read"
    ],
    "type": "object"
  },
  "NoPayload": {
    "additionalProperties": false,
    "type": "object"
  },
  "OutboundEventPayload": {
    "additionalProperties": false,
    "properties": {
      "conversation_id": {
        "type": "string"
      },
      "message_id": {
        "type": "string"
      },
      "provider": {
        "type": "string"
      },
      "session": {
        "type": "string"
      }
    },
    "required": [
      "provider",
      "conversation_id",
      "session",
      "message_id"
    ],
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
  "ProjectIdentityStampedPayload": {
    "additionalProperties": false,
    "properties": {
      "layer": {
        "type": "string"
      },
      "new_id": {
        "type": "string"
      },
      "old_id": {
        "type": "string"
      },
      "scope_root": {
        "type": "string"
      },
      "source": {
        "type": "string"
      }
    },
    "required": [
      "scope_root",
      "source",
      "layer",
      "new_id"
    ],
    "type": "object"
  },
  "RequestFailedPayload": {
    "additionalProperties": false,
    "properties": {
      "error_code": {
        "description": "Machine-readable error code.",
        "type": "string"
      },
      "error_message": {
        "description": "Human-readable error description.",
        "type": "string"
      },
      "operation": {
        "description": "Which operation failed.",
        "enum": [
          "city.create",
          "city.unregister",
          "session.create",
          "session.message",
          "session.submit"
        ],
        "type": "string"
      },
      "request_id": {
        "description": "Correlation ID from the 202 response.",
        "type": "string"
      }
    },
    "required": [
      "request_id",
      "operation",
      "error_code",
      "error_message"
    ],
    "type": "object"
  },
  "RotatedPayload": {
    "additionalProperties": false,
    "properties": {
      "prior_archive": {
        "type": "string"
      },
      "prior_first_seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "prior_last_seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      }
    },
    "required": [
      "prior_archive",
      "prior_first_seq",
      "prior_last_seq"
    ],
    "type": "object"
  },
  "ScopeGroup": {
    "additionalProperties": false,
    "type": "object"
  },
  "SessionCreateSucceededPayload": {
    "additionalProperties": false,
    "properties": {
      "request_id": {
        "description": "Correlation ID from the 202 response.",
        "type": "string"
      },
      "session": {
        "$ref": "#/components/schemas/SessionResponse",
        "description": "Full session state as returned by GET /session/{id}. For session.create, this result is emitted only after the session has left creating and can accept normal metadata and lifecycle commands."
      }
    },
    "required": [
      "request_id",
      "session"
    ],
    "type": "object"
  },
  "SessionDrainAckedWithAssignedWorkPayload": {
    "additionalProperties": false,
    "properties": {
      "bead_id": {
        "description": "ID of the work bead still holding this session as its assignee.",
        "type": "string"
      },
      "bead_status": {
        "description": "Status of the stranded bead at emission time (typically 'in_progress' for cap-hit, 'open' if recovery races claim).",
        "type": "string"
      },
      "reason": {
        "description": "Short diagnostic context. Today both emission sites pass 'drain_acked_with_assigned_work'; reserved for finer-grained shape discriminators if later Shape-N variants land.",
        "type": "string"
      },
      "session_id": {
        "description": "Canonical session bead ID for the session that drain-acked.",
        "type": "string"
      },
      "template": {
        "description": "Pool template name when known at the emission site.",
        "type": "string"
      }
    },
    "required": [
      "session_id",
      "bead_id"
    ],
    "type": "object"
  },
  "SessionLifecyclePayload": {
    "additionalProperties": false,
    "properties": {
      "reason": {
        "description": "Short human-readable reason.",
        "type": "string"
      },
      "session_id": {
        "description": "Canonical session bead ID. Always present.",
        "type": "string"
      },
      "template": {
        "description": "Session template name when known at the emission site.",
        "type": "string"
      }
    },
    "required": [
      "session_id"
    ],
    "type": "object"
  },
  "SessionMessageSucceededPayload": {
    "additionalProperties": false,
    "properties": {
      "request_id": {
        "description": "Correlation ID from the 202 response.",
        "type": "string"
      },
      "session_id": {
        "description": "Session ID that received the message.",
        "type": "string"
      }
    },
    "required": [
      "request_id",
      "session_id"
    ],
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
  "SessionSubmitSucceededPayload": {
    "additionalProperties": false,
    "properties": {
      "intent": {
        "description": "Resolved submit intent (default, follow_up, interrupt_now).",
        "type": "string"
      },
      "queued": {
        "description": "Whether the message was queued for later delivery.",
        "type": "boolean"
      },
      "request_id": {
        "description": "Correlation ID from the 202 response.",
        "type": "string"
      },
      "session_id": {
        "description": "Session ID that received the submission.",
        "type": "string"
      }
    },
    "required": [
      "request_id",
      "session_id",
      "queued",
      "intent"
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
  "StoreMaintenanceDonePayload": {
    "additionalProperties": false,
    "properties": {
      "after_bytes": {
        "format": "int64",
        "type": "integer"
      },
      "before_bytes": {
        "format": "int64",
        "type": "integer"
      },
      "duration_s": {
        "format": "double",
        "type": "number"
      },
      "snapshot_path": {
        "type": "string"
      }
    },
    "required": [
      "duration_s",
      "before_bytes",
      "after_bytes",
      "snapshot_path"
    ],
    "type": "object"
  },
  "StoreMaintenanceFailedPayload": {
    "additionalProperties": false,
    "properties": {
      "duration_s": {
        "format": "double",
        "type": "number"
      },
      "error_msg": {
        "type": "string"
      },
      "snapshot_path": {
        "type": "string"
      },
      "stage": {
        "type": "string"
      }
    },
    "required": [
      "stage",
      "error_msg",
      "duration_s"
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
  "SupervisorFSPressureSkippedTickPayload": {
    "additionalProperties": false,
    "properties": {
      "avg60": {
        "description": "The Linux PSI some avg60 value observed for filesystem IO pressure.",
        "format": "double",
        "type": "number"
      },
      "consecutive_skips": {
        "description": "Number of consecutive pressure skips including this tick.",
        "format": "int64",
        "type": "integer"
      },
      "max_consecutive_skips": {
        "description": "Maximum consecutive skips before the supervisor forces one reconciliation tick.",
        "format": "int64",
        "type": "integer"
      },
      "outcome": {
        "description": "The pressure decision outcome: skipped for a shed tick or forced for the bounded liveness tick.",
        "type": "string"
      },
      "threshold": {
        "description": "The configured avg60 threshold that triggered the skip.",
        "format": "double",
        "type": "number"
      },
      "trigger": {
        "description": "The daemon tick trigger, such as patrol or poke.",
        "type": "string"
      }
    },
    "required": [
      "avg60",
      "threshold",
      "consecutive_skips",
      "max_consecutive_skips",
      "outcome"
    ],
    "type": "object"
  },
  "SupervisorShutdownPayload": {
    "additionalProperties": false,
    "properties": {
      "client_addr": {
        "description": "For source=socket_stop, the address reported by the connecting client. Typically empty for unix-socket peers.",
        "type": "string"
      },
      "mode": {
        "description": "Resulting shutdown mode.",
        "enum": [
          "destructive",
          "preserve_sessions",
          "unknown"
        ],
        "type": "string"
      },
      "signal": {
        "description": "For source=signal, the human-readable signal name (e.g. \"terminated\", \"interrupt\"). Empty for socket_stop.",
        "type": "string"
      },
      "source": {
        "description": "Which path triggered the shutdown.",
        "enum": [
          "signal",
          "socket_stop"
        ],
        "type": "string"
      }
    },
    "required": [
      "source",
      "mode"
    ],
    "type": "object"
  },
  "TypedEventStreamEnvelope": {
    "description": "Discriminated union of city event stream envelopes. Each variant constrains the envelope type and payload schema together.",
    "discriminator": {
      "mapping": {
        "bead.closed": "#/components/schemas/TypedEventStreamEnvelopeBeadClosed",
        "bead.created": "#/components/schemas/TypedEventStreamEnvelopeBeadCreated",
        "bead.updated": "#/components/schemas/TypedEventStreamEnvelopeBeadUpdated",
        "city.created": "#/components/schemas/TypedEventStreamEnvelopeCityCreated",
        "city.resumed": "#/components/schemas/TypedEventStreamEnvelopeCityResumed",
        "city.suspended": "#/components/schemas/TypedEventStreamEnvelopeCitySuspended",
        "city.unregister_requested": "#/components/schemas/TypedEventStreamEnvelopeCityUnregisterRequested",
        "controller.started": "#/components/schemas/TypedEventStreamEnvelopeControllerStarted",
        "controller.stopped": "#/components/schemas/TypedEventStreamEnvelopeControllerStopped",
        "convoy.closed": "#/components/schemas/TypedEventStreamEnvelopeConvoyClosed",
        "convoy.created": "#/components/schemas/TypedEventStreamEnvelopeConvoyCreated",
        "events.rotated": "#/components/schemas/TypedEventStreamEnvelopeEventsRotated",
        "extmsg.adapter_added": "#/components/schemas/TypedEventStreamEnvelopeExtmsgAdapterAdded",
        "extmsg.adapter_removed": "#/components/schemas/TypedEventStreamEnvelopeExtmsgAdapterRemoved",
        "extmsg.bound": "#/components/schemas/TypedEventStreamEnvelopeExtmsgBound",
        "extmsg.group_created": "#/components/schemas/TypedEventStreamEnvelopeExtmsgGroupCreated",
        "extmsg.inbound": "#/components/schemas/TypedEventStreamEnvelopeExtmsgInbound",
        "extmsg.outbound": "#/components/schemas/TypedEventStreamEnvelopeExtmsgOutbound",
        "extmsg.unbound": "#/components/schemas/TypedEventStreamEnvelopeExtmsgUnbound",
        "gc.store.maintenance.done": "#/components/schemas/TypedEventStreamEnvelopeGcStoreMaintenanceDone",
        "gc.store.maintenance.failed": "#/components/schemas/TypedEventStreamEnvelopeGcStoreMaintenanceFailed",
        "mail.archived": "#/components/schemas/TypedEventStreamEnvelopeMailArchived",
        "mail.deleted": "#/components/schemas/TypedEventStreamEnvelopeMailDeleted",
        "mail.marked_read": "#/components/schemas/TypedEventStreamEnvelopeMailMarkedRead",
        "mail.marked_unread": "#/components/schemas/TypedEventStreamEnvelopeMailMarkedUnread",
        "mail.read": "#/components/schemas/TypedEventStreamEnvelopeMailRead",
        "mail.replied": "#/components/schemas/TypedEventStreamEnvelopeMailReplied",
        "mail.sent": "#/components/schemas/TypedEventStreamEnvelopeMailSent",
        "order.completed": "#/components/schemas/TypedEventStreamEnvelopeOrderCompleted",
        "order.failed": "#/components/schemas/TypedEventStreamEnvelopeOrderFailed",
        "order.fired": "#/components/schemas/TypedEventStreamEnvelopeOrderFired",
        "project.identity.stamped": "#/components/schemas/TypedEventStreamEnvelopeProjectIdentityStamped",
        "provider.swapped": "#/components/schemas/TypedEventStreamEnvelopeProviderSwapped",
        "request.failed": "#/components/schemas/TypedEventStreamEnvelopeRequestFailed",
        "request.result.city.create": "#/components/schemas/TypedEventStreamEnvelopeRequestResultCityCreate",
        "request.result.city.unregister": "#/components/schemas/TypedEventStreamEnvelopeRequestResultCityUnregister",
        "request.result.session.create": "#/components/schemas/TypedEventStreamEnvelopeRequestResultSessionCreate",
        "request.result.session.message": "#/components/schemas/TypedEventStreamEnvelopeRequestResultSessionMessage",
        "request.result.session.submit": "#/components/schemas/TypedEventStreamEnvelopeRequestResultSessionSubmit",
        "session.crashed": "#/components/schemas/TypedEventStreamEnvelopeSessionCrashed",
        "session.drain_acked_with_assigned_work": "#/components/schemas/TypedEventStreamEnvelopeSessionDrainAckedWithAssignedWork",
        "session.draining": "#/components/schemas/TypedEventStreamEnvelopeSessionDraining",
        "session.idle_killed": "#/components/schemas/TypedEventStreamEnvelopeSessionIdleKilled",
        "session.max_age_killed": "#/components/schemas/TypedEventStreamEnvelopeSessionMaxAgeKilled",
        "session.quarantined": "#/components/schemas/TypedEventStreamEnvelopeSessionQuarantined",
        "session.stopped": "#/components/schemas/TypedEventStreamEnvelopeSessionStopped",
        "session.stranded": "#/components/schemas/TypedEventStreamEnvelopeSessionStranded",
        "session.suspended": "#/components/schemas/TypedEventStreamEnvelopeSessionSuspended",
        "session.undrained": "#/components/schemas/TypedEventStreamEnvelopeSessionUndrained",
        "session.updated": "#/components/schemas/TypedEventStreamEnvelopeSessionUpdated",
        "session.woke": "#/components/schemas/TypedEventStreamEnvelopeSessionWoke",
        "session.work_query_failed": "#/components/schemas/TypedEventStreamEnvelopeSessionWorkQueryFailed",
        "supervisor.fs_pressure.skipped_tick": "#/components/schemas/TypedEventStreamEnvelopeSupervisorFsPressureSkippedTick",
        "supervisor.shutdown_requested": "#/components/schemas/TypedEventStreamEnvelopeSupervisorShutdownRequested",
        "worker.operation": "#/components/schemas/TypedEventStreamEnvelopeWorkerOperation"
      },
      "propertyName": "type"
    },
    "oneOf": [
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeBeadClosed"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeBeadCreated"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeBeadUpdated"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeCityCreated"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeCityResumed"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeCitySuspended"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeCityUnregisterRequested"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeControllerStarted"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeControllerStopped"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeConvoyClosed"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeConvoyCreated"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeEventsRotated"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeExtmsgAdapterAdded"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeExtmsgAdapterRemoved"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeExtmsgBound"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeExtmsgGroupCreated"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeExtmsgInbound"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeExtmsgOutbound"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeExtmsgUnbound"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeGcStoreMaintenanceDone"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeGcStoreMaintenanceFailed"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeMailArchived"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeMailDeleted"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeMailMarkedRead"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeMailMarkedUnread"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeMailRead"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeMailReplied"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeMailSent"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeOrderCompleted"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeOrderFailed"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeOrderFired"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeProjectIdentityStamped"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeProviderSwapped"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeRequestFailed"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeRequestResultCityCreate"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeRequestResultCityUnregister"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeRequestResultSessionCreate"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeRequestResultSessionMessage"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeRequestResultSessionSubmit"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeSessionCrashed"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeSessionDrainAckedWithAssignedWork"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeSessionDraining"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeSessionIdleKilled"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeSessionMaxAgeKilled"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeSessionQuarantined"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeSessionStopped"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeSessionStranded"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeSessionSuspended"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeSessionUndrained"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeSessionUpdated"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeSessionWoke"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeSessionWorkQueryFailed"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeSupervisorFsPressureSkippedTick"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeSupervisorShutdownRequested"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeWorkerOperation"
      },
      {
        "$ref": "#/components/schemas/TypedEventStreamEnvelopeCustom"
      }
    ],
    "title": "Typed city event stream envelope"
  },
  "TypedEventStreamEnvelopeBeadClosed": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/BeadEventPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "bead.closed",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope bead.closed",
    "type": "object"
  },
  "TypedEventStreamEnvelopeBeadCreated": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/BeadEventPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "bead.created",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope bead.created",
    "type": "object"
  },
  "TypedEventStreamEnvelopeBeadUpdated": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/BeadEventPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "bead.updated",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope bead.updated",
    "type": "object"
  },
  "TypedEventStreamEnvelopeCityCreated": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/CityLifecyclePayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "city.created",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope city.created",
    "type": "object"
  },
  "TypedEventStreamEnvelopeCityResumed": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/NoPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "city.resumed",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope city.resumed",
    "type": "object"
  },
  "TypedEventStreamEnvelopeCitySuspended": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/NoPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "city.suspended",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope city.suspended",
    "type": "object"
  },
  "TypedEventStreamEnvelopeCityUnregisterRequested": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/CityLifecyclePayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "city.unregister_requested",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope city.unregister_requested",
    "type": "object"
  },
  "TypedEventStreamEnvelopeControllerStarted": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/NoPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "controller.started",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope controller.started",
    "type": "object"
  },
  "TypedEventStreamEnvelopeControllerStopped": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/NoPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "controller.stopped",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope controller.stopped",
    "type": "object"
  },
  "TypedEventStreamEnvelopeConvoyClosed": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/NoPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "convoy.closed",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope convoy.closed",
    "type": "object"
  },
  "TypedEventStreamEnvelopeConvoyCreated": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/NoPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "convoy.created",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope convoy.created",
    "type": "object"
  },
  "TypedEventStreamEnvelopeCustom": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {},
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "not": {
          "enum": [
            "session.woke",
            "session.stopped",
            "session.crashed",
            "session.draining",
            "session.undrained",
            "session.quarantined",
            "session.idle_killed",
            "session.max_age_killed",
            "session.suspended",
            "session.updated",
            "session.drain_acked_with_assigned_work",
            "session.stranded",
            "session.work_query_failed",
            "bead.created",
            "bead.closed",
            "bead.updated",
            "mail.sent",
            "mail.read",
            "mail.archived",
            "mail.marked_read",
            "mail.marked_unread",
            "mail.replied",
            "mail.deleted",
            "convoy.created",
            "convoy.closed",
            "controller.started",
            "controller.stopped",
            "city.suspended",
            "city.resumed",
            "request.result.city.create",
            "request.result.city.unregister",
            "request.result.session.create",
            "request.result.session.message",
            "request.result.session.submit",
            "request.failed",
            "city.created",
            "city.unregister_requested",
            "order.fired",
            "order.completed",
            "order.failed",
            "provider.swapped",
            "worker.operation",
            "project.identity.stamped",
            "supervisor.fs_pressure.skipped_tick",
            "supervisor.shutdown_requested",
            "extmsg.bound",
            "extmsg.unbound",
            "extmsg.group_created",
            "extmsg.adapter_added",
            "extmsg.adapter_removed",
            "extmsg.inbound",
            "extmsg.outbound",
            "events.rotated",
            "gc.store.maintenance.done",
            "gc.store.maintenance.failed"
          ]
        },
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope custom",
    "type": "object"
  },
  "TypedEventStreamEnvelopeEventsRotated": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/RotatedPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "events.rotated",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope events.rotated",
    "type": "object"
  },
  "TypedEventStreamEnvelopeExtmsgAdapterAdded": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/AdapterEventPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "extmsg.adapter_added",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope extmsg.adapter_added",
    "type": "object"
  },
  "TypedEventStreamEnvelopeExtmsgAdapterRemoved": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/AdapterEventPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "extmsg.adapter_removed",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope extmsg.adapter_removed",
    "type": "object"
  },
  "TypedEventStreamEnvelopeExtmsgBound": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/BoundEventPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "extmsg.bound",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope extmsg.bound",
    "type": "object"
  },
  "TypedEventStreamEnvelopeExtmsgGroupCreated": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/GroupCreatedEventPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "extmsg.group_created",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope extmsg.group_created",
    "type": "object"
  },
  "TypedEventStreamEnvelopeExtmsgInbound": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/InboundEventPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "extmsg.inbound",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope extmsg.inbound",
    "type": "object"
  },
  "TypedEventStreamEnvelopeExtmsgOutbound": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/OutboundEventPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "extmsg.outbound",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope extmsg.outbound",
    "type": "object"
  },
  "TypedEventStreamEnvelopeExtmsgUnbound": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/UnboundEventPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "extmsg.unbound",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope extmsg.unbound",
    "type": "object"
  },
  "TypedEventStreamEnvelopeGcStoreMaintenanceDone": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/StoreMaintenanceDonePayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "gc.store.maintenance.done",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope gc.store.maintenance.done",
    "type": "object"
  },
  "TypedEventStreamEnvelopeGcStoreMaintenanceFailed": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/StoreMaintenanceFailedPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "gc.store.maintenance.failed",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope gc.store.maintenance.failed",
    "type": "object"
  },
  "TypedEventStreamEnvelopeMailArchived": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/MailEventPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "mail.archived",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope mail.archived",
    "type": "object"
  },
  "TypedEventStreamEnvelopeMailDeleted": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/MailEventPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "mail.deleted",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope mail.deleted",
    "type": "object"
  },
  "TypedEventStreamEnvelopeMailMarkedRead": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/MailEventPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "mail.marked_read",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope mail.marked_read",
    "type": "object"
  },
  "TypedEventStreamEnvelopeMailMarkedUnread": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/MailEventPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "mail.marked_unread",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope mail.marked_unread",
    "type": "object"
  },
  "TypedEventStreamEnvelopeMailRead": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/MailEventPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "mail.read",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope mail.read",
    "type": "object"
  },
  "TypedEventStreamEnvelopeMailReplied": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/MailEventPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "mail.replied",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope mail.replied",
    "type": "object"
  },
  "TypedEventStreamEnvelopeMailSent": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/MailEventPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "mail.sent",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope mail.sent",
    "type": "object"
  },
  "TypedEventStreamEnvelopeOrderCompleted": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/NoPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "order.completed",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope order.completed",
    "type": "object"
  },
  "TypedEventStreamEnvelopeOrderFailed": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/NoPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "order.failed",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope order.failed",
    "type": "object"
  },
  "TypedEventStreamEnvelopeOrderFired": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/NoPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "order.fired",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope order.fired",
    "type": "object"
  },
  "TypedEventStreamEnvelopeProjectIdentityStamped": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/ProjectIdentityStampedPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "project.identity.stamped",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope project.identity.stamped",
    "type": "object"
  },
  "TypedEventStreamEnvelopeProviderSwapped": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/NoPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "provider.swapped",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope provider.swapped",
    "type": "object"
  },
  "TypedEventStreamEnvelopeRequestFailed": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/RequestFailedPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "request.failed",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope request.failed",
    "type": "object"
  },
  "TypedEventStreamEnvelopeRequestResultCityCreate": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/CityCreateSucceededPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "request.result.city.create",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope request.result.city.create",
    "type": "object"
  },
  "TypedEventStreamEnvelopeRequestResultCityUnregister": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/CityUnregisterSucceededPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "request.result.city.unregister",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope request.result.city.unregister",
    "type": "object"
  },
  "TypedEventStreamEnvelopeRequestResultSessionCreate": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/SessionCreateSucceededPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "request.result.session.create",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope request.result.session.create",
    "type": "object"
  },
  "TypedEventStreamEnvelopeRequestResultSessionMessage": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/SessionMessageSucceededPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "request.result.session.message",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope request.result.session.message",
    "type": "object"
  },
  "TypedEventStreamEnvelopeRequestResultSessionSubmit": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/SessionSubmitSucceededPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "request.result.session.submit",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope request.result.session.submit",
    "type": "object"
  },
  "TypedEventStreamEnvelopeSessionCrashed": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/SessionLifecyclePayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "session.crashed",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope session.crashed",
    "type": "object"
  },
  "TypedEventStreamEnvelopeSessionDrainAckedWithAssignedWork": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/SessionDrainAckedWithAssignedWorkPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "session.drain_acked_with_assigned_work",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope session.drain_acked_with_assigned_work",
    "type": "object"
  },
  "TypedEventStreamEnvelopeSessionDraining": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/NoPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "session.draining",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope session.draining",
    "type": "object"
  },
  "TypedEventStreamEnvelopeSessionIdleKilled": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/NoPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "session.idle_killed",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope session.idle_killed",
    "type": "object"
  },
  "TypedEventStreamEnvelopeSessionMaxAgeKilled": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/NoPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "session.max_age_killed",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope session.max_age_killed",
    "type": "object"
  },
  "TypedEventStreamEnvelopeSessionQuarantined": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/NoPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "session.quarantined",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope session.quarantined",
    "type": "object"
  },
  "TypedEventStreamEnvelopeSessionStopped": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/SessionLifecyclePayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "session.stopped",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope session.stopped",
    "type": "object"
  },
  "TypedEventStreamEnvelopeSessionStranded": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/NoPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "session.stranded",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope session.stranded",
    "type": "object"
  },
  "TypedEventStreamEnvelopeSessionSuspended": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/NoPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "session.suspended",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope session.suspended",
    "type": "object"
  },
  "TypedEventStreamEnvelopeSessionUndrained": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/NoPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "session.undrained",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope session.undrained",
    "type": "object"
  },
  "TypedEventStreamEnvelopeSessionUpdated": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/NoPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "session.updated",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope session.updated",
    "type": "object"
  },
  "TypedEventStreamEnvelopeSessionWoke": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/NoPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "session.woke",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope session.woke",
    "type": "object"
  },
  "TypedEventStreamEnvelopeSessionWorkQueryFailed": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/SessionLifecyclePayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "session.work_query_failed",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope session.work_query_failed",
    "type": "object"
  },
  "TypedEventStreamEnvelopeSupervisorFsPressureSkippedTick": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/SupervisorFSPressureSkippedTickPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "supervisor.fs_pressure.skipped_tick",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope supervisor.fs_pressure.skipped_tick",
    "type": "object"
  },
  "TypedEventStreamEnvelopeSupervisorShutdownRequested": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/SupervisorShutdownPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "supervisor.shutdown_requested",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope supervisor.shutdown_requested",
    "type": "object"
  },
  "TypedEventStreamEnvelopeWorkerOperation": {
    "additionalProperties": false,
    "properties": {
      "actor": {
        "type": "string"
      },
      "message": {
        "type": "string"
      },
      "payload": {
        "$ref": "#/components/schemas/WorkerOperationEventPayload"
      },
      "seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "subject": {
        "type": "string"
      },
      "ts": {
        "format": "date-time",
        "type": "string"
      },
      "type": {
        "const": "worker.operation",
        "type": "string"
      },
      "workflow": {
        "$ref": "#/components/schemas/WorkflowEventProjection"
      }
    },
    "required": [
      "seq",
      "type",
      "ts",
      "actor",
      "payload"
    ],
    "title": "TypedEventStreamEnvelope worker.operation",
    "type": "object"
  },
  "UnboundEventPayload": {
    "additionalProperties": false,
    "properties": {
      "count": {
        "format": "int64",
        "type": "integer"
      },
      "session_id": {
        "type": "string"
      }
    },
    "required": [
      "session_id",
      "count"
    ],
    "type": "object"
  },
  "WorkerOperationEventPayload": {
    "additionalProperties": false,
    "properties": {
      "agent_name": {
        "description": "Qualified agent identity (best-effort, absent if the session has no agent_name metadata or alias).",
        "type": "string"
      },
      "bead_id": {
        "description": "Work bead this operation is acting on (best-effort, may be absent for non-bead-scoped ops).",
        "type": "string"
      },
      "cache_creation_tokens": {
        "description": "Input tokens written into the prompt cache (best-effort, currently always absent).",
        "format": "int64",
        "type": "integer"
      },
      "cache_read_tokens": {
        "description": "Cached input tokens read (best-effort, currently always absent).",
        "format": "int64",
        "type": "integer"
      },
      "completion_tokens": {
        "description": "Output tokens (best-effort, currently always absent).",
        "format": "int64",
        "type": "integer"
      },
      "cost_usd_estimate": {
        "description": "Estimated invocation cost in USD (best-effort, currently always absent; see #1255 for pricing seam).",
        "format": "double",
        "type": "number"
      },
      "delivered": {
        "type": "boolean"
      },
      "duration_ms": {
        "format": "int64",
        "type": "integer"
      },
      "error": {
        "type": "string"
      },
      "finished_at": {
        "format": "date-time",
        "type": "string"
      },
      "latency_ms": {
        "description": "LLM invocation wall-clock latency (best-effort, currently always absent — no source).",
        "format": "int64",
        "type": "integer"
      },
      "model": {
        "description": "LLM model identifier (best-effort, may be absent until follow-up wiring lands).",
        "type": "string"
      },
      "op_id": {
        "type": "string"
      },
      "operation": {
        "type": "string"
      },
      "prompt_sha": {
        "description": "SHA-256 of the rendered prompt (best-effort, currently always absent; #1256 follow-up).",
        "type": "string"
      },
      "prompt_tokens": {
        "description": "Non-cached input tokens (best-effort, currently always absent; treat zero as 'not measured', not 'free').",
        "format": "int64",
        "type": "integer"
      },
      "prompt_version": {
        "description": "Template version frontmatter (best-effort, currently always absent; #1256 follow-up).",
        "type": "string"
      },
      "provider": {
        "type": "string"
      },
      "queued": {
        "type": "boolean"
      },
      "result": {
        "type": "string"
      },
      "session_id": {
        "type": "string"
      },
      "session_name": {
        "type": "string"
      },
      "started_at": {
        "format": "date-time",
        "type": "string"
      },
      "template": {
        "type": "string"
      },
      "transport": {
        "type": "string"
      }
    },
    "required": [
      "op_id",
      "operation",
      "result",
      "started_at",
      "finished_at",
      "duration_ms"
    ],
    "type": "object"
  },
  "WorkflowAttemptSummary": {
    "additionalProperties": false,
    "properties": {
      "active_attempt": {
        "format": "int64",
        "type": "integer"
      },
      "attempt_count": {
        "format": "int64",
        "type": "integer"
      },
      "max_attempts": {
        "format": "int64",
        "type": "integer"
      }
    },
    "required": [
      "attempt_count",
      "active_attempt"
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
  "WorkflowEventProjection": {
    "additionalProperties": false,
    "properties": {
      "attempt_summary": {
        "$ref": "#/components/schemas/WorkflowAttemptSummary"
      },
      "bead": {
        "$ref": "#/components/schemas/WorkflowBeadResponse"
      },
      "changed_fields": {
        "items": {
          "type": "string"
        },
        "type": [
          "array",
          "null"
        ]
      },
      "event_seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      },
      "event_ts": {
        "type": "string"
      },
      "event_type": {
        "type": "string"
      },
      "logical_node_id": {
        "type": "string"
      },
      "requires_resync": {
        "type": "boolean"
      },
      "root_bead_id": {
        "type": "string"
      },
      "root_store_ref": {
        "type": "string"
      },
      "scope_kind": {
        "type": "string"
      },
      "scope_ref": {
        "type": "string"
      },
      "type": {
        "type": "string"
      },
      "watch_generation": {
        "type": "string"
      },
      "workflow_id": {
        "type": "string"
      },
      "workflow_seq": {
        "format": "int64",
        "minimum": 0,
        "type": "integer"
      }
    },
    "required": [
      "type",
      "workflow_id",
      "root_bead_id",
      "root_store_ref",
      "scope_kind",
      "scope_ref",
      "watch_generation",
      "event_seq",
      "workflow_seq",
      "event_ts",
      "event_type",
      "bead",
      "changed_fields",
      "logical_node_id"
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
