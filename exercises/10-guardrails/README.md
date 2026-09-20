# 10 · Guardrails

**Goal:** keep the advisor on task, and handle the case where the model itself declines.
**Dictionary words:** guardrails, alignment, structured output, system prompt.

## What happens
Three layers, cheapest first:
1. **Scope check before answering.** A small structured-output call classifies the question as in scope or not. Out-of-scope questions get a fixed polite reply and never reach the expensive call.
2. **Scoped system prompt.** Even in-scope questions run under a system prompt that states the limits.
3. **Refusal handling.** The model can decline on its own (`stop_reason === "refusal"`). Your code must check `stop_reason` before reading content, and can opt into server-side fallbacks so a decline is retried on another model inside the same call.

## Steps
1. In `exercise.ts`, complete the `Scope` schema and the classifier call.
2. Route: out of scope gets the fixed reply, in scope gets the advisor.
3. Read the fallback section in `solution.ts`; it is already wired in the exercise for you to run.
4. Run: `npm run ex -- 10`

## Done when
- The onion question is in scope, the motorcycle question is not.
- The benign advisor call does not end with `refusal`.

## Notice
- A classifier that returns a boolean is cheap, fast, and testable. Prefer it over hoping the big prompt behaves.
- Always branch on `stop_reason` before using `content`. A refusal returns HTTP 200.
