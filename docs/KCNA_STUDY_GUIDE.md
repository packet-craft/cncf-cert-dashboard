# KCNA Study Guide

**Kubernetes and Cloud Native Associate** — 60 multiple-choice questions, 90 minutes, online
proctored, pass mark 75%. It is a knowledge exam: there is no terminal, but you are expected to
recognise `kubectl` commands and what resources do.

> Domains and weights follow the current official outline (revised November 2025). Confirm at
> <https://github.com/cncf/curriculum> before the exam.

## Topic breakdown

| Domain | Weight | Official topics | Suggested weeks |
|--------|-------:|-----------------|-----------------|
| Kubernetes Fundamentals | 44% | Core concepts, administration, scheduling, containerization | 1–2 |
| Container Orchestration | 28% | Networking, security, troubleshooting, storage | 3 |
| Cloud Native Application Delivery | 16% | Application delivery, debugging | 4 |
| Cloud Native Architecture | 12% | Observability, ecosystem and principles, community and collaboration | 3–4 |

Nearly half the exam is Kubernetes Fundamentals. Do not move on until you can explain every
component in the next section from memory.

## 1. Kubernetes Fundamentals (44%)

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

### Containerization

- **Containers** are processes isolated with Linux **namespaces** (what a process can see) and
  limited with **cgroups** (what it can use). An image is a read-only template; a container is a
  running instance.
- **OCI** defines three specs: image, runtime (reference implementation: `runc`) and distribution.
- **Interfaces:** CRI (runtimes), CNI (networking), CSI (storage). They let Kubernetes swap
  implementations without code changes.

### Administration

- **Access:** RBAC — Role/ClusterRole grant permissions; RoleBinding/ClusterRoleBinding attach them
  to users, groups or ServiceAccounts.
- **Configuration:** ConfigMaps and Secrets, consumed as environment variables or mounted files.
- **Capacity:** `ResourceQuota` caps a namespace; `LimitRange` sets per-pod defaults and bounds.
- **Node maintenance:** `kubectl cordon` stops new pods landing on a node; `kubectl drain` evicts
  the ones already there; `uncordon` reverses it.
- **Upgrades:** control plane first, then nodes, one minor version at a time.

## 2. Container Orchestration (28%)

- **Networking model:** every pod gets its own IP; pods reach each other without NAT; Services give
  a stable virtual IP and DNS name (CoreDNS); Ingress / Gateway API route HTTP from outside;
  NetworkPolicy restricts traffic (all-allow until a policy selects a pod).
- **Service mesh:** sidecar (or ambient) proxies form the data plane; the control plane configures
  them. Provides mTLS, retries, traffic splitting, telemetry. Examples: Istio, Linkerd.
- **Storage:** Volume → PersistentVolume (the storage) → PersistentVolumeClaim (the request) →
  StorageClass (dynamic provisioning).
- **Security:** the 4Cs (Cloud, Cluster, Container, Code), image scanning, least privilege.

### Troubleshooting

| Pod status | Usual cause | Where to look |
|------------|-------------|---------------|
| `Pending` | No node fits: resources, taints, unbound PVC | `kubectl describe pod` → Events |
| `ImagePullBackOff` | Wrong image name or tag, missing pull secret | Events |
| `CrashLoopBackOff` | The app starts and exits repeatedly | `kubectl logs --previous` |
| `OOMKilled` | Memory limit exceeded | `kubectl describe pod` → Last State |
| Running, not Ready | Readiness probe failing | Events, probe configuration |

The routine is always the same: `kubectl get` to see the state, `kubectl describe` for events,
`kubectl logs` for the application's own output.

## 3. Cloud Native Application Delivery (16%)

- **GitOps principles:** declarative, versioned and immutable, pulled automatically, continuously
  reconciled. Tools: Argo CD, Flux.
- **Push vs pull:** traditional CI pushes to the cluster; GitOps agents pull from Git.
- **CI/CD:** continuous integration (build and test every change), delivery (always releasable),
  deployment (released automatically).
- **Packaging:** Helm (templated charts, releases) vs Kustomize (template-free overlays, built into
  `kubectl -k`).
- **Rollout strategies:** rolling update, recreate, blue/green, canary.
- **Rollouts:** `kubectl rollout status | history | undo` to watch, inspect and roll back a
  Deployment.

### Debugging

- **Probes:** *liveness* restarts a hung container; *readiness* takes a pod out of Service
  endpoints while it cannot serve; *startup* delays the other two for slow-starting apps.
- **Logs:** `kubectl logs <pod> -c <container>`; add `--previous` for the last crashed instance.
- **Inside the pod:** `kubectl exec -it <pod> -- sh`, or `kubectl debug -it <pod> --image=busybox
  --target=<container>` to attach an ephemeral container when the image has no shell.
- **Events:** `kubectl get events --sort-by=.lastTimestamp`.

## 4. Cloud Native Architecture (12%)

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
- **Community and collaboration:** Kubernetes work is organised in SIGs (special interest groups)
  and working groups; substantial changes go through KEPs (Kubernetes Enhancement Proposals).

### Observability

- **Three pillars:** logs (discrete events), metrics (numbers over time), traces (a request's path
  through services).
- **Prometheus:** pulls (`scrapes`) `/metrics` endpoints; PromQL for queries; Alertmanager for
  routing alerts; Pushgateway for short-lived jobs. Metric types: counter, gauge, histogram, summary.
- **Tracing:** OpenTelemetry (APIs, SDKs, Collector) is the standard; Jaeger stores and visualises.
- **Logging:** containers write to stdout/stderr; a node-level agent (Fluentd, Fluent Bit) ships
  them. Sidecars are used when an app can only log to files.
- **SLI / SLO / SLA:** indicator (what you measure) / objective (your target) / agreement (the
  contract). Cost management: FinOps, OpenCost.

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
| 1 | Architecture, pods, workloads, `kubectl` basics, container fundamentals. Run a local cluster (kind or minikube). |
| 2 | OCI and the CRI/CNI/CSI interfaces, the Kubernetes API, administration (RBAC, config, quotas), scheduling. |
| 3 | Container orchestration: networking, security, storage, troubleshooting. Cloud native principles and autoscaling. |
| 4 | Application delivery and debugging; observability; community and governance; practice questions. |

## Study resources

- Official curriculum: <https://github.com/cncf/curriculum>
- Exam page: <https://training.linuxfoundation.org/certification/kubernetes-cloud-native-associate/>
- Kubernetes docs — Concepts: <https://kubernetes.io/docs/concepts/>
- Free course: *Introduction to Kubernetes* (LFS158) on edX
- CNCF landscape: <https://landscape.cncf.io>
- CNCF glossary: <https://glossary.cncf.io>
- OpenGitOps principles: <https://opengitops.dev>
