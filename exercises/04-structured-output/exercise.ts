import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { client, MODEL, usageLine } from "../../src/lib/client.js";
import { check, finish, section } from "../../src/lib/check.js";

section("04 · Structured output");

// TODO 1: complete the schema. Add:
//   sowing_window: { start: string, end: string }   e.g. "15 June" to "7 July"
//   seed_rate_kg_per_ha: number
//   spacing_cm: { row: number, plant: number }
//   key_risks: string[]  (2 to 4 items)
// Use .describe() on each field.
const CropPlan = z.object({
  crop: z.string().describe("Crop name in English"),
  // TODO: the rest
});

const response = await client.messages.parse({
  model: MODEL,
  max_tokens: 1024,
  system: "You are an agronomist for Maharashtra. Give typical extension-service values.",
  messages: [{ role: "user", content: "Give me a kharif plan for soybean on medium black soil, rain-fed." }],
  output_config: { format: zodOutputFormat(CropPlan) },
});

const plan = response.parsed_output;
console.log(JSON.stringify(plan, null, 2));
console.log(usageLine(response));

// TODO 2: once the schema is complete, replace the placeholder checks below with real ones:
//   seed_rate_kg_per_ha is a number above 0
//   key_risks has at least 2 items
check("parsed_output is not null", plan !== null);
check("schema has more than one field", Object.keys(CropPlan.shape).length > 1, "add the fields listed in TODO 1");
finish();
