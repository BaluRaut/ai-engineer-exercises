import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { client, MODEL, textOf } from "../../src/lib/client.js";
import { DATA_DIR } from "../../src/lib/data.js";
import { check, finish, section } from "../../src/lib/check.js";

section("13 · Memory (solution)");

const MEMORY_FILE = join(DATA_DIR, "memory.json");

function loadMemory(): string[] {
  if (!existsSync(MEMORY_FILE)) return [];
  return JSON.parse(readFileSync(MEMORY_FILE, "utf8")) as string[];
}
function saveMemory(facts: string[]): void {
  writeFileSync(MEMORY_FILE, JSON.stringify(facts, null, 2));
}

function systemWith(facts: string[]) {
  const known = facts.length ? `Known facts about this farmer:\n- ${facts.join("\n- ")}` : "No facts known yet.";
  return `You are a kharif advisor for Maharashtra. Answer briefly in English.\n\n${known}`;
}

// Turn 1: fresh start.
saveMemory([]);
const userTurn1 = "I am Balu. My farm is 3 acres near Nashik, black soil, rain-fed. What should I grow this kharif?";
const turn1 = await client.messages.create({
  model: MODEL,
  max_tokens: 500,
  system: systemWith(loadMemory()),
  messages: [{ role: "user", content: userTurn1 }],
});
const answer1 = textOf(turn1);
console.log("Turn 1:", answer1);

// Extract durable facts about the farmer (not about the advice).
const Facts = z.object({
  facts: z.array(z.string()).describe("Short, durable facts about the farmer: name, location, land size, soil, water. Nothing else."),
});
const extracted = await client.messages.parse({
  model: MODEL,
  max_tokens: 300,
  system: "Extract facts about the farmer from the conversation. Only facts the farmer stated about themselves or their land.",
  messages: [{ role: "user", content: `Farmer said: ${userTurn1}\nAdvisor said: ${answer1}` }],
  output_config: { format: zodOutputFormat(Facts) },
});
const merged = [...new Set([...loadMemory(), ...(extracted.parsed_output?.facts ?? [])])];
saveMemory(merged);
console.log("Saved facts:", merged);

// Turn 2: a new conversation. Only the saved facts carry over.
const turn2 = await client.messages.create({
  model: MODEL,
  max_tokens: 300,
  system: systemWith(loadMemory()),
  messages: [{ role: "user", content: "Remind me: what soil do I have and where is my farm?" }],
});
const answer2 = textOf(turn2);
console.log("Turn 2:", answer2);

check("memory file has facts", loadMemory().length > 0);
check("turn 2 knows the soil or place", /black|nashik/i.test(answer2));
finish();
