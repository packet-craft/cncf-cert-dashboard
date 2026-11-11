# Master Prompt for AI Agent: CNCF Certification Dashboard & GitHub Pages Setup

Copy and paste the following prompt into your AI coding agent (e.g., Cursor, Claude Code, AutoGPT, or GitHub Copilot Agent).

---

### BEGIN AGENT PROMPT ###

**Role:** Expert DevOps Engineer & Full-Stack Web Developer  
**Task:** Build a single-page interactive **CNCF Exam Preparation Dashboard** covering **KCNA**, **KCSA**, and **CKA** certifications, configure it for deployment via **GitHub Pages**, and thoroughly document the entire project in Markdown format within the repository.

---

### Key Requirements

#### 1. Repository Setup & Architecture
- Initialize a clean project structure suitable for static deployment to GitHub Pages (e.g., standard HTML/Tailwind CDN, Vite React, or Next.js static export).
- Include GitHub Actions workflows (`.github/workflows/deploy.yml`) to automatically build and deploy the dashboard to GitHub Pages upon pushing to `main`.

#### 2. Dashboard Features & Capabilities
Create a unified, tabbed or multi-view interface for **KCNA**, **KCSA**, and **CKA**:
- **Multi-Cert Domain Trackers:** 
  - **KCNA:** Kubernetes Fundamentals (46%), Container Orchestration (22%), Cloud Native Architecture (16%), Observability (8%), Application Delivery (8%).
  - **KCSA:** Cloud Native Security Overview (14%), Kubernetes Cluster Protection (22%), Container Security (20%), Workload Security (18%), Security Operations & Compliance (26%).
  - **CKA:** Cluster Architecture, Installation & Configuration (25%), Workloads & Services (15%), Storage (10%), Troubleshooting (30%), Services & Networking (20%).
- **Interactive Checklists:** Filterable by Domain, Difficulty/Priority, and Study Week with state saved to `localStorage`.
- **Exam Readiness Calculator:** Compute weighted scores based on completed items vs domain weight for each certification.
- **CLI & Command Cheat Sheet:** Quick-reference section for imperative `kubectl` commands, `etcdctl`, `crictl`, and security auditing tools relevant to CKA & KCSA.
- **Interactive Flashcards:** Digital study cards with flip animations for definitions, architectural concepts, and commands.

#### 3. In-Repository Markdown Documentation
Generate complete, production-ready Markdown documentation inside the project root:

1. **`README.md`**: Project overview, live demo link format, architectural choices, local development setup, and deployment guide.
2. **`docs/KCNA_STUDY_GUIDE.md`**: Topic breakdown, CNCF ecosystem mapping, key concepts, and study resources.
3. **`docs/KCSA_STUDY_GUIDE.md`**: Cloud-native security standards, RBAC, pod security standards, network policies, and auditing guide.
4. **`docs/CKA_STUDY_GUIDE.md`**: Hands-on lab exercises, troubleshooting patterns, `kubectl` imperative speed cheatsheet, and cluster architecture reference.
5. **`docs/GITHUB_PAGES_SETUP.md`**: Step-by-step guide detailing how to enable GitHub Pages via Repository Settings using GitHub Actions.

---

### Execution Instructions for the Agent

1. **Step 1:** Create the repository directory structure.
2. **Step 2:** Write all core application source files (`index.html` or React app components).
3. **Step 3:** Create the GitHub Actions workflow file for automated deployment.
4. **Step 4:** Write all five requested Markdown documentation files.
5. **Step 5:** Provide exact `git` commands for committing and pushing the project to GitHub.

### END AGENT PROMPT ###