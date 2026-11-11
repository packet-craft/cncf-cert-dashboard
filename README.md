# CNCF Exam Prep — KCNA · KCSA · CKA

A single-page, dependency-free study platform for three CNCF certifications. It combines a
domain-by-domain study guide with progress tracking, a readiness score, a command cheat sheet and
flashcards, so everything needed to prepare is in one place:

| Cert | Full name | Format | Pass mark |
|------|-----------|--------|-----------|
| **KCNA** | Kubernetes and Cloud Native Associate | Multiple choice, 90 min | 75% |
| **KCSA** | Kubernetes and Cloud Native Security Associate | Multiple choice, 90 min | 75% |
| **CKA** | Certified Kubernetes Administrator | Hands-on, 2 h | 66% |

**Live demo:** `https://<github-username>.github.io/<repository-name>/`
(for this repository: <https://packet-craft.github.io/cncf-cert-dashboard/>)

## Features

- **Study guide** — detailed documentation for every exam domain, organised into topics with
  tables, diagrams, YAML examples, exam tips and self-test questions. Topics are searchable, can be
  linked to directly (`#kcna/learn/fund/pods`) and show the checklist items they cover, so reading
  and tracking happen in the same place. All three certifications are covered: KCNA (4 domains,
  35 topics), KCSA (6 domains, 40 topics) and CKA (5 domains, 36 topics). The CKA guide is
  command-oriented, with step-by-step procedures and worked troubleshooting examples.
- **Domain trackers** — every exam domain with its weight, progress bar and points earned.
- **Interactive checklists** — 126 study items, filterable by domain, priority, study week and free text. State is saved to `localStorage`.
- **Exam readiness calculator** — a weighted score per certification, compared against the pass mark.
- **CLI cheat sheet** — searchable, copy-to-clipboard commands for `kubectl`, `kubeadm`, `etcdctl`, `crictl` and security tooling (Trivy, kube-bench, kubescape, Cosign, Falco).
- **Flashcards** — flip-animated cards for concepts, definitions and commands, with shuffle, "mark as known" and keyboard shortcuts (`Space`, `←`, `→`, `K`).
- **Resources** — curated free and open-source courses, repositories, labs and references for each certification.
- Light and dark themes, mobile layout, progress export/import as JSON.

### How readiness is calculated

```
readiness = Σ over domains ( completed items ÷ total items ) × domain weight
```

Finishing all items in a 30% domain earns 30 points; half of them earns 15. The score measures
**study coverage**, not a predicted exam result.

## Architecture

| Choice | Why |
|--------|-----|
| Plain HTML + CSS + vanilla JS, no build step | Nothing to install, nothing to break; GitHub Pages serves the files as-is. |
| No CDN or third-party requests | Works offline and from `file://`; no supply-chain exposure. |
| Strict Content-Security-Policy | `default-src 'none'`, scripts and styles from the site only, no inline code. |
| Content separate from code | Weights, checklists and commands live in one data file and the study guide in `assets/js/docs/`; changing content never touches application code. |
| Guide written in a Markdown subset | Easy to edit; rendered by a small built-in parser that escapes everything, so content cannot inject HTML. |
| `localStorage` for state | No backend or account; progress stays in the user's browser. |

```
.
├── index.html                  # Page shell
├── assets/
│   ├── css/styles.css          # Theme tokens (light/dark) and layout
│   └── js/
│       ├── theme.js            # Applies the saved theme before first paint
│       ├── data.js             # Certs, domains, weights, checklist items, commands, flashcards, resources
│       ├── docs/               # Study guide: one file per certification domain (kcna-fund.js, …)
│       └── app.js              # State, routing, Markdown rendering, views, events
├── scripts/validate-data.js    # Content sanity checks (weights, guide coverage, Markdown, etc.)
├── docs/                       # Study guides, resource lists and setup guide
└── .github/workflows/deploy.yml
```

### Editing content

Everything lives in [`assets/js/data.js`](assets/js/data.js). Checklist items are
`[title, priority, studyWeek]` tuples. Item ids are derived from their position, so **append new
items to the end of a domain** — inserting in the middle shifts saved progress onto the wrong items.

### Editing the study guide

Each file in [`assets/js/docs/`](assets/js/docs/) holds one domain: an `intro` and a list of
`topics`. A topic has a `key` (used in the URL), `title`, `summary`, `body`, `quiz` and `items` —
the indexes of the checklist items it covers, which appear as tick boxes under the topic.

`body` is an array of lines in a small Markdown subset: `##` and `###` headings, one paragraph per
line, `-` and `1.` lists, `| tables |`, fenced code blocks, `>` callouts, and inline `` `code` ``,
`**bold**`, `*italic*` and `[links](https://…)`. A `|` cannot be used inside a table cell.

Files are named `<cert>-<domain key>.js`. To add a guide for another certification, create one
file for each of its domains and add the `<script>` tags to `index.html`. The validator checks that every domain has
a guide, that every checklist item is covered by a topic and that the Markdown is well formed.

After editing, run:

```bash
node scripts/validate-data.js
```

## Local development

No dependencies. Either open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deployment

Every push to `main` runs [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml), which
validates the content (including the study guide), assembles `index.html` + `assets/` and publishes them to GitHub Pages.
One-time repository setup is described in [docs/GITHUB_PAGES_SETUP.md](docs/GITHUB_PAGES_SETUP.md).

## Documentation

The full study guides are in the app (Study Guide tab). The Markdown files below are short summaries:

- [KCNA summary](docs/KCNA_STUDY_GUIDE.md)
- [KCSA summary](docs/KCSA_STUDY_GUIDE.md)
- [CKA summary](docs/CKA_STUDY_GUIDE.md)
- Free study resources: [KCNA](docs/KCNA_RESOURCES.md) · [KCSA](docs/KCSA_RESOURCES.md) · [CKA](docs/CKA_RESOURCES.md)
- [GitHub Pages setup](docs/GITHUB_PAGES_SETUP.md)

## A note on domain weights

Domains and weights match the official curricula at <https://github.com/cncf/curriculum> as checked
in November 2026:

| Cert | Domains |
|------|---------|
| KCNA | Kubernetes Fundamentals 44 · Container Orchestration 28 · Cloud Native Application Delivery 16 · Cloud Native Architecture 12 |
| KCSA | Overview of Cloud Native Security 14 · Cluster Component Security 22 · Security Fundamentals 22 · Threat Model 16 · Platform Security 16 · Compliance and Security Frameworks 10 |
| CKA | Cluster Architecture, Installation & Configuration 25 · Workloads & Scheduling 15 · Storage 10 · Services & Networking 20 · Troubleshooting 30 |

This differs from the original project brief
([`kcna_kcsa_cka_dashboard_agent_prompt.md`](kcna_kcsa_cka_dashboard_agent_prompt.md)), which used
an older KCNA outline and a non-official KCSA grouping. CNCF revises its curricula periodically, so
confirm before booking an exam and adjust `assets/js/data.js` if needed.

This project is an independent study aid and is not affiliated with or endorsed by the CNCF or
The Linux Foundation.
