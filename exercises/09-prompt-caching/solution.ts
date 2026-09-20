import Anthropic from "@anthropic-ai/sdk";
import { client, MODEL, textOf, usageLine } from "../../src/lib/client.js";
import { allNotesText } from "../../src/lib/data.js";
import { check, finish, section } from "../../src/lib/check.js";

section("09 · Prompt caching (solution)");

const notes = allNotesText();
const policy = "You are a kharif advisor for Maharashtra. Answer from the notes below, briefly, in English.";

// Stable content first. The cache point sits on the last stable block.
const system: Anthropic.TextBlockParam[] = [
  { type: "text", text: policy },
  { type: "text", text: notes, cache_control: { type: "ephemeral" } },
];

const count = await client.messages.countTokens({ model: MODEL, system, messages: [{ role: "user", content: "hi" }] });
console.log(`prefix size: ${count.input_tokens} tokens`);

async function ask(question: string) {
  const r = await client.messages.create({ model: MODEL, max_tokens: 400, system, messages: [{ role: "user", content: question }] });
  console.log(`\nQ: ${question}\nA: ${textOf(r)}\n${usageLine(r)}`);
  return r;
}

const first = await ask("What is the seed rate for bajra?");
const second = await ask("When should kharif onion be transplanted?");

check("first call wrote to the cache", (first.usage.cache_creation_input_tokens ?? 0) > 0);
check("second call read from the cache", (second.usage.cache_read_input_tokens ?? 0) > 0, "prefix may be under the model's minimum cacheable size; add more notes");
finish();
