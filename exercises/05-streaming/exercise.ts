import { client, MODEL, usageLine } from "../../src/lib/client.js";
import { check, finish, section } from "../../src/lib/check.js";

section("05 · Streaming");

const started = Date.now();
let firstTokenAt: number | null = null;
let streamed = "";

const stream = client.messages.stream({
  model: MODEL,
  max_tokens: 1500,
  system: "You are a farming assistant for Maharashtra. Answer in English.",
  messages: [{ role: "user", content: "Explain, in about 150 words, why sowing soybean after 15 July is risky." }],
});

// TODO: loop over the stream events. For each event where
//   event.type === "content_block_delta" && event.delta.type === "text_delta"
// write event.delta.text to stdout, append it to `streamed`,
// and set firstTokenAt = Date.now() the first time.
for await (const event of stream) {
  void event; // remove this line when you use `event`
}

const final = await stream.finalMessage();
const total = Date.now() - started;
console.log(`\n\nfirst token after ${firstTokenAt === null ? "?" : firstTokenAt - started} ms, total ${total} ms`);
console.log(usageLine(final));

check("streamed text is not empty", streamed.length > 0, "append event.delta.text to `streamed`");
check("first token arrived before the end", firstTokenAt !== null && firstTokenAt - started < total * 0.8);
finish();
