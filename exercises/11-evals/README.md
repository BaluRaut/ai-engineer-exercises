# 11 · Evals: know whether a change helped

**Goal:** run a fixed set of questions with expected answers, score them, and keep the results.
**Dictionary words:** evals, bias, hallucination.

## What happens
`data/evals.json` holds questions and the keywords a good answer must contain. You run every question through the advisor, score each one, print a table, and save the results with a timestamp. Change the system prompt, run again, compare. That is the whole loop of improving an AI app.

## Steps
1. In `exercise.ts`, implement `score(answer, expectAny)`: true if any expected keyword appears, case-insensitive.
2. Run all questions with limited concurrency (`mapLimit` from `src/lib/client.ts`).
3. Write the results to `results/evals-<timestamp>.json`.
4. Run: `npm run ex -- 11`. Then edit the system prompt and run again.

## Done when
- A table prints with pass or fail per question and a total.
- A results file exists under `results/`.

## Notice
- Keyword checks are crude but honest. Later, use a second model as a grader with a rubric.
- Never tune the prompt against the same eval set forever. Keep a few questions you do not look at.
