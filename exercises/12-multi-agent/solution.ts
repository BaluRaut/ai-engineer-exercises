import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { client, MODEL, textOf } from "../../src/lib/client.js";
import { check, finish, section } from "../../src/lib/check.js";

section("12 · Multi-agent (solution)");

const fields = [
  { name: "North field", acres: 3, soil: "deep black", water: "rain-fed" },
  { name: "Well field", acres: 1.5, soil: "medium", water: "well with drip" },
  { name: "Hill field", acres: 2, soil: "shallow, stony", water: "rain-fed, uncertain" },
];

const FieldPlan = z.object({
  field: z.string().describe("The field name exactly as given"),
  crop: z.string().describe("One main crop for this field"),
  why: z.string().describe("One sentence on why this crop fits the soil and water"),
  seed_kg: z.number().describe("Total seed needed for this field in kg"),
  sowing_window: z.string().describe("e.g. '15 June to 7 July'"),
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

// Workers run in parallel; each sees only its own field.
const plans = await Promise.all(fields.map(planField));
console.log(JSON.stringify(plans, null, 2));

// The main agent sees only the short results, never the workers' reasoning.
const combined = await client.messages.create({
  model: MODEL,
  max_tokens: 700,
  system: "You write short, practical plans for a Maharashtra farmer, in English. Name every field.",
  messages: [{ role: "user", content: `Combine these field plans into one kharif plan with a total seed shopping list:\n${JSON.stringify(plans, null, 2)}` }],
});
const summary = textOf(combined);
console.log("\n" + summary);

check("three plans came back", plans.length === 3 && plans.every((p) => p !== null));
check("every plan has seed quantity", plans.every((p) => p !== null && p.seed_kg > 0));
check("summary names every field", fields.every((f) => summary.includes(f.name)));
finish();
