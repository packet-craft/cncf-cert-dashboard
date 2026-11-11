#!/usr/bin/env node
// Sanity-checks assets/js/data.js. Run locally with `node scripts/validate-data.js`;
// the deploy workflow runs it before publishing.
const fs = require("fs");
const path = require("path");
const DATA = require("../assets/js/data.js");

// Study guide files are plain browser scripts that add to the global DATA.docs.
global.DATA = DATA;
const DOCS_DIR = path.join(__dirname, "../assets/js/docs");
const docFiles = fs.readdirSync(DOCS_DIR).filter((f) => f.endsWith(".js")).sort();
for (const f of docFiles) require(path.join(DOCS_DIR, f));

const errors = [];
const PRIORITIES = ["high", "medium", "low"];
const TYPES = ["concept", "definition", "command"];
const KEY_RE = /^[a-z0-9-]+$/; // keys end up in HTML attributes and CSS selectors

for (const [key, cert] of Object.entries(DATA.certs)) {
  const total = cert.domains.reduce((s, d) => s + d.weight, 0);
  if (total !== 100) errors.push(`${key}: domain weights sum to ${total}, expected 100`);

  if (!KEY_RE.test(key)) errors.push(`cert key "${key}" must match ${KEY_RE}`);
  const keys = new Set();
  for (const d of cert.domains) {
    if (keys.has(d.key)) errors.push(`${key}: duplicate domain key "${d.key}"`);
    keys.add(d.key);
    if (!KEY_RE.test(d.key)) errors.push(`${key}: domain key "${d.key}" must match ${KEY_RE}`);
    if (!d.items.length) errors.push(`${key}/${d.key}: no checklist items`);
    d.items.forEach(([title, priority, week], i) => {
      const where = `${key}/${d.key}[${i}]`;
      if (!title) errors.push(`${where}: empty title`);
      if (!PRIORITIES.includes(priority)) errors.push(`${where}: bad priority "${priority}"`);
      if (!Number.isInteger(week) || week < 1 || week > cert.weeks) errors.push(`${where}: week ${week} outside 1..${cert.weeks}`);
    });
  }
}

for (const s of DATA.cheats) {
  if (!KEY_RE.test(s.tool)) errors.push(`cheats "${s.title}": tool "${s.tool}" must match ${KEY_RE}`);
  for (const c of s.certs) if (!DATA.certs[c]) errors.push(`cheats "${s.title}": unknown cert "${c}"`);
  for (const cmd of s.cmds) if (cmd.length !== 2 || !cmd[0] || !cmd[1]) errors.push(`cheats "${s.title}": malformed command entry`);
}

const seen = new Set();
for (const f of DATA.flashcards) {
  const id = `${f.cert}:${f.q}`;
  if (!DATA.certs[f.cert]) errors.push(`flashcard "${f.q}": unknown cert "${f.cert}"`);
  if (!TYPES.includes(f.type)) errors.push(`flashcard "${f.q}": bad type "${f.type}"`);
  if (!f.q || !f.a) errors.push(`flashcard "${id}": missing question or answer`);
  if (seen.has(id)) errors.push(`flashcard "${id}": duplicate`);
  seen.add(id);
}

