# 05 · Streaming

**Goal:** show words as they are generated, and measure why that matters.
**Dictionary words:** streaming, latency, token.

## What happens
`client.messages.stream()` keeps the connection open and emits events as tokens arrive. You print each text delta at once, then call `finalMessage()` to get the complete message with usage.

## Steps
1. In `exercise.ts`, iterate the stream and write each `text_delta` to stdout.
2. Record the time of the first text delta and the time the stream ends.
3. Run: `npm run ex -- 05`

## Done when
- Text appears progressively, not all at once.
- The check shows time-to-first-token is well below total time.

## Notice
- Use `process.stdout.write`, not `console.log`, or every delta gets its own line.
- Never wrap stream events in `new Promise` to collect the message. `finalMessage()` already does that, including errors and aborts.
