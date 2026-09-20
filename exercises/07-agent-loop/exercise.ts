import Anthropic from "@anthropic-ai/sdk";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { client, MODEL, textOf } from "../../src/lib/client.js";
import { NOTES_DIR, readNotes } from "../../src/lib/data.js";
import { check, finish, section } from "../../src/lib/check.js";

section("07 · Agent loop");

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
  // TODO 1: implement both tools.
  //   list_notes -> readNotes().map(n => n.file).join("\n")
  //   read_note  -> readFileSync(join(NOTES_DIR, file), "utf8"); guard against a missing/invalid file name
  return `TODO: implement ${name} with input ${JSON.stringify(input)}`;
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

  // TODO 2: handle tool_use.
  //   1. push { role: "assistant", content: response.content }
  //   2. for every block with type === "tool_use", run executeTool(block.name, block.input)
  //      and collect { type: "tool_result", tool_use_id: block.id, content: result }
  //   3. push ONE user message whose content is the array of tool_result blocks
  break; // remove this once the loop is complete
}

const answer = last ? textOf(last) : "";
console.log("\n" + answer);

check("loop ended with end_turn", last?.stop_reason === "end_turn", "keep looping while stop_reason is tool_use");
check("tools ran at least twice", toolRuns >= 2, "the model needs list_notes then read_note");
check("answer has the tur seed rate", /\b1[25]\b/.test(answer), "the number is in data/notes/tur.md");
check("answer names the file", /tur\.md/i.test(answer));
finish();
