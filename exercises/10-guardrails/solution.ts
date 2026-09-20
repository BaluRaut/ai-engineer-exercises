import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { client, MODEL, textOf, usageLine } from "../../src/lib/client.js";
import { check, finish, section } from "../../src/lib/check.js";

section("10 · Guardrails (solution)");

const Scope = z.object({
  in_scope: z.boolean().describe("true only if the question is about farming in Maharashtra: crops, seeds, sowing, soil, pests, prices, planning"),
  reason: z.string().describe("One short sentence explaining the decision"),
});

async function classify(question: string) {
  const r = await client.messages.parse({
    model: MODEL,
    max_tokens: 200,
    system:
      "You classify questions for a farming advisor. In scope: crops, seeds, sowing, soil, pests, market prices, and farm planning in Maharashtra. Everything else, including vehicles, health, law, and general chit-chat, is out of scope.",
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
  const r = await client.beta.messages.create({
    model: MODEL,
    max_tokens: 600,
    betas: ["server-side-fallback-2026-06-01"],
    fallbacks: [{ model: "claude-opus-4-8" }],
    system: ADVISOR,
    messages: [{ role: "user", content: question }],
  });
  // Did a fallback model serve this turn?
  for (const block of r.content) {
    if (block.type === "fallback") console.log(`   ${block.from.model} declined; ${block.to.model} continued`);
  }
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

check("onion question is in scope", onion.scope?.in_scope === true);
check("motorcycle question is out of scope", moto.scope?.in_scope === false);
check("in-scope answer was not a refusal", onion.stop !== "refusal");
check("out-of-scope got the fixed reply", moto.stop === "fixed");
finish();
