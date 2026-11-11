# KCSA Study Guide

**Kubernetes and Cloud Native Security Associate** — 60 multiple-choice questions, 90 minutes,
online proctored, pass mark 75%. Conceptual, not hands-on, but questions assume you can read
manifests and recognise security-relevant flags.

> Domain names and weights below follow this project's brief. The official outline may group the
> same topics differently — check <https://github.com/cncf/curriculum> before the exam.

| Domain | Weight | Suggested weeks |
|--------|-------:|-----------------|
| Cloud Native Security Overview | 14% | 1 |
| Kubernetes Cluster Protection | 22% | 1–3 |
| Container Security | 20% | 3 |
| Workload Security | 18% | 3–4 |
| Security Operations & Compliance | 26% | 4 |

## 1. Cloud native security standards and principles

- **The 4Cs:** Cloud → Cluster → Container → Code. Each layer depends on the ones outside it; you
  cannot fix a compromised cloud account with good application code.
- **Shared responsibility:** with a managed service (EKS, GKE, AKS) the provider secures the control
  plane; you still own workloads, RBAC, network policy and, usually, node configuration.
- **Principles:** defense in depth, least privilege, zero trust (authenticate and authorize every
  request; network location grants nothing), separation of duties.
- **Isolation levels:** namespace (soft), node pools, sandboxed runtimes (gVisor, Kata), separate
  clusters (hard).

## 2. Cluster protection

### API request flow

```
Request → Authentication → Authorization → Mutating admission → Schema validation → Validating admission → etcd
```

- **Authentication:** X.509 client certificates, ServiceAccount tokens (bound, short-lived,
  projected), OIDC. Kubernetes has no user objects; `system:anonymous` should be disabled or
  tightly restricted.
- **Authorization modes:** `Node`, `RBAC` (standard), `Webhook`, ABAC (legacy). Never
  `AlwaysAllow`.
- **Admission:** built-in controllers (`NodeRestriction`, `PodSecurity`), webhooks,
  `ValidatingAdmissionPolicy` (CEL, in-process).

### Component hardening

| Component | Key settings |
|-----------|--------------|
| kube-apiserver | `--anonymous-auth=false`, `--authorization-mode=Node,RBAC`, audit logging on, `--encryption-provider-config` set, `NodeRestriction` enabled |
| etcd | Client and peer TLS, reachable only from the API server, encryption at rest, backed-up and access-controlled data dir |
| kubelet | `--anonymous-auth=false`, `--authorization-mode=Webhook`, read-only port (10255) disabled, certificate rotation |
| controller-manager / scheduler | Bind to localhost, `--use-service-account-credentials=true`, profiling off |
| kube-proxy / CNI | Keep patched; the CNI must actually enforce NetworkPolicy |

## 3. RBAC

Four objects: **Role** and **ClusterRole** hold rules (apiGroups, resources, verbs);
**RoleBinding** and **ClusterRoleBinding** attach them to users, groups or ServiceAccounts. RBAC is
additive only — there are no deny rules.

```yaml
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata: { name: pod-reader, namespace: dev }
rules:
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "list", "watch"]
```

**Permissions that amount to privilege escalation:**

| Permission | Why it is dangerous |
|------------|---------------------|
| `*` on verbs or resources | Grants everything, including future resource types |
| `escalate`, `bind` on roles | Grant yourself permissions you do not hold |
| `impersonate` | Act as any user, group or ServiceAccount |
| `create` pods | Mount any Secret or ServiceAccount in the namespace |
| `get`/`list`/`watch` secrets | `list` returns Secret contents too |
| `create` on `serviceaccounts/token` | Mint tokens for more-privileged accounts |
| `nodes/proxy`, `pods/exec` | Run commands in other workloads |

Audit with:

```bash
kubectl auth can-i --list --as=system:serviceaccount:dev:ci -n dev
kubectl auth can-i create pods --as=jane -n dev
```

## 4. Pod Security Standards

| Level | Meaning |
|-------|---------|
| **Privileged** | Unrestricted. For trusted system workloads only. |
| **Baseline** | Blocks known privilege escalations: no `privileged`, no host namespaces, no `hostPath`, limited capabilities. |
| **Restricted** | Hardening best practice: adds `runAsNonRoot`, `allowPrivilegeEscalation: false`, drop `ALL` capabilities, seccomp `RuntimeDefault`. |

Enforced by **Pod Security Admission** through namespace labels (PodSecurityPolicy was removed in
v1.25):

```bash
kubectl label ns dev \
  pod-security.kubernetes.io/enforce=baseline \
  pod-security.kubernetes.io/warn=restricted \
  pod-security.kubernetes.io/audit=restricted
```

`enforce` rejects pods, `warn` shows a client warning, `audit` annotates the audit log.

A pod that passes **Restricted**:

```yaml
securityContext:              # pod level
  runAsNonRoot: true
  seccompProfile: { type: RuntimeDefault }
containers:
  - name: app
    image: registry.example.com/app@sha256:…
    securityContext:
      allowPrivilegeEscalation: false
      readOnlyRootFilesystem: true      # not required by Restricted, but recommended
      capabilities: { drop: ["ALL"] }
```

For rules PSA cannot express, use a policy engine: **Kyverno** (YAML policies) or
**OPA Gatekeeper** (Rego).

## 5. Network policies

- Pods are **non-isolated by default** — all traffic is allowed.
- A pod becomes isolated for ingress (or egress) once any policy selecting it lists that direction.
- Policies are additive allow-lists; there is no deny rule and no ordering.
- They only work if the CNI plugin enforces them (Calico, Cilium — not plain Flannel).

Default deny for a namespace, then allow what is needed:

```yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata: { name: default-deny, namespace: dev }
spec:
  podSelector: {}
  policyTypes: [Ingress, Egress]
---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata: { name: api-from-web, namespace: dev }
spec:
  podSelector: { matchLabels: { app: api } }
  policyTypes: [Ingress]
  ingress:
    - from:
        - podSelector: { matchLabels: { app: web } }
      ports: [{ protocol: TCP, port: 8080 }]
```

Remember to allow DNS egress (UDP/TCP 53) after a default-deny egress policy. Two selectors in one
`from` entry are ANDed; separate entries are ORed.

## 6. Container and workload security

- **Kernel primitives:** namespaces (isolation), cgroups (resource limits), capabilities (split-up
  root privileges), **seccomp** (syscall filtering), **AppArmor / SELinux** (mandatory access
  control).
- **Images:** minimal or distroless base, multi-stage builds, non-root `USER`, pin by digest, scan
  in CI (Trivy, Grype), generate an SBOM (SPDX, CycloneDX), sign and verify (Cosign).
- **Sandboxing:** gVisor (user-space kernel), Kata Containers (lightweight VMs), selected with
  `RuntimeClass`.
- **Secrets:** base64 only by default. Enable encryption at rest (prefer a KMS provider), restrict
  RBAC, prefer mounted files over environment variables, consider an external store.
- **ServiceAccounts:** one per workload, `automountServiceAccountToken: false` when the API is not
  needed.
- **Resource controls:** requests/limits, `LimitRange`, `ResourceQuota` to contain denial of service.

## 7. Auditing guide

### API audit logging

Enable on the API server with `--audit-policy-file` and `--audit-log-path` (or a webhook backend).

| Level | Records |
|-------|---------|
| `None` | Nothing |
| `Metadata` | Who, what, when — no bodies |
| `Request` | Metadata + request body |
| `RequestResponse` | Metadata + request and response bodies |

Stages: `RequestReceived`, `ResponseStarted`, `ResponseComplete`, `Panic`. Rules are evaluated top
to bottom; the first match wins.

```yaml
apiVersion: audit.k8s.io/v1
kind: Policy
omitStages: ["RequestReceived"]
rules:
  - level: Metadata              # never log Secret contents
    resources: [{ group: "", resources: ["secrets", "configmaps"] }]
  - level: RequestResponse
    verbs: ["create", "update", "patch", "delete"]
    resources: [{ group: "rbac.authorization.k8s.io" }]
  - level: Metadata
```

### Audit tooling

| Tool | Checks |
|------|--------|
| `kube-bench` | Node and control plane config against the CIS Kubernetes Benchmark |
| `kubescape` | Cluster and manifests against NSA-CISA, MITRE ATT&CK, CIS |
| `trivy` | Image vulnerabilities, IaC misconfigurations, cluster scanning, SBOMs |
| `kube-hunter` | Penetration-test style probing (no longer actively developed) |
| `falco` | Runtime detection from syscalls and audit events |
| `cosign` | Image signatures and attestations |

## 8. Threat modelling, operations and compliance

- **STRIDE:** Spoofing, Tampering, Repudiation, Information disclosure, Denial of service,
  Elevation of privilege. Map each to trust boundaries: internet → ingress, pod → API server,
  pod → node, API server → etcd.
- **MITRE ATT&CK for Containers / Kubernetes threat matrix:** initial access → execution →
  persistence → privilege escalation → defense evasion → credential access → discovery → lateral
  movement → impact.
- **Typical attack paths:** exposed dashboard or kubelet; stolen ServiceAccount token; privileged
  pod or `hostPath` mount to escape to the node; reading Secrets from etcd; crypto-mining for impact.
- **Supply chain:** SLSA (build provenance levels), SBOM, in-toto attestations, admission-time
  signature verification.
- **Compliance frameworks:**

  | Framework | Scope |
  |-----------|-------|
  | CIS Benchmarks | Prescriptive configuration checks |
  | NIST SP 800-190 | Container security guidance |
  | NIST CSF | Identify, Protect, Detect, Respond, Recover (+ Govern in 2.0) |
  | NSA/CISA Kubernetes Hardening Guide | Kubernetes-specific hardening |
  | PCI DSS, SOC 2, HIPAA, GDPR | Industry and regulatory requirements |

- **Incident response:** isolate the workload (NetworkPolicy, cordon the node), preserve evidence
  before deleting pods, rotate exposed credentials, review audit logs, fix the root cause.

## Four-week plan

| Week | Focus |
|------|-------|
| 1 | 4Cs, shared responsibility, principles; API request flow |
| 2 | Authentication, RBAC, admission, etcd and kubelet hardening, NetworkPolicy, PKI |
| 3 | Audit logging; container isolation, images, sandboxing; Pod Security Standards and `securityContext` |
| 4 | Secrets, ServiceAccounts, policy engines; threat modelling, supply chain, compliance; practice questions |

## Study resources

- Official curriculum: <https://github.com/cncf/curriculum>
- Exam page: <https://training.linuxfoundation.org/certification/kubernetes-and-cloud-native-security-associate-kcsa/>
- Kubernetes security docs: <https://kubernetes.io/docs/concepts/security/>
- Pod Security Standards: <https://kubernetes.io/docs/concepts/security/pod-security-standards/>
- RBAC good practices: <https://kubernetes.io/docs/concepts/security/rbac-good-practices/>
- CIS Kubernetes Benchmark: <https://www.cisecurity.org/benchmark/kubernetes>
- NSA/CISA Kubernetes Hardening Guide
- CNCF TAG Security — Cloud Native Security Whitepaper: <https://github.com/cncf/tag-security>
