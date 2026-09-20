import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { client, MODEL, usageLine } from "../../src/lib/client.js";
import { check, finish, section } from "../../src/lib/check.js";

section("04 · Structured output (solution)");

const CropPlan = z.object({
  crop: z.string().describe("Crop name in English"),
  sowing_window: z
    .object({
      start: z.string().describe("Earliest sowing date, e.g. '15 June'"),
      end: z.string().describe("Latest sowing date, e.g. '7 July'"),
    })
    .describe("Recommended sowing window for Maharashtra"),
  seed_rate_kg_per_ha: z.number().describe("Seed rate in kilograms per hectare"),
  spacing_cm: z.object({
    row: z.number().describe("Distance between rows in cm"),
    plant: z.number().describe("Distance between plants within a row in cm"),
  }),
  key_risks: z.array(z.string()).min(2).max(4).describe("The main pests, diseases, or weather risks"),
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

check("parsed_output is not null", plan !== null);
check("seed rate is a positive number", plan !== null && plan.seed_rate_kg_per_ha > 0);
check("at least two risks listed", plan !== null && plan.key_risks.length >= 2);
check("row spacing is wider than plant spacing", plan !== null && plan.spacing_cm.row > plan.spacing_cm.plant);
finish();
