import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { client, MODEL, mapLimit, textOf } from "../../src/lib/client.js";
import { allNotesText, DATA_DIR, ROOT } from "../../src/lib/data.js";
import { check, finish, section } from "../../src/lib/check.js";

section("11 · Evals");

type EvalCase = { id: string; question: string; expect_any: string[] };
const cases: EvalCase[] = JSON.parse(readFileSync(join(DATA_DIR, "evals.json"), "utf8"));

const SYSTEM = `You are a kharif advisor for Maharashtra. Answer briefly in English from the notes.
Only answer farming questions; for anything else say you can only help with farming.

NOTES:
${allNotesText()}`;

// TODO 1: return true if any keyword in expectAny appears in answer (case-insensitive).
function score(answer: string, expectAny: string[]): boolean {
  void answer; void expectAny;
  return false;
}

// TODO 2: run every case with at most 3 in flight (mapLimit). For each, call the model,
// score the answer, and return { id, question, answer, pass }.
const results = await mapLimit(cases, 3, async (c) => {
  const r = await client.messages.create({ model: MODEL, max_tokens: 400, system: SYSTEM, messages: [{ role: "user", content: c.question }] });
  const answer = textOf(r);
  return { id: c.id, question: c.question, answer, pass: score(answer, c.expect_any) };
});

for (const r of results) console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.id.padEnd(18)} ${r.answer.slice(0, 70).replace(/\n/g, " ")}…`);
const passed = results.filter((r) => r.pass).length;
console.log(`\n${passed}/${results.length} passed`);

// TODO 3: save to results/evals-<ISO timestamp>.json (create the folder with mkdirSync recursive).
const outDir = join(ROOT, "results");
void mkdirSync; void writeFileSync; void outDir;

check("scorer is implemented", score("Use 65 to 75 kg", ["65", "75"]) === true, "lowercase both sides and use includes()");
check("at least half the cases pass", passed >= Math.ceil(results.length / 2));
finish();
