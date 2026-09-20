# 04 · Structured output

**Goal:** get an answer as typed fields your code can use, not prose.
**Dictionary words:** structured output, hallucination, evals.

## What happens
You describe the shape you want with a Zod schema. The SDK turns it into an output format, the API makes the model's answer fit it, and `parse()` hands you a typed object. No regex, no "please reply in JSON".

## Steps
1. In `exercise.ts`, complete the `CropPlan` schema. Give every field a `.describe()` so the model knows what goes where.
2. Call `client.messages.parse` with `output_config.format = zodOutputFormat(CropPlan)`.
3. Run: `npm run ex -- 04`

## Done when
- `parsed_output` is not null and the fields have the right types.
- The checks pass.

## Notice
- `parsed_output` is `null` when the output could not be parsed. Always guard it.
- A schema is also a contract you can test against. Exercise 11 builds on this.
