# AI Engineer Exercises

**📘 [Read the guide and study plan →](https://baluraut.github.io/ai-engineer-exercises/)**

Thirteen hands-on exercises for learning to build with the Claude API, in TypeScript. Every exercise is a small program you finish yourself, with checks that tell you when it works. The examples come from one domain, kharif farming in Maharashtra, so what you learn in one exercise carries into the next.

Companion pages, in English and Marathi:
- [AI Dictionary for Beginners](https://claude.ai/artifact/JfQwvcTjXvcqgrfTvQQSmv), the words used here, each with before, what, how, why, and an analogy
- [Agents for Beginners](https://claude.ai/artifact/4d2QHxQyBG3QGnMwN4pP2N), LLMs, agentic AI, agents, and multi-agents explained with diagrams

## The path

| # | Exercise | You learn | Dictionary words |
|---|----------|-----------|------------------|
| 01 | [First call](exercises/01-first-call) | Send a message, read text blocks, watch tokens | API, model, token, inference |
| 02 | [System prompt](exercises/02-system-prompt) | Give the model a standing job | system prompt, prompt |
| 03 | [Conversation](exercises/03-conversation) | The API is stateless; you resend history | context window, memory |
| 04 | [Structured output](exercises/04-structured-output) | Typed answers with a Zod schema | structured output |
| 05 | [Streaming](exercises/05-streaming) | Show words as they arrive, measure latency | streaming, latency |
| 06 | [Tools](exercises/06-tools) | Let the model call your function | tool, hallucination |
| 07 | [Agent loop](exercises/07-agent-loop) | Think, act, look, repeat, written by hand | agent, agentic AI |
| 08 | [RAG](exercises/08-rag) | Retrieve your documents, then answer with citations | RAG, embedding, vector database |
| 09 | [Prompt caching](exercises/09-prompt-caching) | Stop paying for the same prefix twice | prompt caching |
| 10 | [Guardrails](exercises/10-guardrails) | Scope check, scoped prompt, refusal handling | guardrails, alignment |
| 11 | [Evals](exercises/11-evals) | Score a fixed question set, keep the results | evals, bias |
| 12 | [Multi-agent](exercises/12-multi-agent) | Split work, run workers in parallel, combine | multi-agent |
| 13 | [Memory](exercises/13-memory) | Save facts, load them next conversation | memory |

Do them in order. Each one assumes the ones before it.

## Setup

The [project site](https://baluraut.github.io/ai-engineer-exercises/) has these steps with more explanation, plus a four-week study plan and a troubleshooting list.

You need Node 20 or newer and a Claude API key.

```bash
git clone https://github.com/BaluRaut/ai-engineer-exercises.git
cd ai-engineer-exercises
npm install
export ANTHROPIC_API_KEY=sk-ant-...     # or: ant auth login
npm run list
```

Windows PowerShell: `$env:ANTHROPIC_API_KEY = "sk-ant-..."`.

## How an exercise works

```bash
npm run ex -- 01              # runs exercises/01-first-call/exercise.ts
npm run ex -- 01 --solution   # runs the finished version
npm run typecheck             # checks every file compiles, no API calls
```

Each folder has three files:

- `README.md` says what you are building, the steps, and what "done" looks like.
- `exercise.ts` is the scaffold. Find the `TODO` comments and fill them in. The checks at the bottom print ✔ or ✘.
- `solution.ts` is one working answer. Read it after you have tried, not before.

Shared helpers live in `src/lib/`: the client and model name, `textOf()` to join text blocks, `usageLine()` for tokens, `mapLimit()` for rate-limit-friendly concurrency, and readers for the notes.

## Cost

Every exercise makes a handful of calls, most under two thousand tokens each. The default model is `claude-opus-5`. To run on a cheaper model while you learn, set `CLAUDE_MODEL`:

```bash
CLAUDE_MODEL=claude-sonnet-5 npm run ex -- 07
```

Exercise 09 shows you exactly how tokens and cache reads change your bill. Watch the usage line on every run.

## The teaching data

`data/notes/` holds six markdown notes on kharif crops in Maharashtra: soybean, cotton, onion, tur, bajra, and a season calendar. They feed the RAG, caching, evals, and agent exercises. The numbers are typical ranges from public extension advice, written for teaching. Confirm anything you would act on with your local Krishi Vigyan Kendra.

`data/evals.json` is the question set for exercise 11. Add your own questions; that is the point.

## Progress

- [ ] 01 First call
- [ ] 02 System prompt
- [ ] 03 Conversation
- [ ] 04 Structured output
- [ ] 05 Streaming
- [ ] 06 Tools
- [ ] 07 Agent loop
- [ ] 08 RAG
- [ ] 09 Prompt caching
- [ ] 10 Guardrails
- [ ] 11 Evals
- [ ] 12 Multi-agent
- [ ] 13 Memory

## After the thirteen

- Swap the keyword retriever in exercise 08 for real embeddings and a vector store.
- Expose the price tool from exercise 06 as an MCP server and use it from Claude Code.
- Put exercise 10's classifier and exercise 11's evals in front of your own app. Your `seed-advisor` project is the natural next home for all of this.
- Write a skill file from what you learned in exercise 02 and let Claude Code load it.

## License

MIT
