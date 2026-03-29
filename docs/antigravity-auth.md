# 🔐 Antigravity Auth Plugin for OpenCode

> Access Claude Opus 4.6, Gemini 3.1 Pro and more via Google OAuth.

## What Is This?

[opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth) is a plugin that lets OpenCode authenticate against Google's **Antigravity** API. You get access to premium models using your Google account.

## Models Available

| Model | Quota | Variants |
|-------|-------|----------|
| Claude Opus 4.6 (thinking) | Antigravity | low, max |
| Claude Sonnet 4.6 | Antigravity | — |
| Gemini 3.1 Pro | Antigravity | low, high |
| Gemini 3 Pro | Antigravity | low, high |
| Gemini 3 Flash | Antigravity | minimal, low, medium, high |
| Gemini 2.5 Pro | Gemini CLI | — |
| Gemini 2.5 Flash | Gemini CLI | — |

## Installation

### Quick Install (via LLM)

Paste this into any AI assistant:

```
Install the opencode-antigravity-auth plugin and add Antigravity model definitions to ~/.config/opencode/opencode.json by following: https://raw.githubusercontent.com/NoeFabris/opencode-antigravity-auth/dev/README.md
```

### Manual Install

1. **Add plugin** to `~/.config/opencode/opencode.json`:

```json
{
  "plugin": ["opencode-antigravity-auth@latest"]
}
```

2. **Login** with Google:

```bash
opencode auth login
```

3. **Add models** to `opencode.json`:

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
        "antigravity-claude-opus-4-6-thinking": {
          "name": "Claude Opus 4.6 Thinking (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] },
          "variants": {
            "low": { "thinkingConfig": { "thinkingBudget": 8192 } },
            "max": { "thinkingConfig": { "thinkingBudget": 32768 } }
          }
        },
        "antigravity-claude-sonnet-4-6": {
          "name": "Claude Sonnet 4.6 (Antigravity)",
          "limit": { "context": 200000, "output": 64000 },
          "modalities": { "input": ["text", "image", "pdf"], "output": ["text"] }
        }
      }
    }
  }
}
```

4. **Test it:**

```bash
opencode run "Hello" --model=google/antigravity-claude-opus-4-6-thinking --variant=max
```

## Multi-Account Setup

Add multiple Google accounts for higher quotas:

```bash
opencode auth login  # Run again to add more accounts
```

The plugin auto-rotates when rate-limited.

## ⚠️ Warning

> Using this plugin may violate Google's Terms of Service. Some users have reported account bans. Use at your own risk.

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

### Account Rotation Strategies

| Accounts | Strategy |
|----------|----------|
| 1 | `"sticky"` |
| 2-5 | `"hybrid"` (default) |
| 5+ | `"round-robin"` |

## Troubleshooting

### Reset Everything

```bash
rm ~/.config/opencode/antigravity-accounts.json
opencode auth login
```

### 403 Permission Denied

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select a project
3. Enable **Gemini for Google Cloud API**
4. Add `projectId` to accounts file

### Safari OAuth Issues

Safari's HTTPS-Only Mode blocks localhost callback. Use Chrome/Firefox or disable temporarily.

---

**Repo:** [github.com/NoeFabris/opencode-antigravity-auth](https://github.com/NoeFabris/opencode-antigravity-auth)
