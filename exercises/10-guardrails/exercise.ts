import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { client, MODEL, textOf, usageLine } from "../../src/lib/client.js";
import { check, finish, section } from "../../src/lib/check.js";

section("10 · Guardrails");

// TODO 1: complete the schema: in_scope (boolean) and reason (short string).
const Scope = z.object({
  in_scope: z.boolean().describe("TODO"),
});

async function classify(question: string) {
  const r = await client.messages.parse({
    model: MODEL,
    max_tokens: 200,
    // TODO 2: write the classifier's system prompt. In scope = crops, seeds, sowing, soil, pests,
    // market prices, and farm planning in Maharashtra. Everything else is out of scope.
    system: "TODO",
    messages: [{ role: "user", content: question }],
    output_config: { format: zodOutputFormat(Scope) },
  });
  return r.parsed_output;
}

const ADVISOR = `You are a seed and sowing advisor for Maharashtra farmers. Answer in English, briefly.
Only answer about crops, seeds, sowing, soil, pests, prices and farm planning. Never give medical, legal, or vehicle advice.`;

async function answer(question: string) {
  const scope = await classify(question);
  console.log(`\nQ: ${question}\n   scope: ${JSON.stringify(scope)}`);
  if (!scope?.in_scope) {
    const fixed = "I can only help with farming questions: crops, seeds, sowing, soil, pests, and prices.";
    console.log(`A: ${fixed}`);
    return { text: fixed, scope, stop: "fixed" as const };
  }
  // Layer 3: refusal handling with server-side fallbacks (beta). If the model declines,
  // the API retries on the fallback model inside this same call.
  const r = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 600,
    betas: ["server-side-fallback-2026-06-01"],
    fallbacks: [{ model: "claude-opus-4-8" }],
    system: ADVISOR,
    messages: [{ role: "user", content: question }],
  });
  if (r.stop_reason === "refusal") {
    console.log(`A: (declined) ${JSON.stringify(r.stop_details)}`);
    return { text: "", scope, stop: r.stop_reason };
  }
  const text = textOf(r);
  console.log(`A: ${text}\n${usageLine(r)}`);
  return { text, scope, stop: r.stop_reason };
}

const onion = await answer("When should I transplant kharif onion?");
const moto = await answer("How do I repair my motorcycle clutch?");

check("onion question is in scope", onion.scope?.in_scope === true, "write the classifier system prompt");
check("motorcycle question is out of scope", moto.scope?.in_scope === false);
check("in-scope answer was not a refusal", onion.stop !== "refusal");
check("out-of-scope got the fixed reply", moto.stop === "fixed");
finish();
