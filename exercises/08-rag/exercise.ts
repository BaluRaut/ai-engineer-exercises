import { client, MODEL, textOf, usageLine } from "../../src/lib/client.js";
import { chunkNotes, type Chunk } from "../../src/lib/data.js";
import { check, finish, section } from "../../src/lib/check.js";

section("08 · RAG");

const chunks = chunkNotes();
console.log(`${chunks.length} chunks from the notes`);

const words = (s: string) => s.toLowerCase().match(/[a-z0-9]+/g) ?? [];

// TODO 1: implement retrieval.
//   - For each chunk, count how many distinct question words appear in it.
//   - Weight rare words more: weight = log(1 + chunks.length / chunksContainingWord).
//   - Return the top k chunks by score. Ignore very short words (length < 3).
function retrieve(question: string, k: number): Chunk[] {
  void words;
  return chunks.slice(0, k); // placeholder: the first k chunks, which is wrong on purpose
}

const question = "What seed rate should I use for soybean, and how do I treat the seed before sowing?";
const top = retrieve(question, 3);
top.forEach((c, i) => console.log(`[${i + 1}] ${c.file} › ${c.heading}`));

// TODO 2: build the sources block: "[1] file › heading\n<text>\n\n[2] ..."
const sources = "TODO";

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

check("top chunk is from soybean.md", top[0]?.file === "soybean.md", "score chunks by question-word overlap");
check("answer has the seed rate", /\b(65|75)\b/.test(answer));
check("answer cites a source", /\[\d\]/.test(answer), "put the numbered sources in the prompt");
finish();
