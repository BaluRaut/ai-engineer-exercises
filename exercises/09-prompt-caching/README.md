# 09 · Prompt caching

**Goal:** stop paying full price for the same long instructions on every request.
**Dictionary words:** prompt caching, context window, token, latency.

## What happens
Caching is a prefix match. If the start of your request is byte-for-byte the same as a recent request, the API reuses the work it already did on that part. Cached tokens cost a fraction and return faster. Anything that changes must come after the cache point.

## Steps
1. In `exercise.ts`, put all the crop notes into the system prompt as a text block with `cache_control: { type: "ephemeral" }`.
2. Make two calls with different questions. Print the usage line for each.
3. Run: `npm run ex -- 09`

## Done when
- The first call shows a cache write, the second shows a cache read.

## Notice
- If the second call shows zero cache read, the prefix is probably under the model's minimum cacheable size. Add more notes, or check that nothing in the system prompt changes between calls (a timestamp, a random id, a different order).
- Stable content first, changing content last. This rule shapes how you build every prompt from now on.
