import Anthropic from "@anthropic-ai/sdk";
import { client, MODEL, textOf, usageLine } from "../../src/lib/client.js";
import { allNotesText } from "../../src/lib/data.js";
import { check, finish, section } from "../../src/lib/check.js";

section("09 · Prompt caching");

const notes = allNotesText();
const policy = "You are a kharif advisor for Maharashtra. Answer from the notes below, briefly, in English.";

// TODO 1: build the system prompt as an array of text blocks, and mark the LAST stable block
// with cache_control: { type: "ephemeral" }.
//   [{ type: "text", text: policy }, { type: "text", text: notes, cache_control: {...} }]
const system: Anthropic.TextBlockParam[] = [{ type: "text", text: policy + "\n\n" + notes }];

const count = await client.messages.countTokens({ model: MODEL, system, messages: [{ role: "user", content: "hi" }] });
console.log(`prefix size: ${count.input_tokens} tokens`);

async function ask(question: string) {
  const r = await client.messages.create({ model: MODEL, max_tokens: 400, system, messages: [{ role: "user", content: question }] });
  console.log(`\nQ: ${question}\nA: ${textOf(r)}\n${usageLine(r)}`);
  return r;
}

// TODO 2: ask two different questions. The second should hit the cache.
const first = await ask("What is the seed rate for bajra?");
const second = await ask("When should kharif onion be transplanted?");

check("first call wrote to the cache", (first.usage.cache_creation_input_tokens ?? 0) > 0, "add cache_control to the notes block");
check("second call read from the cache", (second.usage.cache_read_input_tokens ?? 0) > 0, "if the write worked but the read is 0, the prefix changed between calls");
finish();
