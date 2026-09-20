import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
export const ROOT = join(here, "..", "..");
export const DATA_DIR = join(ROOT, "data");
export const NOTES_DIR = join(DATA_DIR, "notes");

export type Note = { file: string; text: string };

/** Every markdown note under data/notes, sorted by file name. */
export function readNotes(): Note[] {
  return readdirSync(NOTES_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .map((file) => ({ file, text: readFileSync(join(NOTES_DIR, file), "utf8") }));
}

/** All notes as one string, each under a heading with its file name. */
export function allNotesText(): string {
  return readNotes()
    .map((n) => `## FILE: ${n.file}\n\n${n.text.trim()}`)
    .join("\n\n");
}

export type Chunk = { file: string; heading: string; text: string };

/** Split every note at its "## " headings, so retrieval works on small pieces. */
export function chunkNotes(): Chunk[] {
  const chunks: Chunk[] = [];
  for (const { file, text } of readNotes()) {
    const parts = text.split(/\n(?=## )/);
    for (const part of parts) {
      const heading = (part.match(/^##?\s+(.+)$/m)?.[1] ?? "intro").trim();
      chunks.push({ file, heading, text: part.trim() });
    }
  }
  return chunks;
}
