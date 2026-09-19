#!/usr/bin/env node
// Parses a data-submission issue body (created by the app's "Submit via
// GitHub Issue" buttons) and applies it to the matching /data/*.json file.
//
// Expects env var ISSUE_BODY containing the raw issue body text, which must
// contain a fenced ```json ... ``` block with an envelope of the shape:
//   { target, operation: "append" | "update", id?, data }
//
// Writes GitHub Actions step outputs: file, target, operation, id.

import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const MARKER = "<!-- golf-coach-data -->";

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

function setOutput(name, value) {
  const outFile = process.env.GITHUB_OUTPUT;
  if (!outFile) return;
  writeFileSync(outFile, `${name}=${value}\n`, { flag: "a" });
}

const body = process.env.ISSUE_BODY || "";

if (!body.includes(MARKER)) {
  fail("issue body is missing the golf-coach-data marker");
}

const fenceMatch = body.match(/```json\s*([\s\S]*?)\s*```/);
if (!fenceMatch) {
  fail("no ```json fenced block found in issue body");
}

let envelope;
try {
  envelope = JSON.parse(fenceMatch[1]);
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

if (operation === "append") {
  const existingIndex = data.id ? list.findIndex((item) => item.id === data.id) : -1;
  if (existingIndex >= 0) {
    // Same id already present (e.g. a resubmission) — merge instead of duplicating.
    Object.assign(list[existingIndex], data);
    effectiveOperation = "update";
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

console.log(`ingest-issue: ${effectiveOperation} applied to ${file} (id: ${id ?? data.id ?? "n/a"})`);

setOutput("file", file);
setOutput("target", target);
setOutput("operation", effectiveOperation);
setOutput("id", id ?? data.id ?? "");
