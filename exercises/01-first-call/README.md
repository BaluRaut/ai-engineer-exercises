# 01 · Your first call

**Goal:** send one message to Claude from TypeScript and read the answer back.
**Dictionary words:** API, API key, model, token, inference.

## What happens
Your code builds a request (model, a token limit, your message), sends it over the API, and gets a response back. The response is a list of content blocks, not a plain string. You pick out the text blocks.

## Steps
1. Open `exercise.ts` and fill in the two `TODO`s.
2. Run it: `npm run ex -- 01`
3. Stuck? Read `solution.ts`, or run `npm run ex -- 01 --solution`.

## Done when
- The answer prints, and the usage line shows input and output tokens.
- Both checks pass.

## Notice
- Narrow on `block.type === "text"` before touching `.text`. TypeScript will not let you skip this, and that is a feature.
- Every token in and out is billed. Look at the numbers on every exercise so it becomes a habit.
