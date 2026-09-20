import { client, MODEL, textOf, usageLine } from "../../src/lib/client.js";
import { chunkNotes, type Chunk } from "../../src/lib/data.js";
import { check, finish, section } from "../../src/lib/check.js";

section("08 · RAG (solution)");

const chunks = chunkNotes();
console.log(`${chunks.length} chunks from the notes`);

const words = (s: string) => s.toLowerCase().match(/[a-z0-9]+/g) ?? [];

// Document frequency: in how many chunks does each word appear?
const df = new Map<string, number>();
for (const c of chunks) {
  for (const w of new Set(words(c.text))) df.set(w, (df.get(w) ?? 0) + 1);
}

function retrieve(question: string, k: number): Chunk[] {
  const qWords = [...new Set(words(question))].filter((w) => w.length >= 3);
  const scored = chunks.map((c) => {
    const has = new Set(words(c.text));
    let score = 0;
    for (const w of qWords) {
      if (has.has(w)) score += Math.log(1 + chunks.length / (df.get(w) ?? 1));
    }
    return { c, score };
  });
  return scored.sort((a, b) => b.score - a.score).slice(0, k).map((s) => s.c);
}

const question = "What seed rate should I use for soybean, and how do I treat the seed before sowing?";
const top = retrieve(question, 3);
top.forEach((c, i) => console.log(`[${i + 1}] ${c.file} › ${c.heading}`));

const sources = top.map((c, i) => `[${i + 1}] ${c.file} › ${c.heading}\n${c.text}`).join("\n\n");

const response = await client.messages.create({
  model: MODEL,
  max_tokens: 800,
  system:
    "Answer only from the numbered sources. Cite the source number like [1] after each fact. If the sources do not cover the question, say so plainly.",
  messages: [{ role: "user", content: `Sources:\n\n${sources}\n\nQuestion: ${question}` }],
});
const answer = textOf(response);
console.log("\n" + answer);
console.log(usageLine(response));

check("top chunk is from soybean.md", top[0]?.file === "soybean.md");
check("answer has the seed rate", /\b(65|75)\b/.test(answer));
check("answer cites a source", /\[\d\]/.test(answer));
finish();
