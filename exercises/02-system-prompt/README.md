# 02 · System prompt

**Goal:** give the model a standing job, then see how the same question gets a different answer.
**Dictionary words:** system prompt, prompt, guardrails.

## What happens
The `system` field is sent above the conversation on every request. It sets who the model is, what it may do, and how to answer. The user never sees it. Here you turn a general assistant into a seed advisor for Maharashtra farmers who answers in Marathi.

## Steps
1. In `exercise.ts`, the first call has no system prompt. Leave it.
2. Write a system prompt for the second call: role, audience, language, and one hard limit.
3. Run: `npm run ex -- 02`

## Done when
- The second answer is in Marathi (Devanagari script).
- The second answer stays on farming.

## Notice
- The system prompt is the cheapest, strongest lever you have. Most "the model does not behave" problems are a weak system prompt.
- Keep it stable. A system prompt that changes on every request also breaks prompt caching (exercise 09).
