let passed = 0;
let failed = 0;

/** Print a pass/fail line. Returns the condition so you can branch on it. */
export function check(name: string, ok: boolean, hint?: string): boolean {
  if (ok) {
    passed++;
    console.log(`  ✔ ${name}`);
  } else {
    failed++;
    console.log(`  ✘ ${name}${hint ? `\n    hint: ${hint}` : ""}`);
  }
  return ok;
}

/** Print a heading. */
export function section(title: string): void {
  console.log(`\n${title}\n${"─".repeat(title.length)}`);
}

/** Summarise and set the exit code. Call once at the end of an exercise. */
export function finish(): void {
  console.log(`\n${passed} passed, ${failed} failed${failed === 0 ? " — exercise complete" : ""}`);
  process.exitCode = failed === 0 ? 0 : 1;
}
