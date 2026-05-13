import { defineConfig, enforceTdd } from '@nizos/probity'
import { query } from '@anthropic-ai/claude-agent-sdk'

// Pin probity's TDD validator to Haiku for cost. Without this override,
// probity inherits whichever model the host agent's session uses
// (Sonnet/Opus on Claude Code), which is overkill for verdict judgments.
//
// Note: this routes ALL validations through the Anthropic SDK regardless
// of the host agent (--agent claude-code|codex|github-copilot). It needs
// Anthropic auth — your Claude Code login is reused automatically; if
// you're not logged into Claude Code on this machine, set ANTHROPIC_API_KEY.
//
// To use the host session's default model instead, delete the `ai` field
// from defineConfig() below (and you can drop this validator block entirely).
const haikuValidator = {
  async reason(prompt) {
    try {
      return parseVerdict(await runHaiku(prompt))
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error)
      return { kind: 'violation', reason }
    }
  },
}

async function runHaiku(prompt) {
  const stream = query({
    prompt,
    options: {
      model: 'haiku',
      maxTurns: 1,
      thinking: { type: 'disabled' },
      permissionMode: 'dontAsk',
      allowedTools: [],
      settingSources: [],
      persistSession: false,
      // Defense in depth: allowedTools=[] already blocks tool use,
      // but explicitly disallowing every known tool guarantees the
      // validator can't act even if SDK defaults drift.
      disallowedTools: [
        'Bash', 'Write', 'Edit', 'MultiEdit', 'NotebookEdit',
        'Read', 'Grep', 'Glob', 'WebFetch', 'WebSearch',
        'Task', 'TodoWrite',
      ],
    },
  })
  for await (const message of stream) {
    if (message.type === 'result' && message.subtype === 'success') {
      if (typeof message.result !== 'string') {
        throw new Error(`expected string result, got ${typeof message.result}`)
      }
      return message.result
    }
  }
  throw new Error('SDK query stream ended without a success result')
}

// Parse the validator's JSON verdict, tolerating ```json fences and
// prose preceding the object (mirrors probity's internal toVerdict).
function parseVerdict(text) {
  const parsed = tryParseJson(text)
  if (!parsed || typeof parsed !== 'object') {
    return { kind: 'violation', reason: `could not parse verdict: ${text.slice(0, 4000)}` }
  }
  if (parsed.kind !== 'pass' && parsed.kind !== 'violation') {
    return { kind: 'violation', reason: `unexpected verdict kind: ${parsed.kind}` }
  }
  if (typeof parsed.reason !== 'string') {
    return { kind: 'violation', reason: 'verdict missing string reason' }
  }
  return { kind: parsed.kind, reason: parsed.reason }
}

function tryParseJson(text) {
  return safeParse(text.trim()) ?? safeParse(stripFence(text)) ?? findEmbeddedObject(text)
}

function safeParse(text) {
  try { return JSON.parse(text) } catch { return undefined }
}

function stripFence(text) {
  return text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '').trim()
}

function findEmbeddedObject(text) {
  const opens = [...text.matchAll(/\{/g)].map((m) => m.index ?? 0).reverse()
  for (const start of opens) {
    const span = scanBalanced(text, start)
    const parsed = span === undefined ? undefined : safeParse(span)
    if (parsed !== undefined) return parsed
  }
  return undefined
}

function scanBalanced(text, start) {
  let depth = 0, inString = false, escape = false
  for (let i = start; i < text.length; i++) {
    const c = text[i]
    if (escape) escape = false
    else if (inString) {
      if (c === '\\') escape = true
      else if (c === '"') inString = false
    } else if (c === '"') inString = true
    else if (c === '{') depth++
    else if (c === '}' && --depth === 0) return text.slice(start, i + 1)
  }
  return undefined
}

export default defineConfig({
  ai: haikuValidator,
  rules: [
    {
      files: ['src/**', 'tests/**'],
      rules: [enforceTdd()],
    },
  ],
})
