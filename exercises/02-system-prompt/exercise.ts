import { client, MODEL, textOf, usageLine } from "../../src/lib/client.js";
import { check, finish, section } from "../../src/lib/check.js";

const question = "When should I sow onion, and what seed rate?";

section("02 · Without a system prompt");
const plain = await client.messages.create({
  model: MODEL,
  max_tokens: 1024,
  messages: [{ role: "user", content: question }],
});
console.log(textOf(plain));
console.log(usageLine(plain));

section("02 · With a system prompt");
// TODO: write the standing instructions. Cover:
//  - who the model is (a seed and sowing advisor)
//  - who it talks to (farmers in Maharashtra)
//  - the language (answer in Marathi)
//  - one hard limit (only crops, seeds, and sowing; politely decline anything else)
const systemPrompt: string = "TODO";

const advised = await client.messages.create({
  model: MODEL,
  max_tokens: 1024,
  system: systemPrompt,
  messages: [{ role: "user", content: question }],
});
const answer = textOf(advised);
console.log(answer);
console.log(usageLine(advised));

const hasDevanagari = /[ऀ-ॿ]/.test(answer);
check("second answer is in Marathi", hasDevanagari, "say 'Answer in Marathi' in the system prompt");
check("system prompt is written", systemPrompt !== "TODO" && systemPrompt.length > 40);
finish();
