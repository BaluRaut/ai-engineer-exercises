import { client, MODEL, usageLine } from "../../src/lib/client.js";
import { check, finish, section } from "../../src/lib/check.js";

section("01 · First call");

// TODO 1: replace the placeholder with a real question about kharif farming in Maharashtra.
const response = await client.messages.create({
  model: MODEL,
  max_tokens: 1024,
  messages: [{ role: "user", content: "TODO: write your question here" }],
});

// TODO 2: pull the text out of the response blocks.
// response.content is an array of blocks. Keep the ones with type === "text" and join their .text.
// (src/lib/client.ts has textOf() that does exactly this. Try writing it yourself first.)
let answer = "";

console.log(answer);
console.log(usageLine(response));

check("answer is not empty", answer.trim().length > 0, "filter response.content by block.type === 'text'");
check("stop reason is end_turn", response.stop_reason === "end_turn", "if it says max_tokens, raise max_tokens");
finish();
