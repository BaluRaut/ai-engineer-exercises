# 06 · Tools: give the model hands

**Goal:** let the model call a function you wrote, and use the result in its answer.
**Dictionary words:** tool (function calling), agent, hallucination.

## What happens
You describe a tool with a name, a description, and a Zod input schema, plus a `run` function. The tool runner sends the description to the model. When the model decides to call it, the SDK runs your function, sends the result back, and loops until the model answers in words.

## Steps
1. In `exercise.ts`, finish the `get_mandi_price` tool: write the description and the `run` function that reads from the `PRICES` table.
2. Pass it to `client.beta.messages.toolRunner(...)` and await the final message.
3. Run: `npm run ex -- 06`

## Done when
- The tool ran at least once (the counter proves it).
- The answer contains the price from the table, not an invented one.

## Notice
- The description is what the model reads to decide when to call the tool. Write it for the model, not for yourself.
- Without the tool, the model would guess a price. That is a hallucination. With the tool, the number is real.
