import Anthropic from "@anthropic-ai/sdk";
import { existsSync, readFileSync } from "node:fs";
import { basename, join } from "node:path";
import { client, MODEL, textOf } from "../../src/lib/client.js";
import { NOTES_DIR, readNotes } from "../../src/lib/data.js";
import { check, finish, section } from "../../src/lib/check.js";

section("07 · Agent loop (solution)");

const tools: Anthropic.Tool[] = [
  {
    name: "list_notes",
    description: "List the file names of all crop notes available.",
    input_schema: { type: "object", properties: {}, required: [] },
  },
  {
    name: "read_note",
    description: "Read one crop note by file name and return its full text.",
    input_schema: {
      type: "object",
      properties: { file: { type: "string", description: "A file name returned by list_notes" } },
      required: ["file"],
    },
  },
];

let toolRuns = 0;
function executeTool(name: string, input: unknown): string {
  toolRuns++;
  if (name === "list_notes") return readNotes().map((n) => n.file).join("\n");
  if (name === "read_note") {
    const file = basename(String((input as { file?: string }).file ?? "")); // basename blocks ../ tricks
    const path = join(NOTES_DIR, file);
    if (!file.endsWith(".md") || !existsSync(path)) return `No such note: ${file}. Call list_notes first.`;
    return readFileSync(path, "utf8");
  }
  return `Unknown tool ${name}`;
}

const messages: Anthropic.MessageParam[] = [
  {
    role: "user",
    content:
      "Find the recommended seed rate for tur as a sole crop, per hectare, from the notes. Reply with the number range and the file it came from.",
  },
];

let iterations = 0;
let last: Anthropic.Message | null = null;
while (iterations < 6) {
  iterations++;
  const response = await client.messages.create({ model: MODEL, max_tokens: 1500, tools, messages });
  last = response;
  console.log(`iteration ${iterations}: stop_reason=${response.stop_reason}`);
  if (response.stop_reason === "end_turn") break;
  if (response.stop_reason !== "tool_use") break;

  messages.push({ role: "assistant", content: response.content });

  const results: Anthropic.ToolResultBlockParam[] = [];
  for (const block of response.content) {
    if (block.type !== "tool_use") continue;
    console.log(`  → ${block.name}(${JSON.stringify(block.input)})`);
    results.push({ type: "tool_result", tool_use_id: block.id, content: executeTool(block.name, block.input) });
  }
  // One user message carries every tool result for this turn.
  messages.push({ role: "user", content: results });
}

const answer = last ? textOf(last) : "";
console.log("\n" + answer);

check("loop ended with end_turn", last?.stop_reason === "end_turn");
check("tools ran at least twice", toolRuns >= 2);
check("answer has the tur seed rate", /\b1[25]\b/.test(answer));
check("answer names the file", /tur\.md/i.test(answer));
finish();
