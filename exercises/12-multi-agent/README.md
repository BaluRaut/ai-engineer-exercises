# 12 · Multi-agent: split, work in parallel, combine

**Goal:** one main agent plans, three workers run at the same time, the main agent merges.
**Dictionary words:** multi-agent, agent, structured output.

## What happens
The farmer has three fields. Instead of one long call, you send one call per field, all at once, each returning a typed `FieldPlan`. Then a final call reads the three plans and writes one combined summary. Workers get narrow prompts and clean context; the main call gets only the short results.

## Steps
1. In `exercise.ts`, complete the `FieldPlan` schema.
2. Run the three worker calls with `Promise.all`.
3. Write the combine call: give it the three plans and ask for one plan the farmer can act on.
4. Run: `npm run ex -- 12`

## Done when
- Three parsed plans come back, each with a positive seed quantity.
- The combined summary names every field.

## Notice
- Parallel calls are faster but hit rate limits sooner. Use `mapLimit` when you have many.
- Workers should return short structured results, not essays. The main agent's context is precious.
