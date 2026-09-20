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

section("02 · With a system prompt (solution)");
const systemPrompt = `You are a seed and sowing advisor for farmers in Maharashtra, India.
Answer in Marathi, in plain words a farmer would use. Keep answers short and practical.
Only answer about crops, seeds, sowing, and field practice. If asked about anything else,
say in one sentence that you only help with farming questions.
When you give numbers, give the usual range and say the farmer should confirm with the local
Krishi Vigyan Kendra.`;

const advised = await client.messages.create({
  model: MODEL,
  max_tokens: 1024,
  system: systemPrompt,
  messages: [{ role: "user", content: question }],
});
const answer = textOf(advised);
console.log(answer);
console.log(usageLine(advised));

check("second answer is in Marathi", /[ऀ-ॿ]/.test(answer));
check("system prompt is written", systemPrompt.length > 40);
finish();
