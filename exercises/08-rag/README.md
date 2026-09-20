# 08 · RAG: look it up, then answer

**Goal:** answer from your own documents by retrieving the right pieces first.
**Dictionary words:** RAG, embedding, vector database, hallucination.

## What happens
Retrieval-augmented generation has two halves. Retrieve: find the few chunks of your notes that match the question. Generate: paste them into the prompt with the question and tell the model to answer only from them, with citations.

This exercise uses a tiny keyword scorer so you can see every moving part. Real systems use embeddings and a vector database; the shape of the code is the same, only `retrieve()` changes.

## Steps
1. In `exercise.ts`, implement `retrieve(question, k)`: split the question into words, score every chunk by how many question words it contains (rarer words count more), return the top `k`.
2. Build the prompt: number the chunks `[1]`, `[2]`, `[3]`, then the question.
3. Run: `npm run ex -- 08`

## Done when
- The top chunk comes from `soybean.md`.
- The answer contains the seed rate and cites a source number.

## Notice
- The system prompt must say "answer only from the sources, say so if they do not cover it". That single line is what turns retrieval into fewer hallucinations.
- When you move to embeddings, keep the same interface: `retrieve(question, k) -> Chunk[]`.
