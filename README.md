# CNCF Exam Prep Dashboard — KCNA · KCSA · CKA

A single-page, dependency-free study dashboard for three CNCF certifications:

| Cert | Full name | Format | Pass mark |
|------|-----------|--------|-----------|
| **KCNA** | Kubernetes and Cloud Native Associate | Multiple choice, 90 min | 75% |
| **KCSA** | Kubernetes and Cloud Native Security Associate | Multiple choice, 90 min | 75% |
| **CKA** | Certified Kubernetes Administrator | Hands-on, 2 h | 66% |

**Live demo:** `https://<github-username>.github.io/<repository-name>/`
(for this repository: <https://packet-craft.github.io/cncf-cert-dashboard/>)

## Features

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
| All content in one data file | Changing a weight or adding a topic never touches application code. |
| `localStorage` for state | No backend or account; progress stays in the user's browser. |

```
.
├── index.html                  # Page shell
├── assets/
│   ├── css/styles.css          # Theme tokens (light/dark) and layout
│   └── js/
│       ├── theme.js            # Applies the saved theme before first paint
│       ├── data.js             # ALL content: certs, domains, weights, items, commands, flashcards, resources
│       └── app.js              # State, rendering, events
├── scripts/validate-data.js    # Content sanity checks (weights sum to 100, etc.)
├── docs/                       # Study guides, resource lists and setup guide
└── .github/workflows/deploy.yml
```

### Editing content

Everything lives in [`assets/js/data.js`](assets/js/data.js). Checklist items are
`[title, priority, studyWeek]` tuples. Item ids are derived from their position, so **append new
items to the end of a domain** — inserting in the middle shifts saved progress onto the wrong items.

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
validates the content, assembles `index.html` + `assets/` and publishes them to GitHub Pages.
One-time repository setup is described in [docs/GITHUB_PAGES_SETUP.md](docs/GITHUB_PAGES_SETUP.md).

## Documentation

- [KCNA study guide](docs/KCNA_STUDY_GUIDE.md)
- [KCSA study guide](docs/KCSA_STUDY_GUIDE.md)
- [CKA study guide](docs/CKA_STUDY_GUIDE.md)
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
