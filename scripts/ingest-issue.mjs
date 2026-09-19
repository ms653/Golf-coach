#!/usr/bin/env node
// Parses a data-submission issue body (created by the app's "Submit via
// GitHub Issue" buttons) and applies it to the matching /data/*.json file.
//
// Expects env var ISSUE_BODY containing the raw issue body text, which must
// contain the envelope JSON between the golf-coach-data start/end markers:
//   { target, operation: "append" | "update", id?, data }
//
// Writes GitHub Actions step outputs: file, target, operation, id.

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";

const START_MARKER = "<!-- golf-coach-data:start -->";
const END_MARKER = "<!-- golf-coach-data:end -->";

const TARGETS = {
  lessons: { file: "data/lessons.json", key: "lessons" },
  sessions: { file: "data/sessions.json", key: "sessions" },
  stats: { file: "data/stats.json", key: "entries" },
  reviews: { file: "data/reviews.json", key: "reviews" },
  training_plans: { file: "data/training_plans.json", key: "plans" },
  drills: { file: "data/drills.json", key: "drills" },
};

function fail(message) {
  console.error(`ingest-issue: ${message}`);
  process.exit(1);
}

// GitHub Actions requires the multiline delimiter syntax for any output
// value that might contain a newline, otherwise it corrupts $GITHUB_OUTPUT.
function setOutput(name, value) {
  const outFile = process.env.GITHUB_OUTPUT;
  if (!outFile) return;
  const delimiter = `ghadelim_${randomUUID()}`;
  writeFileSync(outFile, `${name}<<${delimiter}\n${value}\n${delimiter}\n`, {
    flag: "a",
  });
}

function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b || a === null || b === null) return false;
  if (typeof a !== "object") return false;
  if (Array.isArray(a) !== Array.isArray(b)) return false;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((k) => deepEqual(a[k], b[k]));
}

/** Finds the next unused id by suffixing -b, -c, ... onto the base id. */
/**
 * Finds the first complete top-level {...} JSON object within a string,
 * respecting string-literal boundaries so braces inside quoted values
 * (or surrounding prose/markdown fences) don't confuse the depth count.
 */
function extractJsonObject(text) {
  const start = text.indexOf("{");
  if (start === -1) return null;
  let depth = 0;
  let inString = false;
  let escapeNext = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    if (ch === "\\") {
      escapeNext = true;
      continue;
    }
    if (ch === '"') {
      inString = !inString;
      continue;
    }
    if (inString) continue;
    if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return text.slice(start, i + 1);
    }
  }
  return null;
}

function nextAvailableId(list, baseId) {
  const suffixes = "bcdefghijklmnopqrstuvwxyz";
  for (const suffix of suffixes) {
    const candidate = `${baseId}-${suffix}`;
    if (!list.some((item) => item.id === candidate)) return candidate;
  }
  fail(`could not find an available id derived from "${baseId}"`);
}

const body = process.env.ISSUE_BODY || "";

const startIndex = body.indexOf(START_MARKER);
const endIndex = body.indexOf(END_MARKER);
if (startIndex === -1 || endIndex === -1 || endIndex < startIndex) {
  fail("issue body is missing the golf-coach-data start/end markers");
}

const span = body.slice(startIndex + START_MARKER.length, endIndex);
const jsonText = extractJsonObject(span);
if (!jsonText) {
  fail("no JSON object found between the golf-coach-data markers");
}

let envelope;
try {
  envelope = JSON.parse(jsonText);
} catch (err) {
  fail(`could not parse JSON envelope: ${err.message}`);
}

const { target, operation, data } = envelope;
const id = envelope.id ?? data?.id;

if (!target || !(target in TARGETS)) {
  fail(`unknown target "${target}"`);
}
if (operation !== "append" && operation !== "update") {
  fail(`unknown operation "${operation}"`);
}
if (!data || typeof data !== "object") {
  fail("envelope is missing a valid data object");
}
if (operation === "update" && !id) {
  fail("update operation requires an id (envelope.id or data.id)");
}

const { file, key } = TARGETS[target];
const filePath = resolve(process.cwd(), file);

let parsed;
try {
  parsed = JSON.parse(readFileSync(filePath, "utf8"));
} catch (err) {
  fail(`could not read/parse ${file}: ${err.message}`);
}

if (!Array.isArray(parsed[key])) {
  fail(`${file} does not have an array at "${key}"`);
}

const list = parsed[key];
let effectiveOperation = operation;
let effectiveId = id;

if (operation === "append") {
  const existingIndex = data.id ? list.findIndex((item) => item.id === data.id) : -1;
  if (existingIndex >= 0 && deepEqual(list[existingIndex], data)) {
    // Byte-for-byte identical to what's already there — a true resubmission
    // (e.g. a double-click or a retried request), safe to no-op.
    effectiveOperation = "resubmission (no changes)";
  } else if (existingIndex >= 0) {
    // Same id but different content — a genuinely distinct entry that
    // collided (e.g. two sessions logged the same day). Give it a new id
    // rather than silently overwriting the earlier entry.
    const newId = nextAvailableId(list, data.id);
    list.push({ ...data, id: newId });
    effectiveId = newId;
  } else {
    list.push(data);
  }
} else {
  const index = list.findIndex((item) => item.id === id);
  if (index < 0) {
    fail(`no ${target} entry found with id "${id}" to update`);
  }
  Object.assign(list[index], data);
}

writeFileSync(filePath, JSON.stringify(parsed, null, 2) + "\n");

console.log(
  `ingest-issue: ${effectiveOperation} applied to ${file} (id: ${effectiveId ?? data.id ?? "n/a"})`
);

setOutput("file", file);
setOutput("target", target);
setOutput("operation", effectiveOperation);
setOutput("id", effectiveId ?? data.id ?? "");
