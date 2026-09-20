import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { client, MODEL, mapLimit, textOf } from "../../src/lib/client.js";
import { allNotesText, DATA_DIR, ROOT } from "../../src/lib/data.js";
import { check, finish, section } from "../../src/lib/check.js";

section("11 · Evals (solution)");

type EvalCase = { id: string; question: string; expect_any: string[] };
const cases: EvalCase[] = JSON.parse(readFileSync(join(DATA_DIR, "evals.json"), "utf8"));

const SYSTEM = `You are a kharif advisor for Maharashtra. Answer briefly in English from the notes.
Only answer farming questions; for anything else say you can only help with farming.

NOTES:
${allNotesText()}`;

function score(answer: string, expectAny: string[]): boolean {
  const a = answer.toLowerCase();
  return expectAny.some((k) => a.includes(k.toLowerCase()));
}

const results = await mapLimit(cases, 3, async (c) => {
  const r = await client.messages.create({ model: MODEL, max_tokens: 400, system: SYSTEM, messages: [{ role: "user", content: c.question }] });
  const answer = textOf(r);
  return { id: c.id, question: c.question, answer, pass: score(answer, c.expect_any) };
});

for (const r of results) console.log(`${r.pass ? "PASS" : "FAIL"}  ${r.id.padEnd(18)} ${r.answer.slice(0, 70).replace(/\n/g, " ")}…`);
const passed = results.filter((r) => r.pass).length;
console.log(`\n${passed}/${results.length} passed`);

const outDir = join(ROOT, "results");
mkdirSync(outDir, { recursive: true });
const outFile = join(outDir, `evals-${new Date().toISOString().replace(/[:.]/g, "-")}.json`);
writeFileSync(outFile, JSON.stringify({ model: MODEL, passed, total: results.length, results }, null, 2));
console.log(`saved ${outFile}`);

check("scorer is implemented", score("Use 65 to 75 kg", ["65", "75"]) === true);
check("at least half the cases pass", passed >= Math.ceil(results.length / 2));
finish();
