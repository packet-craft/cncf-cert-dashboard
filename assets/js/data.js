/*
 * All dashboard content lives here. Edit this file to change domains, weights,
 * checklist items, cheat-sheet commands or flashcards — no other code changes needed.
 *
 * Checklist item tuple: [title, priority ("high" | "medium" | "low"), studyWeek]
 * Item ids are derived as `<cert>-<domain>-<index>`, so append new items at the
 * end of a domain to keep existing saved progress intact.
 */
const DATA = {
  certs: {
    kcna: {
      name: "KCNA",
      curriculumNote: "The domains here follow the pre-November-2025 outline. The current official outline is: Kubernetes Fundamentals 44%, Container Orchestration 28%, Cloud Native Application Delivery 16%, Cloud Native Architecture 12% (observability now sits inside Architecture).",
      title: "Kubernetes and Cloud Native Associate",
      format: "Multiple choice · 60 questions",
      duration: "90 minutes",
      passMark: 75,
      weeks: 4,
      domains: [
        {
          key: "kf", name: "Kubernetes Fundamentals", weight: 46,
          items: [
            ["Explain the control plane: kube-apiserver, etcd, scheduler, controller-manager", "high", 1],
            ["Explain node components: kubelet, kube-proxy, container runtime", "high", 1],
            ["Pods: lifecycle phases, init containers, sidecar pattern", "high", 1],
            ["Workload resources: Deployment, ReplicaSet, StatefulSet, DaemonSet, Job, CronJob", "high", 1],
            ["kubectl basics: get, describe, logs, apply, explain", "high", 1],
            ["Declarative vs imperative management and the reconciliation loop", "medium", 1],
            ["Namespaces, labels, selectors and annotations", "medium", 1],
            ["Service types: ClusterIP, NodePort, LoadBalancer, ExternalName, headless", "high", 2],
            ["ConfigMaps and Secrets: creation and consumption (env, volume)", "medium", 2],
            ["Scheduling basics: requests/limits, taints & tolerations, affinity", "medium", 2],
            ["RBAC basics: Role, ClusterRole, bindings, ServiceAccounts", "medium", 2],
            ["Kubernetes API: groups, versions, resources, CRDs", "low", 2]
          ]
        },
        {
          key: "co", name: "Container Orchestration", weight: 22,
          items: [
            ["Container fundamentals: Linux namespaces, cgroups, image vs container", "high", 2],
            ["OCI specs (image, runtime, distribution) and runtimes: containerd, CRI-O, runc", "medium", 2],
            ["Kubernetes interfaces: CRI, CNI, CSI", "high", 2],
            ["Build, tag and push a container image to a registry", "low", 2],
            ["Networking model: pod-to-pod, Services, Ingress, CoreDNS, NetworkPolicy", "high", 3],
            ["Service mesh concepts: data plane, control plane, sidecar proxies, mTLS", "medium", 3],
            ["Storage: volumes, PersistentVolume, PersistentVolumeClaim, StorageClass", "medium", 3],
            ["Container security basics: image scanning, least privilege, the 4Cs", "medium", 3]
          ]
        },
        {
          key: "ca", name: "Cloud Native Architecture", weight: 16,
          items: [
            ["Cloud native characteristics; microservices vs monoliths", "high", 3],
            ["Autoscaling: HPA, VPA, Cluster Autoscaler, KEDA", "high", 3],
            ["Serverless and FaaS: Knative, CloudEvents", "medium", 3],
            ["CNCF governance: Sandbox / Incubating / Graduated, TOC, TAGs and SIGs", "medium", 3],
            ["Open standards: OCI, CRI, CNI, CSI, OpenTelemetry", "medium", 3],
            ["Roles and personas: SRE, DevOps, platform, security, cloud architect", "low", 4]
          ]
        },
        {
          key: "ob", name: "Observability", weight: 8,
          items: [
            ["The three pillars: logs, metrics, traces", "high", 4],
            ["Prometheus: pull model, exporters, PromQL basics, Alertmanager", "high", 4],
            ["Distributed tracing: OpenTelemetry and Jaeger", "medium", 4],
            ["Logging architectures: node-level agent vs sidecar; Fluentd / Fluent Bit", "medium", 4],
            ["SLI / SLO / SLA and cost management (FinOps, OpenCost)", "low", 4]
          ]
        },
        {
          key: "ad", name: "Application Delivery", weight: 8,
          items: [
            ["GitOps principles, push vs pull; Argo CD and Flux", "high", 4],
            ["CI/CD concepts: pipelines, stages, artifacts", "medium", 4],
            ["Packaging and templating: Helm and Kustomize", "medium", 4],
            ["Deployment strategies: rolling, blue/green, canary", "medium", 4],
            ["Infrastructure as Code concepts", "low", 4]
          ]
        }
      ]
    },

    kcsa: {
      name: "KCSA",
      curriculumNote: "The domains here are a study grouping, not the official outline, which is: Overview of Cloud Native Security 14%, Kubernetes Cluster Component Security 22%, Kubernetes Security Fundamentals 22%, Kubernetes Threat Model 16%, Platform Security 16%, Compliance and Security Frameworks 10%.",
      title: "Kubernetes and Cloud Native Security Associate",
      format: "Multiple choice · 60 questions",
      duration: "90 minutes",
      passMark: 75,
      weeks: 4,
      domains: [
        {
          key: "ov", name: "Cloud Native Security Overview", weight: 14,
          items: [
            ["The 4Cs of cloud native security: Cloud, Cluster, Container, Code", "high", 1],
            ["Shared responsibility model and cloud provider security", "high", 1],
            ["Principles: defense in depth, least privilege, zero trust", "medium", 1],
            ["Isolation techniques: namespaces, network, node, sandboxed runtimes", "medium", 1],
            ["Artifact repository and image security overview", "medium", 1],
            ["Workload and application code security overview", "medium", 1]
          ]
        },
        {
          key: "cp", name: "Kubernetes Cluster Protection", weight: 22,
          items: [
            ["API request flow: authentication → authorization → admission control", "high", 1],
            ["Authentication methods: X.509 client certs, ServiceAccount tokens, OIDC", "high", 2],
            ["RBAC in depth, incl. risky verbs: escalate, bind, impersonate, wildcard", "high", 2],
            ["Admission control: mutating/validating webhooks, ValidatingAdmissionPolicy", "high", 2],
            ["etcd security: TLS, encryption at rest, restricted access", "high", 2],
            ["NetworkPolicy: default deny, ingress and egress rules", "high", 2],
            ["kubelet hardening: anonymous-auth=false, Webhook authz, no read-only port", "medium", 2],
            ["Hardening scheduler, controller-manager and kube-proxy", "medium", 2],
            ["PKI and certificate management in a kubeadm cluster", "medium", 2],
            ["Audit logging: policy levels (None/Metadata/Request/RequestResponse) and stages", "medium", 3]
          ]
        },
        {
          key: "cs", name: "Container Security", weight: 20,
          items: [
            ["Linux isolation primitives: namespaces, cgroups, capabilities", "high", 3],
            ["Kernel security: seccomp, AppArmor, SELinux", "high", 3],
            ["Image hardening: minimal/distroless base, non-root user, multi-stage builds", "high", 3],
            ["Image scanning (Trivy, Grype) and SBOMs", "medium", 3],
            ["Image signing and verification: Sigstore Cosign, Notary", "medium", 3],
            ["Sandboxed runtimes: gVisor, Kata Containers, RuntimeClass", "medium", 3],
            ["Registry security: private registries, imagePullSecrets, digest pinning", "low", 3]
          ]
        },
        {
          key: "ws", name: "Workload Security", weight: 18,
          items: [
            ["Pod Security Standards: Privileged, Baseline, Restricted", "high", 3],
            ["Pod Security Admission: enforce / audit / warn namespace labels", "high", 3],
            ["securityContext: runAsNonRoot, readOnlyRootFilesystem, allowPrivilegeEscalation, drop capabilities", "high", 3],
            ["Secrets management: encryption at rest, external stores, volume vs env", "medium", 4],
            ["ServiceAccount hardening: automountServiceAccountToken, bound tokens", "medium", 4],
            ["ResourceQuota and LimitRange as denial-of-service controls", "medium", 4],
            ["Policy engines: OPA Gatekeeper, Kyverno", "medium", 4],
            ["Multi-tenancy and namespace isolation", "low", 4]
          ]
        },
        {
          key: "so", name: "Security Operations & Compliance", weight: 26,
          items: [
            ["Threat modelling with STRIDE; trust boundaries and data flows", "high", 4],
            ["MITRE ATT&CK for Containers and the Kubernetes threat matrix", "high", 4],
            ["Attack scenarios: persistence, privilege escalation, lateral movement, DoS", "high", 4],
            ["CIS Kubernetes Benchmark and kube-bench", "high", 4],
            ["Compliance frameworks: NIST SP 800-190, NIST CSF, PCI DSS, SOC 2, GDPR", "medium", 4],
            ["Supply chain security: SLSA levels, SBOM, in-toto attestations", "medium", 4],
            ["Runtime threat detection with Falco", "medium", 4],
            ["Security observability: audit logs, alerting, SIEM integration", "medium", 4],
            ["Incident response: isolate, collect evidence, rotate credentials", "low", 4],
            ["Automation and tooling: kubescape, kube-hunter, Trivy Operator", "low", 4]
          ]
        }
      ]
    },

    cka: {
      name: "CKA",
      title: "Certified Kubernetes Administrator",
      format: "Performance-based · hands-on tasks",
      duration: "2 hours",
      passMark: 66,
      weeks: 8,
      domains: [
        {
          key: "arch", name: "Cluster Architecture, Installation & Configuration", weight: 25,
          items: [
            ["Prepare nodes: container runtime, kernel modules, sysctl, swap", "medium", 1],
            ["Bootstrap a cluster with kubeadm (init, join, install CNI)", "high", 1],
            ["Manage kubeconfig files and contexts", "medium", 1],
            ["Upgrade a cluster with kubeadm (control plane, then workers)", "high", 2],
            ["Back up and restore etcd", "high", 2],
            ["Manage RBAC: Roles, ClusterRoles, bindings, ServiceAccounts", "high", 2],
            ["Highly-available control plane: stacked vs external etcd", "medium", 2],
            ["Install cluster components with Helm and Kustomize", "high", 3],
            ["Extension interfaces: CNI, CSI, CRI", "medium", 3],
            ["CRDs and operators: install and inspect", "medium", 3]
          ]
        },
        {
          key: "ws", name: "Workloads & Scheduling", weight: 15,
          items: [
            ["Deployments: rolling updates and rollbacks", "high", 3],
            ["Configure apps with ConfigMaps and Secrets", "high", 3],
            ["Workload autoscaling with HorizontalPodAutoscaler", "medium", 4],
            ["Self-healing primitives: probes, ReplicaSets, DaemonSets", "medium", 4],
            ["Scheduling: nodeSelector, affinity, taints & tolerations, PriorityClass", "high", 4],
            ["Static pods and manual scheduling (nodeName)", "medium", 4],
            ["Resource requests/limits, LimitRange, ResourceQuota", "medium", 4]
          ]
        },
        {
          key: "st", name: "Storage", weight: 10,
          items: [
            ["StorageClasses and dynamic provisioning", "high", 5],
            ["Volume types, access modes and reclaim policies", "high", 5],
            ["Create PVs and PVCs, bind them and mount in pods", "high", 5],
            ["Troubleshoot Pending PVCs and failed mounts", "medium", 5],
            ["emptyDir, hostPath and projected volumes", "low", 5]
          ]
        },
        {
          key: "sn", name: "Services & Networking", weight: 20,
          items: [
            ["Pod-to-pod connectivity and the cluster network model", "high", 5],
            ["Service types and endpoints: ClusterIP, NodePort, LoadBalancer", "high", 5],
            ["Define and enforce NetworkPolicies", "high", 6],
            ["Gateway API: GatewayClass, Gateway, HTTPRoute", "high", 6],
            ["Ingress controllers and Ingress resources", "high", 6],
            ["CoreDNS: configuration and DNS debugging", "medium", 6],
            ["Choose and install a CNI plugin", "low", 6]
          ]
        },
        {
          key: "tr", name: "Troubleshooting", weight: 30,
          items: [
            ["Troubleshoot nodes: NotReady, kubelet, container runtime", "high", 7],
            ["Troubleshoot control plane components via static pod manifests", "high", 7],
            ["Pod failure states: CrashLoopBackOff, ImagePullBackOff, Pending, OOMKilled", "high", 7],
            ["Container logs and output streams: kubectl logs, --previous, -c", "high", 7],
            ["Use crictl and journalctl when the API server is down", "high", 7],
            ["Monitor resource usage: metrics-server and kubectl top", "medium", 7],
            ["Troubleshoot Services: selectors, endpoints, DNS, kube-proxy", "high", 8],
            ["Troubleshoot scheduling: taints, resources, affinity", "medium", 8],
            ["Certificate problems: kubeadm certs check-expiration / renew", "medium", 8],
            ["Complete two timed mock exams (e.g. killer.sh)", "high", 8]
          ]
        }
      ]
    }
  },

  /* Cheat sheet: sections of [command, description]. `certs` drives the tag chips. */
  cheats: [
    {
      title: "Exam shell setup", tool: "kubectl", certs: ["cka"],
      cmds: [
        ["alias k=kubectl", "Usually pre-set in the exam shell"],
        ["export do='--dry-run=client -o yaml'", "Generate manifests: k run web --image=nginx $do > pod.yaml"],
        ["export now='--force --grace-period=0'", "Delete pods immediately: k delete pod web $now (skips graceful shutdown — practice clusters only)"],
        ["kubectl config get-contexts", "List contexts"],
        ["ssh <host>", "Current exam: each task names a host to ssh to first; run exit when the task is done"],
        ["kubectl config use-context <name>", "Switch context when a task or practice environment asks for it"],
        ["kubectl config set-context --current --namespace=<ns>", "Set the default namespace"]
      ]
    },
    {
      title: "Imperative create", tool: "kubectl", certs: ["cka", "kcna"],
      cmds: [
        ["kubectl run web --image=nginx --port=80 --labels=app=web", "Create a pod"],
        ["kubectl run tmp --rm -it --image=busybox:1.36 --restart=Never -- sh", "Throwaway debug pod"],
        ["kubectl create deployment web --image=nginx --replicas=3", "Create a deployment"],
        ["kubectl expose deployment web --port=80 --target-port=8080 --type=NodePort", "Expose as a Service"],
        ["kubectl create configmap app-cfg --from-literal=MODE=prod --from-file=app.conf", "Create a ConfigMap"],
        ["kubectl create secret generic db --from-literal=password=s3cr3t", "Create a Secret"],
        ["kubectl create job hello --image=busybox -- echo hi", "Create a Job"],
        ["kubectl create cronjob tick --image=busybox --schedule='*/5 * * * *' -- date", "Create a CronJob"],
        ["kubectl create ingress web --rule='app.example.com/*=web:80' --class=nginx", "Create an Ingress"],
        ["kubectl autoscale deployment web --min=2 --max=5 --cpu=70%", "Create an HPA (older kubectl: --cpu-percent=70)"]
      ]
    },
    {
      title: "Inspect & debug", tool: "kubectl", certs: ["cka", "kcna"],
      cmds: [
        ["kubectl get pods -A -o wide", "All pods with node and IP"],
        ["kubectl get events -A --sort-by=.lastTimestamp", "Recent events, oldest first"],
        ["kubectl describe pod <pod>", "Events, conditions, container state"],
        ["kubectl logs <pod> -c <container> --previous", "Logs from the last crashed container"],
        ["kubectl exec -it <pod> -- sh", "Shell into a container"],
        ["kubectl debug node/<node> -it --image=busybox", "Debug pod on the node's host namespaces"],
        ["kubectl top pods -A --sort-by=memory", "Resource usage (needs metrics-server)"],
        ["kubectl get pods -o jsonpath='{.items[*].spec.containers[*].image}'", "Extract fields with JSONPath"],
        ["kubectl get pods --sort-by=.metadata.creationTimestamp", "Sort output"],
        ["kubectl explain pod.spec.containers.securityContext --recursive", "Field documentation offline"]
      ]
    },
    {
      title: "Rollouts & scaling", tool: "kubectl", certs: ["cka"],
      cmds: [
        ["kubectl set image deployment/web nginx=nginx:1.27", "Trigger a rolling update"],
        ["kubectl rollout status deployment/web", "Watch the rollout"],
        ["kubectl rollout history deployment/web", "List revisions"],
        ["kubectl rollout undo deployment/web --to-revision=2", "Roll back"],
        ["kubectl rollout restart deployment/web", "Restart all pods"],
        ["kubectl scale deployment web --replicas=5", "Scale manually"]
      ]
    },
    {
      title: "Scheduling & node maintenance", tool: "kubectl", certs: ["cka"],
      cmds: [
        ["kubectl cordon <node>", "Mark unschedulable"],
        ["kubectl drain <node> --ignore-daemonsets --delete-emptydir-data", "Evict pods before maintenance"],
        ["kubectl uncordon <node>", "Allow scheduling again"],
        ["kubectl taint nodes <node> dedicated=gpu:NoSchedule", "Add a taint"],
        ["kubectl taint nodes <node> dedicated=gpu:NoSchedule-", "Remove a taint (trailing dash)"],
        ["kubectl label nodes <node> disktype=ssd", "Label a node for nodeSelector / affinity"]
      ]
    },
    {
      title: "kubeadm: install, upgrade, certs", tool: "kubeadm", certs: ["cka"],
      cmds: [
        ["kubeadm init --pod-network-cidr=10.244.0.0/16", "Bootstrap the control plane"],
        ["kubeadm token create --print-join-command", "Generate a worker join command"],
        ["kubeadm upgrade plan", "Show available upgrade targets"],
        ["kubeadm upgrade apply v1.xx.y", "Upgrade the first control plane node"],
        ["kubeadm upgrade node", "Upgrade other control plane and worker nodes"],
        ["systemctl daemon-reload && systemctl restart kubelet", "After upgrading the kubelet package"],
        ["kubeadm certs check-expiration", "Certificate expiry dates"],
        ["kubeadm certs renew all", "Renew control plane certificates"]
      ]
    },
    {
      title: "Helm, Kustomize & CRDs", tool: "helm", certs: ["cka"],
      cmds: [
        ["helm repo add <name> <url> && helm repo update", "Add a chart repository"],
        ["helm install <release> <repo>/<chart> -n <ns> --create-namespace --set key=value", "Install a chart"],
        ["helm upgrade --install <release> <repo>/<chart> -n <ns> -f values.yaml", "Upgrade, or install if missing"],
        ["helm list -A", "Releases in every namespace"],
        ["helm show values <repo>/<chart>", "Configurable values of a chart"],
        ["helm template <release> <repo>/<chart> -f values.yaml", "Render manifests without installing"],
        ["helm rollback <release> <revision> -n <ns>", "Roll a release back"],
        ["kubectl kustomize <dir>", "Render a kustomization"],
        ["kubectl apply -k <dir>", "Apply a kustomization"],
        ["kubectl get crd", "Installed CustomResourceDefinitions"],
        ["kubectl api-resources --api-group=<group>", "Kinds a CRD or operator added"]
      ]
    },
    {
      title: "etcd backup & restore", tool: "etcdctl", certs: ["cka", "kcsa"],
      cmds: [
        ["ETCDCTL_API=3 etcdctl --endpoints=https://127.0.0.1:2379 --cacert=/etc/kubernetes/pki/etcd/ca.crt --cert=/etc/kubernetes/pki/etcd/server.crt --key=/etc/kubernetes/pki/etcd/server.key snapshot save /opt/etcd-backup.db", "Take a snapshot (cert paths are in /etc/kubernetes/manifests/etcd.yaml)"],
        ["etcdutl snapshot status /opt/etcd-backup.db -w table", "Verify the snapshot"],
        ["etcdutl snapshot restore /opt/etcd-backup.db --data-dir=/var/lib/etcd-restore", "Restore to a new data dir (older etcd: etcdctl snapshot restore)"],
        ["vi /etc/kubernetes/manifests/etcd.yaml", "Point the etcd-data hostPath at the restored dir; kubelet restarts etcd"],
        ["etcdctl <tls flags> endpoint health", "Check etcd health"],
        ["etcdctl <tls flags> member list -w table", "List cluster members"]
      ]
    },
    {
      title: "crictl & node-level debugging", tool: "crictl", certs: ["cka", "kcsa"],
      cmds: [
        ["crictl ps -a", "All containers, including exited ones"],
        ["crictl pods", "Pod sandboxes on this node"],
        ["crictl logs <container-id>", "Container logs without the API server"],
        ["crictl inspect <container-id>", "Runtime config: mounts, seccomp, capabilities"],
        ["crictl images", "Images present on the node"],
        ["systemctl status kubelet", "Is the kubelet running?"],
        ["journalctl -u kubelet -f --no-pager", "Follow kubelet logs"],
        ["ls /etc/kubernetes/manifests/", "Static pod manifests for control plane components"],
        ["cat /var/lib/kubelet/config.yaml", "Kubelet configuration"]
      ]
    },
    {
      title: "Networking checks", tool: "kubectl", certs: ["cka"],
      cmds: [
        ["kubectl get svc,endpointslices -o wide", "Does the Service have backing endpoints?"],
        ["kubectl run dns --rm -it --image=busybox:1.36 --restart=Never -- nslookup kubernetes.default", "Test cluster DNS"],
        ["kubectl run curl --rm -it --image=curlimages/curl --restart=Never -- curl -m 3 http://web.default.svc.cluster.local", "Test Service reachability"],
        ["kubectl -n kube-system get cm coredns -o yaml", "CoreDNS Corefile"],
        ["kubectl get networkpolicy -A", "List NetworkPolicies"],
        ["kubectl get gatewayclass,gateway,httproute -A", "Gateway API resources"]
      ]
    },
    {
      title: "RBAC & access review", tool: "security", certs: ["cka", "kcsa"],
      cmds: [
        ["kubectl create role pod-reader --verb=get,list,watch --resource=pods -n dev", "Namespaced Role"],
        ["kubectl create rolebinding read-pods --role=pod-reader --user=jane -n dev", "Bind a Role to a user"],
        ["kubectl create clusterrolebinding view-all --clusterrole=view --serviceaccount=dev:ci", "Bind a ClusterRole to a ServiceAccount"],
        ["kubectl auth can-i delete pods --as=jane -n dev", "Check a permission by impersonation"],
        ["kubectl auth can-i --list --as=system:serviceaccount:dev:ci", "Everything a subject can do"],
        ["kubectl create token ci -n dev --duration=1h", "Short-lived bound ServiceAccount token"]
      ]
    },
    {
      title: "Pod security & hardening", tool: "security", certs: ["kcsa"],
      cmds: [
        ["kubectl label ns dev pod-security.kubernetes.io/enforce=restricted", "Enforce the Restricted Pod Security Standard"],
        ["kubectl label --dry-run=server --overwrite ns dev pod-security.kubernetes.io/enforce=restricted", "Preview which existing pods would violate, without changing anything"],
        ["kubectl get pods -A -o json | jq -r '.items[] | select([.spec.containers[]?, .spec.initContainers[]?] | any(.securityContext.privileged == true)) | \"\\(.metadata.namespace)/\\(.metadata.name)\"'", "Find privileged pods, including init containers"],
        ["kubectl get secrets -A --field-selector type=kubernetes.io/service-account-token", "Find legacy long-lived SA tokens"],
        ["etcdctl <tls flags> get /registry/secrets/default/db | hexdump -C | head", "Confirm a Secret is encrypted at rest (value starts with k8s:enc:)"],
        ["grep encryption-provider-config /etc/kubernetes/manifests/kube-apiserver.yaml", "Is an EncryptionConfiguration wired into the API server?"]
      ]
    },
    {
      title: "Security scanning & auditing tools", tool: "security", certs: ["kcsa"],
      cmds: [
        ["trivy image --severity HIGH,CRITICAL nginx:1.27", "Scan an image for vulnerabilities"],
        ["trivy k8s --report summary", "Scan the cluster for vulns and misconfigurations"],
        ["trivy image --format cyclonedx -o sbom.json nginx:1.27", "Generate an SBOM"],
        ["kube-bench run --targets master,node", "Check against the CIS Kubernetes Benchmark"],
        ["kubescape scan framework nsa", "Scan against NSA / MITRE / CIS frameworks"],
        ["cosign verify --key cosign.pub registry.example.com/app:1.0", "Verify an image signature"],
        ["falco -r /etc/falco/falco_rules.yaml", "Runtime threat detection from syscalls"],
        ["grep -E 'audit-(policy-file|log-path)' /etc/kubernetes/manifests/kube-apiserver.yaml", "Is API audit logging configured?"]
      ]
    }
  ],

  /* Free study resources per cert: groups of [title, url, description]. */
  resources: {
    kcna: [
      { group: "Open-source repositories & guides", items: [
        ["msahihi/KCNA-study-guide", "https://github.com/msahihi/KCNA-study-guide", "Theory notes mapped to the exam domains, YAML labs, a quick-reference cheatsheet and practice questions."],
        ["Wriju's KCNA Exam Prep Guide", "https://wrijugh.github.io/kcna/", "Topic-by-topic map from each exam domain to the relevant CNCF, Kubernetes and OpenTelemetry docs."],
        ["CNCF Cloud Native Glossary", "https://glossary.cncf.io/", "Community-maintained definitions of cloud native terms — useful for exam terminology."]
      ] },
      { group: "Free courses & video", items: [
        ["freeCodeCamp KCNA full course (YouTube)", "https://www.youtube.com/watch?v=AplluksKvzI", "14-hour video course: containers, Kubernetes architecture, observability, delivery and the CNCF landscape."],
        ["Linux Foundation — Introduction to Kubernetes (LFS158x)", "https://www.edx.org/learn/kubernetes/the-linux-foundation-introduction-to-kubernetes", "Official course on edX, free on the audit track."]
      ] },
      { group: "Interactive references", items: [
        ["CNCF Interactive Landscape", "https://landscape.cncf.io/", "Browse projects by category and maturity level (Graduated, Incubating, Sandbox)."]
      ] }
    ],
    kcsa: [
      { group: "Open-source repositories & security notes", items: [
        ["aysabzevar/kcsa", "https://github.com/aysabzevar/kcsa", "Curated sources on compliance frameworks (CIS, NIST, NSA/CISA), Pod Security Standards and container security. Last updated in 2024."],
        ["InfraSec KCSA Study Guide", "https://infrasec.sh/post/cncf-kcsa/", "Domain-by-domain notes with the OWASP Kubernetes Top 10, STRIDE and ATT&CK threat modelling, and scanner tools."]
      ] },
      { group: "Standards & threat frameworks", items: [
        ["NSA/CISA Kubernetes Hardening Guidance", "https://www.nsa.gov/Press-Room/News-Highlights/Article/Article/2719161/nsa-cisa-release-kubernetes-hardening-guidance/", "Official hardening report that the security curriculum draws on heavily."],
        ["OWASP Kubernetes Security Testing Guide", "https://owasp.org/www-project-kubernetes-security-testing-guide/", "Threat models, common misconfigurations and cluster attack paths."]
      ] },
      { group: "Official Kubernetes docs", items: [
        ["Kubernetes security concepts", "https://kubernetes.io/docs/concepts/security/", "The primary source for most exam topics: API access control, secrets, multi-tenancy, hardening."],
        ["Pod Security Standards", "https://kubernetes.io/docs/concepts/security/pod-security-standards/", "Exact definitions of the Privileged, Baseline and Restricted profiles."]
      ] }
    ],
    cka: [
      { group: "Official docs (allowed in the exam)", items: [
        ["Kubernetes documentation", "https://kubernetes.io/docs/", "Practise searching and navigating it quickly."],
        ["kubectl quick reference", "https://kubernetes.io/docs/reference/kubectl/quick-reference/", "Imperative command syntax worth knowing by heart."],
        ["Helm documentation", "https://helm.sh/docs/", "Also allowed during the exam."],
        ["Gateway API documentation", "https://gateway-api.sigs.k8s.io/", "Allowed during the CKA exam; source for Gateway and HTTPRoute examples."],
        ["Linux Foundation — CKA exam instructions", "https://docs.linuxfoundation.org/tc-docs/certification/tips-cka-and-ckad", "How the exam environment works: ssh to a host per task, pre-installed tools."]
      ] },
      { group: "Practice environments", items: [
        ["Killercoda", "https://killercoda.com/", "Free browser-based Kubernetes playgrounds and CKA scenarios."],
        ["Play with Kubernetes", "https://labs.play-with-k8s.com/", "Browser-based multi-node lab for practising kubeadm init / join and node maintenance."],
        ["killer.sh CKA Simulator", "https://killer.sh/", "Exam simulator; two sessions are included when you register for the CKA exam."]
      ] },
      { group: "Community repositories", items: [
        ["alijahnas/CKA-practice-exercises", "https://github.com/alijahnas/CKA-practice-exercises", "Practice exercises by exam domain. Last updated in early 2024, so it lacks Gateway API, Helm and Kustomize."],
        ["walidshaari/Kubernetes-Certified-Administrator", "https://github.com/walidshaari/Kubernetes-Certified-Administrator", "Community list of resources per curriculum topic. Written for an older curriculum, so check dates."],
        ["codewithmuh/cka-course", "https://github.com/codewithmuh/cka-course", "Course with 7 modules, 44 lessons, a local kind lab and 3 mock exams. Very new and little reviewed; kind hides the kubeadm parts of the exam."]
      ] }
    ]
  },

  /* Flashcards: { cert, type: "concept" | "definition" | "command", q, a } */
  flashcards: [
    // KCNA
    { cert: "kcna", type: "concept", q: "Which component is the only one that talks to etcd directly?", a: "kube-apiserver. Every other component reads and writes cluster state through the API server." },
    { cert: "kcna", type: "concept", q: "What does the kube-scheduler do?", a: "Watches for pods with no node assigned and picks a node for each, by filtering feasible nodes and then scoring them." },
    { cert: "kcna", type: "definition", q: "What is a Pod?", a: "The smallest deployable unit in Kubernetes: one or more containers sharing a network namespace (one IP) and optionally volumes." },
    { cert: "kcna", type: "concept", q: "Deployment vs StatefulSet?", a: "Deployment: interchangeable replicas, random names. StatefulSet: stable identity (web-0, web-1), ordered rollout, and a PVC per replica." },
    { cert: "kcna", type: "definition", q: "What are CRI, CNI and CSI?", a: "Container Runtime Interface, Container Network Interface, Container Storage Interface — plugin contracts for runtimes, networking and storage." },
    { cert: "kcna", type: "concept", q: "What are the CNCF project maturity levels?", a: "Sandbox → Incubating → Graduated. The Technical Oversight Committee (TOC) votes on moving projects between levels." },
    { cert: "kcna", type: "definition", q: "What is GitOps?", a: "Git is the single source of truth for declarative desired state; an agent in the cluster (Argo CD, Flux) continuously pulls and reconciles." },
    { cert: "kcna", type: "concept", q: "HPA vs VPA vs Cluster Autoscaler?", a: "HPA changes replica count. VPA changes pod CPU/memory requests. Cluster Autoscaler adds or removes nodes." },
    { cert: "kcna", type: "concept", q: "What are the three pillars of observability?", a: "Logs, metrics and traces. Prometheus covers metrics, Jaeger traces, Fluentd logs; OpenTelemetry standardises collection for all three." },
    { cert: "kcna", type: "concept", q: "How does Prometheus collect metrics?", a: "It pulls (scrapes) HTTP /metrics endpoints on an interval. Short-lived jobs push to a Pushgateway, which Prometheus then scrapes." },
    { cert: "kcna", type: "definition", q: "What is a headless Service?", a: "A Service with clusterIP: None. DNS returns the pod IPs directly instead of a single virtual IP — used with StatefulSets." },
    { cert: "kcna", type: "command", q: "Show documentation for a resource field from the terminal.", a: "kubectl explain deployment.spec.strategy" },
    { cert: "kcna", type: "definition", q: "What does the OCI standardise?", a: "The Open Container Initiative defines the image spec, the runtime spec (implemented by runc) and the distribution spec (registries)." },
    { cert: "kcna", type: "concept", q: "What problem does a service mesh solve?", a: "It moves service-to-service concerns — mTLS, retries, traffic shifting, telemetry — out of app code into proxies managed by a control plane." },

    // KCSA
    { cert: "kcsa", type: "definition", q: "What are the 4Cs of cloud native security?", a: "Cloud, Cluster, Container, Code. Each layer builds on the security of the layer outside it." },
    { cert: "kcsa", type: "concept", q: "In what order does the API server process a request?", a: "Authentication → Authorization (e.g. RBAC) → Mutating admission → Schema validation → Validating admission → persisted to etcd." },
    { cert: "kcsa", type: "definition", q: "Name the three Pod Security Standards.", a: "Privileged (unrestricted), Baseline (blocks known privilege escalations), Restricted (current hardening best practice)." },
    { cert: "kcsa", type: "concept", q: "What are the Pod Security Admission modes?", a: "enforce (reject the pod), audit (allow, add an audit annotation), warn (allow, show the user a warning). Set with namespace labels." },
    { cert: "kcsa", type: "definition", q: "What does STRIDE stand for?", a: "Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege." },
    { cert: "kcsa", type: "concept", q: "Which RBAC verbs enable privilege escalation?", a: "escalate and bind (on roles), impersonate (on users/groups/SAs), plus wildcards (*) and create on pods or on serviceaccounts/token." },
    { cert: "kcsa", type: "concept", q: "Are Kubernetes Secrets encrypted by default?", a: "No — they are only base64-encoded in etcd. Enable encryption at rest with an EncryptionConfiguration, ideally backed by a KMS provider." },
    { cert: "kcsa", type: "concept", q: "What happens to pod traffic when no NetworkPolicy selects the pod?", a: "All ingress and egress is allowed. A pod becomes isolated for a direction only once a policy selects it for that direction." },
    { cert: "kcsa", type: "definition", q: "seccomp vs AppArmor?", a: "seccomp filters which syscalls a process may make. AppArmor (like SELinux) is mandatory access control restricting files, capabilities and network access." },
    { cert: "kcsa", type: "definition", q: "What is an SBOM?", a: "A Software Bill of Materials: a machine-readable inventory of the components in an artifact (SPDX or CycloneDX format)." },
    { cert: "kcsa", type: "definition", q: "What does SLSA define?", a: "Supply-chain Levels for Software Artifacts: graded requirements for build integrity and provenance so artifacts can be traced to source." },
    { cert: "kcsa", type: "command", q: "Check a cluster against the CIS Kubernetes Benchmark.", a: "kube-bench run --targets master,node" },
    { cert: "kcsa", type: "command", q: "Check whether a ServiceAccount can read secrets.", a: "kubectl auth can-i get secrets --as=system:serviceaccount:<ns>:<sa> -n <ns>" },
    { cert: "kcsa", type: "concept", q: "What does Falco do?", a: "Runtime threat detection: it watches syscalls (via eBPF) and Kubernetes audit events and alerts when rules match, e.g. a shell spawned in a container." },
    { cert: "kcsa", type: "concept", q: "Name three kubelet hardening settings.", a: "--anonymous-auth=false, --authorization-mode=Webhook, and the read-only port (10255) disabled." },

    // CKA
    { cert: "cka", type: "command", q: "Generate a Deployment manifest without creating it.", a: "kubectl create deployment web --image=nginx --replicas=3 --dry-run=client -o yaml > web.yaml" },
    { cert: "cka", type: "command", q: "Take an etcd snapshot.", a: "ETCDCTL_API=3 etcdctl --endpoints=https://127.0.0.1:2379 --cacert=<ca.crt> --cert=<server.crt> --key=<server.key> snapshot save /opt/backup.db" },
    { cert: "cka", type: "concept", q: "Where do the control plane static pod manifests live?", a: "/etc/kubernetes/manifests/ on the control plane node. The kubelet watches the directory and recreates pods when a file changes." },
    { cert: "cka", type: "concept", q: "In what order do you upgrade a kubeadm control plane node?", a: "Upgrade kubeadm → kubeadm upgrade plan → kubeadm upgrade apply → drain → upgrade kubelet & kubectl → restart kubelet → uncordon." },
    { cert: "cka", type: "concept", q: "A node is NotReady. First three checks?", a: "systemctl status kubelet; journalctl -u kubelet; then the runtime (systemctl status containerd, crictl ps). Also kubectl describe node." },
    { cert: "cka", type: "concept", q: "A Service has no endpoints. Likely cause?", a: "Its selector doesn't match the pod labels, or the pods aren't Ready. Compare kubectl get svc -o wide with kubectl get pods --show-labels." },
    { cert: "cka", type: "command", q: "Safely empty a node for maintenance.", a: "kubectl drain <node> --ignore-daemonsets --delete-emptydir-data   (afterwards: kubectl uncordon <node>)" },
    { cert: "cka", type: "command", q: "Roll back a Deployment to the previous revision.", a: "kubectl rollout undo deployment/<name>" },
    { cert: "cka", type: "concept", q: "PVC is stuck Pending. What do you check?", a: "kubectl describe pvc: missing or wrong StorageClass, no PV matching size/access mode, or volumeBindingMode WaitForFirstConsumer with no pod yet." },
    { cert: "cka", type: "definition", q: "The three taint effects?", a: "NoSchedule (no new pods), PreferNoSchedule (soft), NoExecute (also evicts running pods without a toleration)." },
    { cert: "cka", type: "definition", q: "PersistentVolume reclaim policies?", a: "Retain (keep data, manual cleanup) and Delete (remove backing storage). Recycle is deprecated." },
    { cert: "cka", type: "command", q: "Print a fresh worker join command.", a: "kubeadm token create --print-join-command" },
    { cert: "cka", type: "concept", q: "Which Gateway API resources route HTTP traffic?", a: "GatewayClass (which controller), Gateway (listeners: ports, hostnames, TLS), HTTPRoute (rules attaching to a Gateway via parentRefs → backend Services)." },
    { cert: "cka", type: "command", q: "See why a container crashed last time.", a: "kubectl logs <pod> -c <container> --previous   and   kubectl describe pod <pod>  (Last State, Exit Code)" },
    { cert: "cka", type: "command", q: "List containers on a node when kubectl doesn't work.", a: "crictl ps -a   then   crictl logs <container-id>" },
    { cert: "cka", type: "command", q: "Test DNS resolution from inside the cluster.", a: "kubectl run dns --rm -it --image=busybox:1.36 --restart=Never -- nslookup kubernetes.default" },
    { cert: "cka", type: "command", q: "Install a Helm chart into its own namespace.", a: "helm repo add <name> <url> && helm install <release> <name>/<chart> -n <ns> --create-namespace" },
    { cert: "cka", type: "command", q: "Apply a Kustomize directory.", a: "kubectl apply -k <dir>   (preview with: kubectl kustomize <dir>)" },
    { cert: "cka", type: "concept", q: "A default-deny NetworkPolicy is applied and pods can't resolve names. Why?", a: "Egress is denied too, including DNS. Add an egress rule allowing UDP and TCP port 53 to the cluster DNS pods." },
    { cert: "cka", type: "concept", q: "An HPA shows <unknown> for its CPU target. Likely causes?", a: "metrics-server isn't installed or healthy, or the pods have no CPU requests — utilisation is measured against the request." },
    { cert: "cka", type: "command", q: "Let ServiceAccount ci in namespace dev list pods there.", a: "kubectl create role pod-reader --verb=get,list,watch --resource=pods -n dev && kubectl create rolebinding ci-pods --role=pod-reader --serviceaccount=dev:ci -n dev" },
    { cert: "cka", type: "concept", q: "How does the current CKA exam give you access to each cluster?", a: "Each task names a host. ssh to it, do the work (sudo -i if needed), then exit back to the base host before the next task." }
  ]
};

if (typeof module !== "undefined") module.exports = DATA;
