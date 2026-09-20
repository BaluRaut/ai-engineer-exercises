# 07 · The agent loop, by hand

**Goal:** write the think, act, look, repeat loop yourself, so you know what the tool runner hides.
**Dictionary words:** agent, agentic AI, context window.

## What happens
You give the model a goal and two tools: list the notes, read one note. You call the API, look at `stop_reason`. If it is `tool_use`, you run each requested tool, append the results as a user turn, and call again. When it is `end_turn`, the model has answered.

## Steps
1. In `exercise.ts`, implement `executeTool` for `list_notes` and `read_note`.
2. Finish the loop: append the assistant turn, run the tools, append a user turn with `tool_result` blocks, repeat.
3. Run: `npm run ex -- 07`

## Done when
- The loop ends with `end_turn` in six iterations or fewer.
- The answer gives the tur seed rate from the notes and names the file.

## Notice
- Put all tool results for one turn into a single user message. Splitting them teaches the model to stop calling tools in parallel.
- Always cap iterations. An agent without a cap can loop forever and spend real money.
