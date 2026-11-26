import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

function getLine(): string {
  return "My grandmother, who never learned to read, told me to sign nothing I could not explain to her at the kitchen table, and it has saved me from every contract I was too proud to question.";
}

function validateLine(line: string): void {
  const charCount = [...line].length;
  if (charCount === 0) {
    throw new Error("line must not be empty");
  }
  if (charCount > 200) {
    throw new Error(`line too long: ${charCount} > 200`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("line must be a single line without newline");
  }
  if (line.trim() !== line) {
    throw new Error("line must not have leading or trailing whitespace");
  }
  if (!line.endsWith(".")) {
    throw new Error("line must end with a period as a single sentence");
  }
  const terminators = line.slice(0, -1).match(/[.!?]/g) ?? [];
  if (terminators.length > 0) {
    throw new Error("line must be exactly one sentence");
  }
}

function main(): void {
  const line = getLine();
  validateLine(line);
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "out";
  mkdirSync(outputDir, { recursive: true });
  const outputPath = join(outputDir, "entry.txt");
  writeFileSync(outputPath, line, "utf8");
  const readBack = readFileSync(outputPath, "utf8");
  if (readBack !== line) {
    throw new Error("read-back verification failed");
  }
  const sha256 = createHash("sha256").update(readBack, "utf8").digest("hex");
  console.log(sha256);
}

main();
