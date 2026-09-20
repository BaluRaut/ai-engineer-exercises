import Anthropic from "@anthropic-ai/sdk";
import { client, MODEL, textOf, usageLine } from "../../src/lib/client.js";
import { check, finish, section } from "../../src/lib/check.js";

section("03 · Conversation (solution)");

const system = "You are a farming assistant for Maharashtra. Answer briefly in English.";

const messages: Anthropic.MessageParam[] = [
  { role: "user", content: "I farm 3 acres of black soil near Nashik. It is rain-fed, no well." },
  { role: "assistant", content: "Noted: 3 acres, black soil, near Nashik, rain-fed." },
  { role: "user", content: "Given my land, should I grow soybean or bajra this kharif?" },
];

const first = await client.messages.create({ model: MODEL, max_tokens: 800, system, messages });
console.log(textOf(first));
console.log(usageLine(first));

// Append the model's own reply, then the follow-up. The whole list goes back over the wire.
messages.push({ role: "assistant", content: first.content });
messages.push({ role: "user", content: "How many acres did I say I have?" });

const second = await client.messages.create({ model: MODEL, max_tokens: 300, system, messages });
const followUp = textOf(second);
console.log(followUp);
console.log(usageLine(second));

check("history was extended (5 turns)", messages.length === 5);
check("follow-up remembers the acreage", /\b(3|three)\b/i.test(followUp));
finish();
