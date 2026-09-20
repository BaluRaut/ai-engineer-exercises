# 03 · A conversation is a list you send every time

**Goal:** hold a multi-turn chat and prove the model only knows what you resend.
**Dictionary words:** context window, token, memory.

## What happens
The API is stateless. Nothing is remembered between calls. A "conversation" is just the full list of earlier messages that you send again with each new one. That list is what fills the context window.

## Steps
1. In `exercise.ts`, build a `messages` array with a user turn, an assistant turn, and a new user question.
2. Send it, then append the model's reply to the list, then ask a follow-up.
3. Run: `npm run ex -- 03`

## Done when
- The model answers the follow-up using something said two turns earlier.
- The check passes.

## Notice
- Use the SDK type `Anthropic.MessageParam[]` for the list. Do not invent your own message interface.
- Every turn resends everything, so long chats cost more each turn. That is why exercise 13 (memory) and prompt caching exist.