for (const key of Object.keys(DATA.certs)) {
  const groups = DATA.resources[key];
  if (!groups || !groups.length) { errors.push(`resources: none for "${key}"`); continue; }
  for (const g of groups) {
    for (const r of g.items) {
      if (r.length !== 3 || !r[0] || !r[2]) errors.push(`resources ${key}/"${g.group}": malformed entry`);
      else if (!/^https:\/\//.test(r[1])) errors.push(`resources ${key}/"${r[0]}": URL must be https`);
    }
  }
}

// ---------- study guide ----------
// Mirrors the Markdown subset understood by md() in app.js.
function checkMarkdown(where, lines) {
  if (!Array.isArray(lines) || !lines.length) { errors.push(`${where}: no content`); return; }
  let fence = false, tableCols = 0;
  lines.forEach((line, i) => {
    const at = `${where} line ${i + 1}`;
    if (typeof line !== "string") { errors.push(`${at}: not a string`); return; }
    if (/^```/.test(line)) { fence = !fence; tableCols = 0; return; }
    if (fence) return;
    if ((line.match(/`/g) || []).length % 2) errors.push(`${at}: unbalanced backticks`);
    if ((line.replace(/`[^`]*`/g, "").match(/\*\*/g) || []).length % 2) errors.push(`${at}: unbalanced **`);
    if (/\*\*`|`\*\*/.test(line)) errors.push(`${at}: ** cannot wrap \`code\` directly`);
    if (/^#{1} |^#{4,} /.test(line)) errors.push(`${at}: only ## and ### headings are supported`);
    if (/^\|/.test(line)) {
      const cols = line.trim().replace(/^\||\|$/g, "").split("|").length;
      if (!tableCols) {
        tableCols = cols;
        if (!/^\|[\s:|-]+\|$/.test(lines[i + 1] || "")) errors.push(`${at}: table header needs a |---| row under it`);
      } else if (cols !== tableCols) errors.push(`${at}: ${cols} cells, expected ${tableCols} (a | inside a cell?)`);
      else if (/^\|[\s:|-]+\|$/.test(line) && /^\|/.test(lines[i - 2] || "")) errors.push(`${at}: second |---| row — two tables need a line of text between them`);
    } else tableCols = 0;
  });
  if (fence) errors.push(`${where}: unclosed code fence`);
}

let topicCount = 0;
for (const [certKey, docs] of Object.entries(DATA.docs)) {
  const cert = DATA.certs[certKey];
  if (!cert) { errors.push(`docs: unknown cert "${certKey}"`); continue; }
  for (const dKey of Object.keys(docs)) if (!cert.domains.some((d) => d.key === dKey)) errors.push(`docs/${certKey}: unknown domain "${dKey}"`);
  for (const d of cert.domains) {
    const doc = docs[d.key];
    // A guide is published per certification: once one domain is written, all must be.
    if (!doc) { errors.push(`docs/${certKey}: no guide for domain "${d.key}"`); continue; }
    checkMarkdown(`docs/${certKey}/${d.key} intro`, doc.intro);
    const covered = new Set(), tKeys = new Set();
    for (const t of doc.topics || []) {
      const where = `docs/${certKey}/${d.key}/${t.key}`;
      topicCount++;
      if (!KEY_RE.test(t.key || "")) errors.push(`${where}: topic key must match ${KEY_RE}`);
      if (tKeys.has(t.key)) errors.push(`${where}: duplicate topic key`);
      tKeys.add(t.key);
      if (!t.title || !t.summary) errors.push(`${where}: missing title or summary`);
      checkMarkdown(where, t.body);
      if (!Array.isArray(t.items) || !t.items.length) errors.push(`${where}: must list at least one checklist item`);
      for (const i of t.items || []) {
        if (!Number.isInteger(i) || i < 0 || i >= d.items.length) errors.push(`${where}: checklist index ${i} out of range`);
        covered.add(i);
      }
      for (const qa of t.quiz || []) {
        if (!Array.isArray(qa) || qa.length !== 2 || !qa[0] || !qa[1]) errors.push(`${where}: malformed quiz entry`);
        else checkMarkdown(`${where} quiz`, qa);
      }
    }
    if (!doc.topics || !doc.topics.length) errors.push(`docs/${certKey}/${d.key}: no topics`);
    d.items.forEach((it, i) => { if (!covered.has(i)) errors.push(`docs/${certKey}/${d.key}: checklist item ${i} ("${it[0]}") is not covered by any topic`); });
  }
}

// Every guide file must be loaded by the page, and vice versa.
const html = fs.readFileSync(path.join(__dirname, "../index.html"), "utf8");
const loaded = (html.match(/assets\/js\/docs\/[^"]+\.js/g) || []).map((p) => path.basename(p)).sort();
if (loaded.join() !== docFiles.join()) errors.push(`index.html loads [${loaded}] but assets/js/docs has [${docFiles}]`);

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
const items = Object.values(DATA.certs).reduce((s, c) => s + c.domains.reduce((n, d) => n + d.items.length, 0), 0);
console.log(`OK: ${Object.keys(DATA.certs).length} certs, ${items} checklist items, ${DATA.cheats.length} cheat sections, ${DATA.flashcards.length} flashcards, ${topicCount} guide topics (${Object.keys(DATA.docs).join(", ") || "none"})`);
