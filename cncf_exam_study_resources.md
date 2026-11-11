# Free & Open-Source CNCF Certification Study Resources

A curated guide of high-quality, 100% free, and open-source learning materials, labs, documentation, and video courses for **KCNA**, **KCSA**, and **CKA** exams.

---

## 1. KCNA (Kubernetes & Cloud Native Associate)
*Focus: Conceptual Knowledge, CNCF Ecosystem, & Multiple-Choice Questions*

### 📚 Open-Source Repositories & Guides
* **[msahihi/KCNA-study-guide](https://github.com/msahihi/KCNA-study-guide):** Comprehensive study guide with detailed theoretical notes mapped directly to official domain weights, practical YAML labs, a handy quick-reference cheatsheet (`KCNA_CHEATSHEET.md`), and practice questions.
* **[Wriju's KCNA Exam Prep Guide](https://wrijugh.github.io/kcna/):** Topic-by-topic mapping linking every single exam domain to relevant official CNCF, Kubernetes, and OpenTelemetry documentation pages.
* **[CNCF Cloud Native Glossary](https://glossary.cncf.io/):** Community-driven glossary providing clear, standardized definitions for cloud-native jargon (essential for exam terminology).

### 🎥 Free Courses & Video Content
* **[freeCodeCamp 14-Hour KCNA Full Course (YouTube)](https://www.youtube.com/watch?v=AplluksKvzI):** Comprehensive video course covering containers, Kubernetes architecture, observability, continuous delivery, and the CNCF landscape.
* **[Linux Foundation — Intro to Kubernetes (LFS158x)](https://www.edx.org/learn/kubernetes/the-linux-foundation-introduction-to-kubernetes):** Official free audit-track course on edX by the Linux Foundation covering foundational container orchestration concepts.

### 🗺️ Interactive References
* **[CNCF Interactive Landscape](https://landscape.cncf.io/):** Essential visual reference map to learn the difference between CNCF project maturity levels (Graduated, Incubating, Sandbox).

---

## 2. KCSA (Kubernetes & Cloud Native Security Associate)
*Focus: Security Architecture, Threat Modeling, & Compliance*

### 📚 Open-Source Repositories & Security Notes
* **[iamaliyousefi/kcsa](https://github.com/iamaliyousefi/kcsa):** Curated open-source repository featuring detailed breakdowns of compliance frameworks (CIS Benchmarks, NIST, NSA/CISA), Pod Security Standards, and container security mechanisms.
* **[InfraSec KCSA Study Guide](https://infrasec.sh/post/cncf-kcsa/):** Deep-dive domain breakdown combining security notes, OWASP Kubernetes Top 10, threat modeling (STRIDE, ATT&CK), and security scanner tools (`trivy`, `kube-bench`, `kubescape`).

### 🛡️ Standards & Threat Frameworks
* **[NSA/CISA Kubernetes Hardening Guidance](https://www.nsa.gov/Press-Room/News-Highlights/Article/Article/2719161/nsa-cisa-release-kubernetes-hardening-guidance/):** Official cybersecurity technical report heavily referenced in cloud-native security certification topics.
* **[OWASP Kubernetes Security Testing Guide (KSTG)](https://owasp.org/www-project-kubernetes-security-testing-guide/):** Open-source framework detailing threat models, common misconfigurations, and cluster attack paths.

---

## 3. CKA (Certified Kubernetes Administrator)
*Focus: Practical Command Line Hands-On Labs, Troubleshooting, & Performance*

### 🧪 Hands-On Labs & Repositories
* **[codewithmuh/cka-course](https://github.com/codewithmuh/cka-course):** Complete open-source course featuring 7 modules, 44 hands-on lessons, a 1-command local `kind` cluster setup script, and 3 timed mock exams.
* **[walidshaari/Kubernetes-CKA-Study-Guide](https://github.com/walidshaari/Kubernetes-CKA-Study-Guide):** Community-maintained study guide with hands-on practice exercises covering `kubeadm` cluster creation, storage, networking, and RBAC.
* **[arush-sal/cka-practice-exercises](https://github.com/arush-sal/cka-practice-exercises):** A collection of scenario-based imperative command exercises and manifest generation drills.

### 🖥️ Free Practice Sandbox Environments
* **[Play with Kubernetes](https://labs.play-with-k8s.com/):** Free browser-based multi-node lab environment provided by Docker to practice cluster setup (`kubeadm init` / `kubeadm join`) and node maintenance.
* **[Killer.sh CKA Simulator](https://killer.sh/):** Official exam simulator included for free (2 access attempts) with the purchase of any official CKA exam voucher.

### 📖 Essential Official Docs (Allowed in Exam)
* **[Kubernetes Official Documentation](https://kubernetes.io/docs/):** Practice searching and navigating docs quickly.
* **[kubectl Cheat Sheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/):** Bookmark and master imperative command syntax for faster lab resolution.

---

## 4. Suggested Directory Structure for Agent Integration

When generating your preparation dashboard repo, structure the docs folder to reference these open-source materials:

```text
.
├── README.md
├── docs/
│   ├── KCNA_RESOURCES.md
│   ├── KCSA_RESOURCES.md
│   ├── CKA_RESOURCES.md
│   └── GITHUB_PAGES_SETUP.md
└── src/
    └── index.html (or App.jsx)
```