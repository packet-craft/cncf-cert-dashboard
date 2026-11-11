#!/usr/bin/env node
// Sanity-checks assets/js/data.js. Run locally with `node scripts/validate-data.js`;
// the deploy workflow runs it before publishing.
const DATA = require("../assets/js/data.js");

const errors = [];
const PRIORITIES = ["high", "medium", "low"];
const TYPES = ["concept", "definition", "command"];

for (const [key, cert] of Object.entries(DATA.certs)) {
  const total = cert.domains.reduce((s, d) => s + d.weight, 0);
  if (total !== 100) errors.push(`${key}: domain weights sum to ${total}, expected 100`);

  const keys = new Set();
  for (const d of cert.domains) {
    if (keys.has(d.key)) errors.push(`${key}: duplicate domain key "${d.key}"`);
    keys.add(d.key);
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

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
const items = Object.values(DATA.certs).reduce((s, c) => s + c.domains.reduce((n, d) => n + d.items.length, 0), 0);
console.log(`OK: ${Object.keys(DATA.certs).length} certs, ${items} checklist items, ${DATA.cheats.length} cheat sections, ${DATA.flashcards.length} flashcards`);
