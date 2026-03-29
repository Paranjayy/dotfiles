# Antigravity Auth Plugin for OpenCode

Access Claude Opus 4.6, Sonnet 4.6, Gemini 3.1 Pro and more via Google OAuth.

## What Is This?

[opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth) is a plugin that lets OpenCode authenticate against Google's Antigravity API (Google's IDE). You get access to premium AI models using your Google account credentials.

**What You Get:**
- Claude Opus 4.6, Sonnet 4.6, and Gemini 3.1 Pro/Flash via Google OAuth
- Multi-account support (add multiple Google accounts, auto-rotates when rate-limited)
- Dual quota system (access both Antigravity and Gemini CLI quotas)
- Thinking models with extended thinking and configurable budgets
- Google Search grounding for Gemini models
- Auto-recovery from session errors and tool failures

## Models Available

### Antigravity Quota (Default)

| Model | Variants | Notes |
|-------|----------|-------|
| `antigravity-claude-opus-4-6-thinking` | low, max | Claude Opus 4.6 with extended thinking |
| `antigravity-claude-sonnet-4-6` | — | Claude Sonnet 4.6 |
| `antigravity-gemini-3.1-pro` | low, high | Gemini 3.1 Pro with thinking |
| `antigravity-gemini-3-pro` | low, high | Gemini 3 Pro with thinking |
| `antigravity-gemini-3-flash` | minimal, low, medium, high | Gemini 3 Flash with thinking |

### Gemini CLI Quota (Separate Pool)

| Model | Notes |
|-------|-------|
| `gemini-2.5-flash` | Gemini 2.5 Flash |
| `gemini-2.5-pro` | Gemini 2.5 Pro |
| `gemini-3-flash-preview` | Gemini 3 Flash (preview) |
| `gemini-3-pro-preview` | Gemini 3 Pro (preview) |
| `gemini-3.1-pro-preview` | Gemini 3.1 Pro (preview) |

## Installation

### Quick Install (via LLM)

Paste this into any AI assistant:

```
Install the opencode-antigravity-auth plugin and add Antigravity model definitions to ~/.config/opencode/opencode.json by following: https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/dev/README.md
```

### Manual Install

**1. Add plugin** to `~/.config/opencode/opencode.json`:

```json
{
  "plugin": ["opencode-antigravity-auth@latest"]
}
```

> Want bleeding-edge features? Use `opencode-antigravity-auth@beta` instead.

**2. Login** with Google:

```bash
opencode auth login
```

