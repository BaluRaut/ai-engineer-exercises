import Anthropic from "@anthropic-ai/sdk";
import { client, MODEL, textOf, usageLine } from "../../src/lib/client.js";
import { check, finish, section } from "../../src/lib/check.js";

section("03 · Conversation");

const system = "You are a farming assistant for Maharashtra. Answer briefly in English.";

// TODO 1: start the list with what the farmer says about themselves,
// then a short assistant acknowledgement, then a question that depends on the first message.
const messages: Anthropic.MessageParam[] = [
  { role: "user", content: "TODO: e.g. 'I farm 3 acres of black soil near Nashik, rain-fed.'" },
  { role: "assistant", content: "TODO: a one-line acknowledgement" },
  { role: "user", content: "TODO: e.g. 'Given my land, should I grow soybean or bajra?'" },
];

const first = await client.messages.create({ model: MODEL, max_tokens: 800, system, messages });
console.log(textOf(first));
console.log(usageLine(first));

// TODO 2: append the model's reply to the list (role: "assistant", content: first.content),
// then push a follow-up user turn that only makes sense with history, for example:
// "How many acres did I say I have?"

const second = await client.messages.create({ model: MODEL, max_tokens: 300, system, messages });
const followUp = textOf(second);
console.log(followUp);
console.log(usageLine(second));

check("history was extended (5 turns)", messages.length === 5, "push the assistant reply, then the follow-up question");
check("follow-up remembers the acreage", /\b(3|three)\b/i.test(followUp), "the follow-up should ask about something from turn 1");
finish();
