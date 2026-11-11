# KCNA Study Guide

**Kubernetes and Cloud Native Associate** — 60 multiple-choice questions, 90 minutes, online
proctored, pass mark 75%. It is a knowledge exam: there is no terminal, but you are expected to
recognise `kubectl` commands and what resources do.

> **The domains below follow the pre-November-2025 outline.** The current official outline
> (<https://github.com/cncf/curriculum>) has four domains: Kubernetes Fundamentals 44%, Container
> Orchestration 28% (now including troubleshooting), Cloud Native Application Delivery 16%
> (including debugging) and Cloud Native Architecture 12% (which now contains observability). The
> topics in this guide are still examined; their grouping and weights have changed.

## Topic breakdown

| Domain | Weight | Suggested weeks |
|--------|-------:|-----------------|
| Kubernetes Fundamentals | 46% | 1–2 |
| Container Orchestration | 22% | 2–3 |
| Cloud Native Architecture | 16% | 3 |
| Observability | 8% | 4 |
| Application Delivery | 8% | 4 |

Nearly half the exam is Kubernetes Fundamentals. Do not move on until you can explain every
component in the next section from memory.

## 1. Kubernetes Fundamentals (46%)

### Architecture

| Component | Runs on | Job |
|-----------|---------|-----|
| `kube-apiserver` | Control plane | Front door for all requests; the only component that talks to etcd |
| `etcd` | Control plane | Consistent key-value store holding all cluster state |
| `kube-scheduler` | Control plane | Assigns unscheduled pods to nodes (filter, then score) |
| `kube-controller-manager` | Control plane | Runs reconciliation loops (Deployment, ReplicaSet, Node, Job…) |
| `cloud-controller-manager` | Control plane | Cloud-specific loops: load balancers, node lifecycle, routes |
| `kubelet` | Every node | Makes sure the containers described in PodSpecs are running |
| `kube-proxy` | Every node | Programs iptables or nftables rules that implement Services |
| Container runtime | Every node | Runs containers (containerd, CRI-O) via the CRI |

**Reconciliation** is the core idea: you declare desired state, controllers continuously compare it
with actual state and act to close the gap.

### Workload resources

| Resource | Use it for |
|----------|-----------|
| Pod | Smallest unit; one or more containers sharing an IP and volumes |
| ReplicaSet | Keeps N identical pods running (normally managed by a Deployment) |
| Deployment | Stateless apps; rolling updates and rollbacks |
| StatefulSet | Stable names (`db-0`), ordered rollout, one PVC per replica |
| DaemonSet | One pod per node (log shippers, CNI agents) |
| Job / CronJob | Run to completion / on a schedule |

### Services

| Type | Reachable from | Notes |
|------|----------------|-------|
| ClusterIP | Inside the cluster | Default |
| NodePort | `<nodeIP>:30000-32767` | Builds on ClusterIP |
| LoadBalancer | External, via cloud LB | Builds on NodePort |
| ExternalName | — | DNS CNAME to an external host |
| Headless (`clusterIP: None`) | Inside the cluster | DNS returns pod IPs directly |

### Also know

- Namespaces, labels, selectors, annotations.
- ConfigMaps and Secrets (Secrets are base64-encoded, not encrypted, by default).
- Scheduling: requests vs limits, taints and tolerations, node affinity.
- RBAC: Role/ClusterRole grant permissions; RoleBinding/ClusterRoleBinding attach them to subjects.
- Commands: `kubectl get | describe | logs | exec | apply -f | explain`.

## 2. Container Orchestration (22%)

- **Containers** are processes isolated with Linux **namespaces** (what a process can see) and
  limited with **cgroups** (what it can use). An image is a read-only template; a container is a
  running instance.
- **OCI** defines three specs: image, runtime (reference implementation: `runc`) and distribution.
- **Interfaces:** CRI (runtimes), CNI (networking), CSI (storage). They let Kubernetes swap
  implementations without code changes.
- **Networking model:** every pod gets its own IP; pods reach each other without NAT; Services give
  a stable virtual IP and DNS name (CoreDNS); Ingress / Gateway API route HTTP from outside;
  NetworkPolicy restricts traffic (all-allow until a policy selects a pod).
- **Service mesh:** sidecar (or ambient) proxies form the data plane; the control plane configures
  them. Provides mTLS, retries, traffic splitting, telemetry. Examples: Istio, Linkerd.
- **Storage:** Volume → PersistentVolume (the storage) → PersistentVolumeClaim (the request) →
  StorageClass (dynamic provisioning).
- **Security:** the 4Cs (Cloud, Cluster, Container, Code), image scanning, least privilege.

## 3. Cloud Native Architecture (16%)

- **Cloud native** (CNCF definition): scalable applications in dynamic environments using
  containers, service meshes, microservices, immutable infrastructure and declarative APIs.
- **Autoscaling:**

  | Tool | Scales |
  |------|--------|
  | HorizontalPodAutoscaler | Number of pod replicas |
  | VerticalPodAutoscaler | CPU/memory requests of pods |
  | Cluster Autoscaler | Number of nodes |
  | KEDA | Replicas, driven by external events (queues, etc.), including to zero |

- **Serverless:** Knative (Serving and Eventing), CloudEvents as the event format standard.
- **CNCF governance:** projects move **Sandbox → Incubating → Graduated**; the Technical Oversight
  Committee (TOC) decides. Know TAGs (Technical Advisory Groups) and Kubernetes SIGs.
- **Personas:** SRE, DevOps engineer, platform engineer, security engineer, cloud architect, data
  engineer — know what each is responsible for.

## 4. Observability (8%)

- **Three pillars:** logs (discrete events), metrics (numbers over time), traces (a request's path
  through services).
- **Prometheus:** pulls (`scrapes`) `/metrics` endpoints; PromQL for queries; Alertmanager for
  routing alerts; Pushgateway for short-lived jobs. Metric types: counter, gauge, histogram, summary.
- **Tracing:** OpenTelemetry (APIs, SDKs, Collector) is the standard; Jaeger stores and visualises.
- **Logging:** containers write to stdout/stderr; a node-level agent (Fluentd, Fluent Bit) ships
  them. Sidecars are used when an app can only log to files.
- **SLI / SLO / SLA:** indicator (what you measure) / objective (your target) / agreement (the
  contract). Cost management: FinOps, OpenCost.

## 5. Application Delivery (8%)

- **GitOps principles:** declarative, versioned and immutable, pulled automatically, continuously
  reconciled. Tools: Argo CD, Flux.
- **Push vs pull:** traditional CI pushes to the cluster; GitOps agents pull from Git.
- **CI/CD:** continuous integration (build and test every change), delivery (always releasable),
  deployment (released automatically).
- **Packaging:** Helm (templated charts, releases) vs Kustomize (template-free overlays, built into
  `kubectl -k`).
- **Rollout strategies:** rolling update, recreate, blue/green, canary.

## CNCF ecosystem map

Know which category a project belongs to and roughly what it does.

| Category | Projects |
|----------|----------|
| Orchestration | Kubernetes |
| Container runtime | containerd, CRI-O |
| Networking (CNI) | Cilium, Calico, Flannel |
| Service mesh | Istio, Linkerd |
| Service proxy | Envoy |
| DNS / discovery | CoreDNS, etcd |
| Storage | Rook, Longhorn |
| Monitoring | Prometheus, Thanos, Cortex |
| Logging | Fluentd, Fluent Bit |
| Tracing / telemetry | Jaeger, OpenTelemetry |
| GitOps / CD | Argo, Flux |
| Packaging | Helm |
| Registry | Harbor |
| Policy | Open Policy Agent, Kyverno |
| Runtime security | Falco |
| Serverless / eventing | Knative, KEDA, CloudEvents |
| Supply chain | TUF, Notary, in-toto |

Project maturity changes over time — check <https://landscape.cncf.io>.

## Four-week plan

| Week | Focus |
|------|-------|
| 1 | Architecture, pods, workloads, `kubectl` basics. Run a local cluster (kind or minikube). |
| 2 | Services, config, scheduling, RBAC; container fundamentals and OCI/CRI/CNI/CSI. |
| 3 | Networking, storage, service mesh; cloud native architecture, autoscaling, CNCF governance. |
| 4 | Observability, application delivery, ecosystem map; practice questions and review weak domains. |

## Study resources

- Official curriculum: <https://github.com/cncf/curriculum>
- Exam page: <https://training.linuxfoundation.org/certification/kubernetes-cloud-native-associate/>
- Kubernetes docs — Concepts: <https://kubernetes.io/docs/concepts/>
- Free course: *Introduction to Kubernetes* (LFS158) on edX
- CNCF landscape: <https://landscape.cncf.io>
- CNCF glossary: <https://glossary.cncf.io>
- OpenGitOps principles: <https://opengitops.dev>
