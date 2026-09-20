# 13 · Memory: remember between conversations

**Goal:** save facts after a conversation and load them into the next one.
**Dictionary words:** memory, context window, structured output.

## What happens
The model never remembers. Your app does. After a conversation you ask the model to list new facts about the farmer as structured output, merge them into `data/memory.json`, and next time you put those facts into the system prompt. Two separate conversations then feel like one.

## Steps
1. In `exercise.ts`, implement `loadMemory()` and `saveMemory()` around `data/memory.json`.
2. Turn 1: the farmer describes their land. Afterwards, extract facts and save.
3. Turn 2: a brand new conversation with no history, only the saved facts in the system prompt. Ask something that needs them.
4. Run: `npm run ex -- 13`

## Done when
- `data/memory.json` contains facts after turn 1.
- Turn 2 answers correctly with no history.

## Notice
- Keep memory small and factual. Ten short facts beat a saved transcript.
- Decide what must never be stored. Memory is data about a person.
