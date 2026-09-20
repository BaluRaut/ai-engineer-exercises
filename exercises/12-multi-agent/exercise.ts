import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { client, MODEL, textOf } from "../../src/lib/client.js";
import { check, finish, section } from "../../src/lib/check.js";

section("12 · Multi-agent");

const fields = [
  { name: "North field", acres: 3, soil: "deep black", water: "rain-fed" },
  { name: "Well field", acres: 1.5, soil: "medium", water: "well with drip" },
  { name: "Hill field", acres: 2, soil: "shallow, stony", water: "rain-fed, uncertain" },
];

// TODO 1: complete the schema: field (string), crop (string), why (one sentence),
// seed_kg (number, total seed for that field), sowing_window (string).
const FieldPlan = z.object({
  field: z.string(),
});

async function planField(f: (typeof fields)[number]) {
  const r = await client.messages.parse({
    model: MODEL,
    max_tokens: 500,
    system: "You are a kharif planner for Maharashtra. Recommend one main crop for the field described. Use typical seed rates.",
    messages: [{ role: "user", content: `Field "${f.name}": ${f.acres} acres, ${f.soil} soil, ${f.water}.` }],
    output_config: { format: zodOutputFormat(FieldPlan) },
  });
  return r.parsed_output;
}

// TODO 2: run all three workers at once with Promise.all(fields.map(planField)).
const plans = [await planField(fields[0]!)];
console.log(JSON.stringify(plans, null, 2));

// TODO 3: the combine call. Pass the plans as JSON and ask for a short farmer-facing summary
// that names each field, in English.
const summary = "TODO";
console.log("\n" + summary);

check("three plans came back", plans.length === 3 && plans.every((p) => p !== null), "use Promise.all over all fields");
check("every plan has seed quantity", plans.every((p) => p !== null && "seed_kg" in p && Number((p as { seed_kg?: number }).seed_kg) > 0), "add seed_kg to the schema");
check("summary names every field", fields.every((f) => summary.includes(f.name)), "write the combine call");
void textOf;
finish();
