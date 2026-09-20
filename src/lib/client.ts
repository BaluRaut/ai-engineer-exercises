import Anthropic from "@anthropic-ai/sdk";

/** The model every exercise uses. Override with CLAUDE_MODEL=... in your shell. */
export const MODEL = process.env.CLAUDE_MODEL ?? "claude-opus-5";

/** One shared client. It reads ANTHROPIC_API_KEY, or a profile from `ant auth login`. */
export const client = new Anthropic();

type HasContent = { content: ReadonlyArray<{ type: string; text?: string }> };
type HasUsage = {
  usage: {
    input_tokens: number;
    output_tokens: number;
    cache_read_input_tokens?: number | null;
    cache_creation_input_tokens?: number | null;
  };
};

/** Join every text block of a response into one string. */
export function textOf(message: HasContent): string {
  return message.content
    .filter((b) => b.type === "text")
    .map((b) => b.text ?? "")
    .join("");
}

/** A one-line token summary, so you always see what a call cost. */
export function usageLine(message: HasUsage): string {
  const u = message.usage;
  const cached = u.cache_read_input_tokens ? `, cache read ${u.cache_read_input_tokens}` : "";
  const created = u.cache_creation_input_tokens ? `, cache write ${u.cache_creation_input_tokens}` : "";
  return `tokens: in ${u.input_tokens}${cached}${created}, out ${u.output_tokens}`;
}

/** Run an async job over a list with at most `limit` in flight. Keeps you under rate limits. */
export async function mapLimit<T, R>(items: T[], limit: number, job: (item: T, i: number) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      out[i] = await job(items[i]!, i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}
