import { existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const exercisesDir = join(here, "..", "exercises");
const folders = readdirSync(exercisesDir).filter((f) => /^\d\d-/.test(f)).sort();
const args = process.argv.slice(2);
const wanted = args.find((a) => !a.startsWith("--"));

if (!wanted || args.includes("--list")) {
  console.log("Exercises:\n");
  for (const f of folders) console.log(`  ${f}`);
  console.log("\nRun one:        npm run ex -- 03");
  console.log("Run a solution: npm run ex -- 03 --solution");
  process.exit(0);
}

const folder = folders.find((f) => f === wanted || f.startsWith(wanted.padStart(2, "0") + "-"));
if (!folder) {
  console.error(`No exercise matches "${wanted}". Try: npm run list`);
  process.exit(1);
}
const which = args.includes("--solution") ? "solution" : "exercise";
const file = join(exercisesDir, folder, `${which}.ts`);
if (!existsSync(file)) {
  console.error(`Missing ${file}`);
  process.exit(1);
}
console.log(`▶ ${folder}/${which}.ts   model: ${process.env.CLAUDE_MODEL ?? "claude-opus-5"}\n`);
await import(pathToFileURL(file).href);