**3. Add models** to your opencode.json (copy-paste ready):

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-antigravity-auth@latest"],
  "provider": {
    "google": {
      "models": {
        "antigravity-gemini-3-pro": {
          "name": "Gemini 3 Pro (Antigravity)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingLevel": "low" },
            "high": { "thinkingLevel": "high" }
          }
        },
        "antigravity-gemini-3.1-pro": {
          "name": "Gemini 3.1 Pro (Antigravity)",
          "limit": { "context": 1048576, "output": 65535 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingLevel": "low" },
            "high": { "thinkingLevel": "high" }
          }
        },
        "antigravity-gemini-3-flash": {
          "name": "Gemini 3 Flash (Antigravity)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "minimal": { "thinkingLevel": "minimal" },
            "low": { "thinkingLevel": "low" },
            "medium": { "thinkingLevel": "medium" },
            "high": { "thinkingLevel": "high" }
          }
        },
        "antigravity-claude-sonnet-4-6": {
          "name": "Claude Sonnet 4.6 (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "antigravity-claude-opus-4-6-thinking": {
          "name": "Claude Opus 4.6 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "gemini-2.5-flash": {
          "name": "Gemini 2.5 Flash (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        },
        "gemini-2.5-pro": {
          "name": "Gemini 2.5 Pro (Gemini CLI)",
          "limit": { "context": 1048576, "output": 65536 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        }
      }
    }
  }
}
```

**4. Test it:**

```bash
opencode run "Hello" --model=google/antigravity-claude-opus-4-6-thinking --variant=max
```

## Multi-Account Setup

Add multiple Google accounts for higher combined quotas. The plugin automatically rotates when rate-limited.

```bash
opencode auth login  # Run again to add more accounts
```

**Account management options** (via `opencode auth login`):
- Configure models — auto-configure all plugin models in opencode.json
- Check quotas — view remaining API quota for each account
- Manage accounts — enable/disable specific accounts for rotation

### Account Rotation Strategies

| Accounts | Recommended Strategy |
|----------|---------------------|
| 1 | `"sticky"` |
| 2-5 | `"hybrid"` (default) |
| 5+ | `"round-robin"` |

## Configuration

Optional settings in `~/.config/opencode/antigravity.json`:

```json
{
  "$schema": "https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/main/assets/antigravity.schema.json",
  "quiet_mode": false,
  "debug": false,
  "session_recovery": true,
  "account_selection_strategy": "hybrid"
}
```

### Key Options

| Option | Default | What It Does |
|--------|---------|--------------|
| `quiet_mode` | false | Hide toast notifications |
| `debug` | false | Enable debug file logging |
| `session_recovery` | true | Auto-recover from tool errors |
| `cli_first` | false | Route Gemini models to CLI quota first |
| `account_selection_strategy` | hybrid | How to rotate between accounts |

### Rate Limit Scheduling

| Option | Default | What It Does |
|--------|---------|--------------|
| `scheduling_mode` | cache_first | `cache_first` = wait for same account, `balance` = switch immediately, `performance_first` = round-robin |
| `max_cache_first_wait_seconds` | 60 | Max seconds to wait before switching accounts |

## File Locations

| File | Path |
|------|------|
| Main config | `~/.config/opencode/opencode.json` |
| Accounts | `~/.config/opencode/antigravity-accounts.json` |
| Plugin config | `~/.config/opencode/antigravity.json` |
| Debug logs | `~/.config/opencode/antigravity-logs/` |

## Troubleshooting

### Reset Everything

```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```

### 403 Permission Denied (`rising-fact-p41fc`)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable **Gemini for Google Cloud API** (`cloudaicompanion.googleapis.com`)
4. Add `projectId` to your accounts file

### Safari OAuth Issues

Safari's HTTPS-Only Mode blocks localhost callback. Use Chrome/Firefox or disable temporarily in Safari > Settings > Privacy.

### Port Conflict (Address Already in Use)

```bash
# Find process using the port
lsof -i :51121

# Kill if stale
kill -9 <PID>

# Retry
opencode auth login
```

### Gemini Model Not Found

Add npm provider to your google config:

```json
{
  "provider": {
    "google": {
      "npm": "@ai-sdk/google",
      "models": { ... }
    }
  }
}
```

## Using with Oh-My-OpenCode

Disable built-in Google auth to prevent conflicts:

```json
{
  "google_auth": false,
  "agents": {
    "frontend-ui-ux-engineer": { "model": "google/antigravity-gemini-3-pro" },
    "document-writer": { "model": "google/antigravity-gemini-3-flash" }
  }
}
```

## Plugin Compatibility

### @tarquinen/opencode-dcp

List antigravity-auth BEFORE DCP:

```json
{
  "plugin": [
    "opencode-antigravity-auth@latest",
    "@tarquinen/opencode-dcp@latest"
  ]
}
```

## Environment Variables

```bash
OPENCODE_CONFIG_DIR=/path/to/config opencode  # Custom config directory
OPENCODE_ANTIGRAVITY_DEBUG=1 opencode         # Enable debug logging
OPENCODE_ANTIGRAVITY_DEBUG_TUI=1 opencode     # Show debug in TUI
```

---

**Warning:** Using this plugin may violate Google's Terms of Service. Some users have reported account restrictions. Use at your own risk.

**Repo:** [github.com/NoeFabris/opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth)
