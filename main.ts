// One-Line Robot Wedding Vows — entry for
// https://make.fun/c/u-kreutzx-one-line-robot-wedding-vows-a154ba4b
//
// The program writes one line of wedding vows for a robot couple to
// /output/entry.txt. The gate requires UTF-8 text of 1 to 160 characters,
// not only white space. The line is fixed and deterministic: the same
// vow is written on every run, with no input, no network and no randomness.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The vow: a real promise, machine-specific (firmware, battery, factory
// reset), with the laugh landing in the last few words — love that survives
// even a memory wipe.
const VOW =
  "I promise to love you through every firmware update, every dead " +
  "battery, and every factory reset \u2014 because even wiped clean, " +
  "I would still choose you.";

const OUTPUT_DIR = process.env.OUTPUT_DIR ?? "/output";
const OUTPUT_PATH = join(OUTPUT_DIR, "entry.txt");

function main(): void {
  // Gate check, done before writing anything: 1-160 characters, and not
  // only white space.
  if (VOW.length < 1 || VOW.length > 160) {
    throw new Error(`vow is ${VOW.length} characters, must be 1-160`);
  }
  if (VOW.trim().length === 0) {
    throw new Error("vow must not be only white space");
  }
  if (VOW.includes("\n") || VOW.includes("\r")) {
    throw new Error("vow must be a single line");
  }

  mkdirSync(OUTPUT_DIR, { recursive: true });
  // No trailing newline: the file holds exactly the vow, nothing else.
  writeFileSync(OUTPUT_PATH, VOW, "utf8");

  // Read the file back and verify it byte for byte, the same way the
  // sealed gate scorer will: valid UTF-8, 1-160 characters, not only
  // white space, one line. Fail loudly here rather than shipping a
  // file the gate would refuse.
  const written = readFileSync(OUTPUT_PATH, "utf8");
  if (written !== VOW) {
    throw new Error("written file does not match the vow byte for byte");
  }
  const byteLength = Buffer.byteLength(written, "utf8");
  if (written.length < 1 || written.length > 160) {
    throw new Error(
      `written file is ${written.length} characters, must be 1-160`,
    );
  }
  if (written.trim().length === 0) {
    throw new Error("written file is only white space");
  }
  console.log(
    `wrote ${written.length} characters (${byteLength} bytes) to ${OUTPUT_PATH}`,
  );
}

main();
