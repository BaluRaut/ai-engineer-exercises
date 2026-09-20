import { betaZodTool } from "@anthropic-ai/sdk/helpers/beta/zod";
import { z } from "zod";
import { client, MODEL, textOf, usageLine } from "../../src/lib/client.js";
import { check, finish, section } from "../../src/lib/check.js";

section("06 · Tools (solution)");

const PRICES: Record<string, { market: string; rupeesPerQuintal: number; date: string }> = {
  soybean: { market: "Latur", rupeesPerQuintal: 4650, date: "2026-09-19" },
  cotton: { market: "Akola", rupeesPerQuintal: 7200, date: "2026-09-19" },
  onion: { market: "Lasalgaon", rupeesPerQuintal: 1850, date: "2026-09-19" },
  tur: { market: "Latur", rupeesPerQuintal: 7400, date: "2026-09-19" },
};

let toolCalls = 0;

const getMandiPrice = betaZodTool({
  name: "get_mandi_price",
  description:
    "Returns today's wholesale (mandi) price for a crop in Maharashtra, in rupees per quintal, with the market name and date. Use it for any question about current prices. Do not guess prices.",
  inputSchema: z.object({
    crop: z.string().describe("Crop name in English, lowercase, e.g. soybean, cotton, onion, tur"),
  }),
  run: async ({ crop }) => {
    toolCalls++;
    const row = PRICES[crop.toLowerCase()];
    if (!row) return `No price data for "${crop}". Known crops: ${Object.keys(PRICES).join(", ")}.`;
    return `${crop}: ₹${row.rupeesPerQuintal} per quintal at ${row.market} mandi on ${row.date}.`;
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

check("tool was called", toolCalls >= 1);
check("answer contains the real price", answer.includes("4650") || answer.includes("4,650"));
finish();
