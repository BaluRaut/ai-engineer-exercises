import { client, MODEL, usageLine } from "../../src/lib/client.js";
import { check, finish, section } from "../../src/lib/check.js";

section("01 · First call (solution)");

const response = await client.messages.create({
  model: MODEL,
  max_tokens: 1024,
  messages: [{ role: "user", content: "In three sentences, what is the kharif season in Maharashtra?" }],
});

// The response is a list of blocks. Only text blocks carry .text.
let answer = "";
for (const block of response.content) {
  if (block.type === "text") answer += block.text;
}

console.log(answer);
console.log(usageLine(response));

check("answer is not empty", answer.trim().length > 0);
check("stop reason is end_turn", response.stop_reason === "end_turn");
finish();
