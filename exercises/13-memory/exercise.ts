import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { client, MODEL, textOf } from "../../src/lib/client.js";
import { DATA_DIR } from "../../src/lib/data.js";
import { check, finish, section } from "../../src/lib/check.js";

section("13 · Memory");

const MEMORY_FILE = join(DATA_DIR, "memory.json");

// TODO 1: loadMemory returns string[] from MEMORY_FILE, or [] if the file is missing.
//         saveMemory writes the array as pretty JSON.
function loadMemory(): string[] {
  void existsSync; void readFileSync;
  return [];
}
function saveMemory(facts: string[]): void {
  void writeFileSync; void facts;
}

function systemWith(facts: string[]) {
  const known = facts.length ? `Known facts about this farmer:\n- ${facts.join("\n- ")}` : "No facts known yet.";
  return `You are a kharif advisor for Maharashtra. Answer briefly in English.\n\n${known}`;
}

// Turn 1: the farmer introduces their land. No memory yet.
saveMemory([]);
const turn1 = await client.messages.create({
  model: MODEL,
  max_tokens: 500,
  system: systemWith(loadMemory()),
  messages: [{ role: "user", content: "I am Balu. My farm is 3 acres near Nashik, black soil, rain-fed. What should I grow this kharif?" }],
});
console.log("Turn 1:", textOf(turn1));

// TODO 2: extract facts from turn 1 with structured output ({ facts: string[] }),
// merge with loadMemory(), de-duplicate, and saveMemory().
const Facts = z.object({ facts: z.array(z.string()) });
void Facts; void zodOutputFormat;

// Turn 2: a NEW conversation. No history, only memory in the system prompt.
const turn2 = await client.messages.create({
  model: MODEL,
  max_tokens: 300,
  system: systemWith(loadMemory()),
  messages: [{ role: "user", content: "Remind me: what soil do I have and where is my farm?" }],
});
const answer2 = textOf(turn2);
console.log("Turn 2:", answer2);

check("memory file has facts", loadMemory().length > 0, "extract and save facts after turn 1");
check("turn 2 knows the soil or place", /black|nashik/i.test(answer2));
finish();
