import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { client, MODEL, textOf, usageLine } from "../../src/lib/client.js";
import { check, finish, section } from "../../src/lib/check.js";

section("06 · Tools");

// Pretend market data. In a real app this is a database or an API call.
const PRICES: Record<string, { market: string; rupeesPerQuintal: number; date: string }> = {
  soybean: { market: "Latur", rupeesPerQuintal: 4650, date: "2026-09-19" },
  cotton: { market: "Akola", rupeesPerQuintal: 7200, date: "2026-09-19" },
  onion: { market: "Lasalgaon", rupeesPerQuintal: 1850, date: "2026-09-19" },
  tur: { market: "Latur", rupeesPerQuintal: 7400, date: "2026-09-19" },
};

let toolCalls = 0;

const getMandiPrice = betaZodTool({
  name: "get_mandi_price",
  // TODO 1: describe the tool for the model: what it returns, and when to use it.
  description: "TODO",
  inputSchema: z.object({
    crop: z.string().describe("Crop name in English, lowercase, e.g. soybean, cotton, onion, tur"),
  }),
  run: async ({ crop }) => {
    toolCalls++;
    // TODO 2: look up PRICES[crop.toLowerCase()]. Return a short string with market, price and date,
    // or a clear "no data for <crop>" message. Never throw for an unknown crop.
    return "TODO";
  },
});

const final = await client.beta.messages.toolRunner({
  model: MODEL,
  max_tokens: 1024,
  system: "You are a market assistant for Maharashtra farmers. Use tools for any price question. Answer in English.",
  tools: [getMandiPrice],
  messages: [{ role: "user", content: "What is soybean selling for today, and is it above 4500?" }],
});

const answer = textOf(final);
console.log(answer);
console.log(usageLine(final));

check("tool was called", toolCalls >= 1, "the description must make it clear this tool answers price questions");
check("answer contains the real price", answer.includes("4650") || answer.includes("4,650"), "return the price in the tool result string");
finish();
