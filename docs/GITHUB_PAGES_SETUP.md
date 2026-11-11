# GitHub Pages Setup (GitHub Actions)

This project deploys with a GitHub Actions workflow rather than the legacy "deploy from a branch"
mode. The workflow is already in the repository at `.github/workflows/deploy.yml`; you only need to
switch Pages on once.

## Prerequisites

- The repository is **public**, or you are on a plan that allows Pages for private repositories
  (GitHub Pro, Team or Enterprise).
- You have admin access to the repository.

## 1. Enable Pages with GitHub Actions as the source

### In the browser

1. Open the repository on GitHub.
2. Go to **Settings → Pages** (left sidebar, under *Code and automation*).
3. Under **Build and deployment → Source**, choose **GitHub Actions**.

There is nothing to save — the selection applies immediately.

### Or with the GitHub CLI

```bash
gh api -X POST repos/<owner>/<repo>/pages -f build_type=workflow
```

## 2. Trigger a deployment

Push any commit to `main`, or run the workflow by hand:

```bash
gh workflow run "Deploy to GitHub Pages"
```

(or **Actions → Deploy to GitHub Pages → Run workflow** in the browser).

## 3. Find the site URL

After the `deploy` job finishes, the URL appears on the workflow run summary and under
**Settings → Pages**. It has the form:

```
https://<github-username>.github.io/<repository-name>/
```

## What the workflow does

| Job | Step | Purpose |
|-----|------|---------|
| `build` | `actions/checkout` | Fetch the repository |
| | `node scripts/validate-data.js` | Fail the deploy if the content is malformed (e.g. weights don't sum to 100) |
| | Assemble site | Copy `index.html` and `assets/` into `_site/` — docs and scripts are not published |
| | `actions/configure-pages` | Read Pages settings |
| | `actions/upload-pages-artifact` | Package `_site/` |
| `deploy` | `actions/deploy-pages` | Publish the artifact to the `github-pages` environment |

The workflow requests only the permissions it needs: `contents: read`, `pages: write`,
`id-token: write`.

## Troubleshooting

| Symptom | Cause and fix |
|---------|---------------|
| `deploy` fails with *"Get Pages site failed"* or HTTP 404 | Pages is not enabled, or the source is not **GitHub Actions**. Redo step 1. |
| `git push` rejected: *"refusing to allow an OAuth App to create or update workflow"* | Your token lacks the `workflow` scope. Run `gh auth refresh -s workflow`, then push again. |
| Site loads without styles | An asset path was made absolute (`/assets/...`). Keep paths relative (`assets/...`) because the site is served from `/<repository-name>/`. |
| Branch "main" is not allowed to deploy | **Settings → Environments → github-pages → Deployment branches**: allow `main`. |
| Old content still showing | Hard-refresh; Pages caches for up to 10 minutes. |

## Custom domain (optional)

**Settings → Pages → Custom domain**, enter the domain, and create a `CNAME` DNS record pointing at
`<github-username>.github.io`. Tick **Enforce HTTPS** once the certificate has been issued.
