/*
 * Dashboard content lives here. Edit this file to change domains, weights,
 * checklist items, cheat-sheet commands or flashcards — no other code changes needed.
 * The long-form study guide lives in assets/js/docs/.
 *
 * Flashcards carry `d`, the key of the exam domain they belong to; the Flashcards tab filters on it.
 * A card with `o` (four options, the FIRST being correct) is shown as a multiple-choice question,
 * with `a` as the explanation; the app shuffles the options. A card without `o` shows `a` on request.
 *
 * Checklist item tuple: [title, priority ("high" | "medium" | "low"), studyWeek]
 * Item ids are derived as `<cert>-<domain>-<index>`, so append new items at the
 * end of a domain to keep existing saved progress intact.
 */
const DATA = {
  certs: {
    kcna: {
      name: "KCNA",
      title: "Kubernetes and Cloud Native Associate",
      format: "Multiple choice · 60 questions",
      duration: "90 minutes",
      passMark: 75,
      weeks: 4,
      domains: [
        {
          key: "fund", name: "Kubernetes Fundamentals", weight: 44,
          items: [
            ["Explain the control plane: kube-apiserver, etcd, scheduler, controller-manager", "high", 1],
            ["Explain node components: kubelet, kube-proxy, container runtime", "high", 1],
            ["Pods: lifecycle phases, init containers, sidecar pattern", "high", 1],
            ["Workload resources: Deployment, ReplicaSet, StatefulSet, DaemonSet, Job, CronJob", "high", 1],
            ["kubectl basics: get, describe, logs, apply, explain", "high", 1],
            ["Declarative vs imperative management and the reconciliation loop", "medium", 1],
            ["Namespaces, labels, selectors and annotations", "medium", 1],
            ["Containerization: Linux namespaces, cgroups, image vs container", "high", 1],
            ["OCI specs (image, runtime, distribution) and runtimes: containerd, CRI-O, runc", "medium", 2],
            ["Build, tag and push a container image to a registry", "low", 2],
            ["Kubernetes interfaces: CRI, CNI, CSI", "high", 2],
            ["Kubernetes API: groups, versions, resources, CRDs", "low", 2],
            ["Administration: RBAC basics — Role, ClusterRole, bindings, ServiceAccounts", "medium", 2],
            ["Administration: ConfigMaps and Secrets — creation and consumption (env, volume)", "medium", 2],
            ["Administration: ResourceQuota, LimitRange, cordon and drain, cluster upgrades (concepts)", "medium", 2],
            ["Scheduling: requests/limits, nodeSelector, affinity, taints & tolerations", "high", 2]
          ]
        },
        {
          key: "orch", name: "Container Orchestration", weight: 28,
          items: [
            ["Networking model: pod-to-pod communication, Services, CoreDNS", "high", 3],
            ["Service types: ClusterIP, NodePort, LoadBalancer, ExternalName, headless", "high", 3],
            ["Ingress and Gateway API: routing HTTP traffic into the cluster", "medium", 3],
            ["NetworkPolicy: default allow, selecting pods, ingress and egress rules", "medium", 3],
            ["Service mesh concepts: data plane, control plane, sidecar proxies, mTLS", "medium", 3],
            ["Security: the 4Cs, image scanning, least privilege", "medium", 3],
            ["Security: securityContext, Pod Security Standards, ServiceAccount tokens", "medium", 3],
            ["Storage: volumes, PersistentVolume, PersistentVolumeClaim, StorageClass", "high", 3],
            ["Storage: access modes, reclaim policies, ephemeral volumes (emptyDir, configMap, secret)", "low", 3],
            ["Troubleshooting: pod states — Pending, CrashLoopBackOff, ImagePullBackOff, OOMKilled", "high", 3],
            ["Troubleshooting: kubectl describe, events and logs to find a root cause", "high", 3]
          ]
        },
        {
          key: "deliv", name: "Cloud Native Application Delivery", weight: 16,
          items: [
            ["GitOps principles, push vs pull; Argo CD and Flux", "high", 4],
            ["CI/CD concepts: pipelines, stages, artifacts", "medium", 4],
            ["Packaging and templating: Helm and Kustomize", "high", 4],
            ["Deployment strategies: rolling, recreate, blue/green, canary", "high", 4],
            ["Rollouts and rollbacks: kubectl rollout status / history / undo", "medium", 4],
            ["Infrastructure as Code concepts", "low", 4],
            ["Debugging: liveness, readiness and startup probes", "medium", 4],
            ["Debugging: kubectl logs --previous, exec, debug and ephemeral containers", "medium", 4]
          ]
        },
        {
          key: "arch", name: "Cloud Native Architecture", weight: 12,
          items: [
            ["Cloud native characteristics; microservices vs monoliths", "high", 3],
            ["Autoscaling: HPA, VPA, Cluster Autoscaler, KEDA", "medium", 3],
            ["Serverless and FaaS: Knative, CloudEvents", "medium", 3],
            ["Open standards: OCI, CRI, CNI, CSI, OpenTelemetry", "medium", 3],
            ["Observability: the three pillars — logs, metrics, traces", "high", 4],
            ["Observability: Prometheus — pull model, exporters, PromQL basics, Alertmanager", "high", 4],
            ["Observability: tracing with OpenTelemetry and Jaeger; logging with Fluentd / Fluent Bit", "medium", 4],
            ["SLI / SLO / SLA and cost management (FinOps, OpenCost)", "low", 4],
            ["Community: CNCF project maturity (Sandbox / Incubating / Graduated), TOC, TAGs", "medium", 4],
            ["Community: Kubernetes SIGs, KEPs and how contributions work", "low", 4],
            ["Roles and personas: SRE, DevOps, platform, security, cloud architect", "low", 4],
            ["Ecosystem: match CNCF projects to their category and purpose", "high", 4],
            ["Community: how to take part — meetings, Slack, KubeCon, mentoring, CLA and DCO", "low", 4]
          ]
        }
      ]
    },

    kcsa: {
      name: "KCSA",
      title: "Kubernetes and Cloud Native Security Associate",
      format: "Multiple choice · 60 questions",
      duration: "90 minutes",
      passMark: 75,
      weeks: 4,
      domains: [
        {
          key: "overview", name: "Overview of Cloud Native Security", weight: 14,
          items: [
            ["The 4Cs of cloud native security: Cloud, Cluster, Container, Code", "high", 1],
            ["Cloud provider and infrastructure security; the shared responsibility model", "high", 1],
            ["Controls and frameworks: defense in depth, least privilege, zero trust", "medium", 1],
            ["Isolation techniques: namespaces, network, node, sandboxed runtimes", "medium", 1],
            ["Artifact repository and image security overview", "medium", 1],
            ["Workload and application code security overview", "medium", 1]
          ]
        },
        {
          key: "components", name: "Kubernetes Cluster Component Security", weight: 22,
          items: [
            ["API server: request flow (authn → authz → admission) and hardening flags", "high", 1],
            ["etcd: TLS, encryption at rest, restricted access", "high", 2],
            ["kubelet: anonymous-auth=false, Webhook authorization, no read-only port", "high", 2],
            ["Pod: securityContext — runAsNonRoot, readOnlyRootFilesystem, allowPrivilegeEscalation, capabilities", "high", 2],
            ["Controller manager and scheduler hardening", "medium", 2],
            ["Container runtime: namespaces, cgroups, seccomp, AppArmor/SELinux; gVisor, Kata, RuntimeClass", "medium", 2],
            ["kube-proxy and container networking: CNI plugins, encryption in transit", "medium", 2],
            ["Client security: kubeconfig files, credential handling, short-lived tokens", "medium", 2],
            ["Storage: hostPath risks, volume permissions, encrypting persistent data", "low", 2]
          ]
        },
        {
          key: "fundamentals", name: "Kubernetes Security Fundamentals", weight: 22,
          items: [
            ["Authentication: X.509 client certs, ServiceAccount tokens, OIDC", "high", 2],
            ["Authorization: RBAC in depth, incl. risky verbs — escalate, bind, impersonate, wildcard", "high", 2],
            ["Pod Security Standards: Privileged, Baseline, Restricted", "high", 3],
            ["Pod Security Admission: enforce / audit / warn namespace labels", "high", 3],
            ["Secrets: encryption at rest, external stores, volume vs env, RBAC on secrets", "high", 3],
            ["Network Policy: default deny, ingress and egress rules", "high", 3],
            ["Isolation and segmentation: namespaces, ResourceQuota, LimitRange, multi-tenancy", "medium", 3],
            ["Audit logging: policy levels (None/Metadata/Request/RequestResponse) and stages", "medium", 3]
          ]
        },
        {
          key: "threat", name: "Kubernetes Threat Model", weight: 16,
          items: [
            ["Trust boundaries and data flow in a cluster; applying STRIDE", "high", 3],
            ["Persistence: backdoor workloads, static pods, rogue RBAC bindings, CronJobs", "medium", 3],
            ["Denial of service: resource exhaustion, missing limits and quotas, API flooding", "medium", 3],
            ["Malicious code execution and compromised applications in containers", "medium", 3],
            ["Attacker on the network: unencrypted traffic, flat networks, lateral movement", "medium", 3],
            ["Access to sensitive data: Secrets, etcd, ServiceAccount tokens, cloud metadata API", "medium", 4],
            ["Privilege escalation: privileged pods, hostPath, host namespaces, RBAC abuse", "high", 4]
          ]
        },
        {
          key: "platform", name: "Platform Security", weight: 16,
          items: [
            ["Supply chain security: SBOMs, image signing (Cosign), provenance", "high", 4],
            ["Image repository: scanning (Trivy, Grype), private registries, digest pinning", "medium", 4],
            ["Admission control: webhooks, ValidatingAdmissionPolicy, Kyverno, OPA Gatekeeper", "high", 4],
            ["Observability: runtime detection with Falco, security-relevant logs and metrics", "medium", 4],
            ["Service mesh: mutual TLS, workload identity, authorization policies", "medium", 4],
            ["PKI: the cluster CA, component certificates, rotation and expiry", "medium", 4],
            ["Connectivity: ingress TLS termination, egress control, exposing services safely", "low", 4]
          ]
        },
        {
          key: "compliance", name: "Compliance and Security Frameworks", weight: 10,
          items: [
            ["Compliance frameworks: CIS Benchmarks, NIST SP 800-190, NIST CSF, PCI DSS, SOC 2, GDPR", "medium", 4],
            ["Threat modelling frameworks: STRIDE, MITRE ATT&CK for Containers", "high", 4],
            ["Supply chain compliance: SLSA levels, in-toto attestations", "medium", 4],
            ["Automation and tooling: kube-bench, kubescape, Trivy Operator, policy as code", "high", 4]
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

  /* Study guide content, filled in by assets/js/docs/<cert>-<domain>.js as docs[cert][domainKey]. */
  docs: {},

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
      title: "Rollouts & scaling", tool: "kubectl", certs: ["cka", "kcna"],
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
      title: "Helm, Kustomize & CRDs", tool: "helm", certs: ["cka", "kcna"],
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
    { cert: "kcna", d: "fund", type: "concept", q: "Which component is the only one that talks to etcd directly?", o: ["kube-apiserver", "kube-scheduler", "kube-controller-manager", "kubelet"], a: "kube-apiserver. Every other component reads and writes cluster state through the API server." },
    { cert: "kcna", d: "fund", type: "concept", q: "What does the kube-scheduler do?", o: ["Assigns pods that have no node to a suitable node", "Starts and stops the containers on each node", "Creates pods to match a Deployment's replica count", "Stores the cluster's state and configuration"], a: "Watches for pods with no node assigned and picks a node for each, by filtering feasible nodes and then scoring them." },
    { cert: "kcna", d: "fund", type: "definition", q: "What is a Pod?", o: ["The smallest deployable unit: one or more containers sharing a network namespace", "A single container image that is stored in a registry and pulled by nodes", "A group of worker nodes that is managed by one control plane", "A lightweight virtual machine that runs exactly one container"], a: "The smallest deployable unit in Kubernetes: one or more containers sharing a network namespace (one IP) and optionally volumes." },
    { cert: "kcna", d: "fund", type: "concept", q: "Deployment vs StatefulSet?", o: ["A StatefulSet gives each pod a stable name and its own volume; a Deployment's pods are interchangeable", "A StatefulSet runs one pod on every node; a Deployment runs a fixed number of pods anywhere", "A Deployment is meant for databases; a StatefulSet is meant for stateless web servers", "A StatefulSet cannot be scaled after it is created; a Deployment can be scaled at any time"], a: "Deployment: interchangeable replicas, random names. StatefulSet: stable identity (web-0, web-1), ordered rollout, and a PVC per replica." },
    { cert: "kcna", d: "fund", type: "definition", q: "What are CRI, CNI and CSI?", o: ["Interfaces for container runtimes, networking and storage", "Interfaces for registries, nodes and secrets", "Specifications for images, runtimes and distribution", "Controllers for replicas, nodes and services"], a: "Container Runtime Interface, Container Network Interface, Container Storage Interface — plugin contracts for runtimes, networking and storage." },
    { cert: "kcna", d: "arch", type: "concept", q: "What are the CNCF project maturity levels?", o: ["Sandbox, Incubating, Graduated", "Alpha, Beta, Stable", "Incubating, Sandbox, Graduated", "Bronze, Silver, Gold"], a: "Sandbox → Incubating → Graduated. The Technical Oversight Committee (TOC) votes on moving projects between levels." },
    { cert: "kcna", d: "deliv", type: "definition", q: "What is GitOps?", o: ["Git holds the desired state, and an agent keeps the cluster in sync with it", "A CI server pushes every commit straight to the production cluster", "Developers run kubectl from their laptops after each merge to Git", "Git hooks restart the affected pods whenever the code changes"], a: "Git is the single source of truth for declarative desired state; an agent in the cluster (Argo CD, Flux) continuously pulls and reconciles." },
    { cert: "kcna", d: "arch", type: "concept", q: "HPA vs VPA vs Cluster Autoscaler?", o: ["HPA changes the number of pods, VPA the size of pods, Cluster Autoscaler the number of nodes", "HPA changes the size of pods, VPA the number of pods, Cluster Autoscaler the number of nodes", "HPA changes the number of nodes, VPA the size of nodes, Cluster Autoscaler the number of pods", "All three change the number of pods, and differ only in the metric they watch"], a: "HPA changes replica count. VPA changes pod CPU/memory requests. Cluster Autoscaler adds or removes nodes. KEDA scales replicas on external events, including to zero." },
    { cert: "kcna", d: "arch", type: "concept", q: "What are the three pillars of observability?", o: ["Logs, metrics and traces", "Alerts, dashboards and reports", "CPU, memory and disk", "Build, test and deploy"], a: "Logs, metrics and traces. Prometheus covers metrics, Jaeger traces, Fluentd logs; OpenTelemetry standardises collection for all three." },
    { cert: "kcna", d: "arch", type: "concept", q: "How does Prometheus collect metrics?", o: ["It scrapes HTTP metrics endpoints at intervals", "Applications push their metrics to it", "It reads metrics from container log files", "Node agents send it metrics over syslog"], a: "It pulls (scrapes) HTTP /metrics endpoints on an interval. Short-lived jobs push to a Pushgateway, which Prometheus then scrapes." },
    { cert: "kcna", d: "orch", type: "definition", q: "What is a headless Service?", o: ["A Service with clusterIP: None, whose DNS name returns the pod IPs", "A Service that has no selector and therefore no endpoints", "A Service that can be reached only through an Ingress", "A Service that works without kube-proxy on the nodes"], a: "A Service with clusterIP: None. DNS returns the pod IPs directly instead of a single virtual IP — used with StatefulSets." },
    { cert: "kcna", d: "fund", type: "command", q: "Show documentation for a resource field from the terminal.", o: ["kubectl explain deployment.spec.strategy", "kubectl describe deployment.spec.strategy", "kubectl get deployment -o docs", "kubectl api-resources deployment.spec"], a: "kubectl explain deployment.spec.strategy" },
    { cert: "kcna", d: "fund", type: "definition", q: "What does the OCI standardise?", o: ["The image format, the container runtime and image distribution", "The kubelet's runtime, network and storage interfaces", "Kubernetes API versions and their deprecation rules", "Service mesh proxies and how they are configured"], a: "The Open Container Initiative defines the image spec, the runtime spec (implemented by runc) and the distribution spec (registries)." },
    { cert: "kcna", d: "orch", type: "concept", q: "What problem does a service mesh solve?", o: ["It moves mTLS, retries, traffic shifting and telemetry out of application code into proxies", "It gives each pod an IP address and connects the pods on different nodes to each other", "It routes HTTP requests from outside the cluster to the right Service by host and path", "It keeps copies of container images close to the nodes so that pods start faster"], a: "It moves service-to-service concerns — mTLS, retries, traffic shifting, telemetry — out of app code into proxies managed by a control plane." },

    { cert: "kcna", d: "orch", type: "concept", q: "What does CrashLoopBackOff mean?", o: ["The container keeps exiting, and the kubelet restarts it with a growing delay", "The image cannot be pulled from the registry, and the kubelet keeps retrying", "No node has enough free resources, so the pod cannot be scheduled", "The pod is waiting for a persistent volume to be attached to its node"], a: "The container starts, exits, and the kubelet keeps restarting it with a growing delay. Check kubectl logs --previous and the exit code in kubectl describe pod." },
    { cert: "kcna", d: "deliv", type: "concept", q: "Liveness vs readiness vs startup probe?", o: ["Liveness restarts the container, readiness controls traffic, startup holds the other two back", "Liveness controls traffic, readiness restarts the container, startup runs once after a rollout", "All three restart the container when they fail, each after a different delay", "Liveness checks the node, readiness checks the pod, startup checks the image"], a: "Liveness: restart the container if it fails. Readiness: remove the pod from Service endpoints while it fails. Startup: hold off the other two until a slow app has started." },
    { cert: "kcna", d: "deliv", type: "command", q: "Debug a running pod whose image has no shell.", o: ["kubectl debug -it <pod> --image=busybox --target=<container>", "kubectl exec -it <pod> --image=busybox -- sh", "kubectl attach -it <pod> --shell --target=<container>", "kubectl logs <pod> --shell --container=<container>"], a: "kubectl debug -it <pod> --image=busybox --target=<container>   (adds an ephemeral container)" },
    { cert: "kcna", d: "deliv", type: "concept", q: "Helm vs Kustomize?", o: ["Helm packages templated manifests as charts; Kustomize patches plain YAML with overlays", "Helm patches plain YAML with overlays; Kustomize packages templated manifests as charts", "Helm needs a component in the cluster; Kustomize runs only inside a CI pipeline", "Helm can only manage Deployments; Kustomize can only manage Services"], a: "Helm packages templated manifests as versioned charts and tracks releases. Kustomize patches plain YAML with overlays, no templates, and is built into kubectl (-k)." },

    // KCNA — Kubernetes Fundamentals (44%)
    { cert: "kcna", d: "fund", type: "concept", q: "What does the kube-controller-manager do?", o: ["Runs the built-in controllers that reconcile state", "Assigns newly created pods to the nodes that can run them", "Serves the Kubernetes API and validates every request", "Runs the containers of each pod on the worker nodes"], a: "Runs the built-in controllers (Deployment, ReplicaSet, Node, Job and others). Each one watches the cluster and works to make the actual state match the desired state." },
    { cert: "kcna", d: "fund", type: "concept", q: "What does the cloud-controller-manager do?", o: ["Connects the cluster to the cloud provider for load balancers, routes and nodes", "Schedules pods onto the cheapest cloud instances that are available", "Stores the cluster's state in the cloud provider's managed database", "Bills each namespace for the cloud resources that it has used"], a: "Connects the cluster to the cloud provider's API: it manages cloud load balancers, routes and node information. It is absent on clusters that do not run in a cloud." },
    { cert: "kcna", d: "fund", type: "concept", q: "What does the kubelet do?", o: ["The node agent that makes sure the containers of its pods are running", "The component that programs the forwarding rules for Services", "The component that picks a suitable node for each new pod", "The store that holds the state of every object in the cluster"], a: "The agent on every node. It takes the pod specs assigned to its node, asks the container runtime (through the CRI) to run the containers, runs the probes and reports node and pod status to the API server." },
    { cert: "kcna", d: "fund", type: "concept", q: "What does kube-proxy do?", o: ["Programs forwarding rules on each node so that Service IPs reach pods", "Gives every pod its IP address and connects pods across nodes", "Proxies kubectl requests from users to the API server", "Terminates TLS for HTTP traffic that enters the cluster"], a: "Runs on every node and programs packet-forwarding rules (iptables or nftables) so that traffic to a Service's virtual IP reaches one of its pods." },
    { cert: "kcna", d: "fund", type: "definition", q: "What is etcd?", o: ["A consistent, distributed key-value store that holds all cluster state", "A relational database in which applications keep their own data", "A registry that stores container images for the cluster's nodes", "A message queue that the control plane components talk through"], a: "A consistent, distributed key-value store that holds all cluster state. It uses the Raft algorithm and needs a majority (quorum) of members, so it runs with an odd number: 3 or 5." },
    { cert: "kcna", d: "fund", type: "definition", q: "What is a static pod?", o: ["A pod the kubelet runs from a manifest file on its node", "A pod that is never restarted after its container exits", "A pod that keeps the same IP address for its whole life", "A pod that a StatefulSet creates with a stable name"], a: "A pod defined by a manifest file on a node (by default in /etc/kubernetes/manifests) and managed by that node's kubelet directly, not by the API server. kubeadm runs the control plane components this way." },
    { cert: "kcna", d: "fund", type: "concept", q: "Declarative vs imperative management?", o: ["Declarative describes the desired end state; imperative gives step-by-step commands", "Declarative gives step-by-step commands; imperative describes the desired end state", "Declarative works only with Helm charts; imperative works only with kubectl", "Declarative changes cannot be rolled back; imperative changes can"], a: "Imperative: you give commands that say what to do (kubectl run, kubectl scale). Declarative: you describe the desired end state in manifests (kubectl apply) and Kubernetes works out the steps." },
    { cert: "kcna", d: "fund", type: "definition", q: "What is the reconciliation loop?", o: ["Observe the actual state, compare it with the desired state, act, and repeat", "Run a set of scripts once, at the moment an object is created", "Take a backup of etcd at regular intervals and verify it", "Restart every pod in the cluster whenever a node fails"], a: "The pattern every controller follows: observe the actual state, compare it with the desired state, act to remove the difference, and repeat for ever." },
    { cert: "kcna", d: "fund", type: "concept", q: "In what order does the API server process a request?", o: ["Authentication, authorization, mutating admission, validation, validating admission, storage", "Authorization, authentication, validation, mutating admission, validating admission, storage", "Mutating admission, authentication, authorization, storage, validation, validating admission", "Authentication, validation, authorization, storage, mutating admission, validating admission"], a: "Authentication → authorization → mutating admission → schema validation → validating admission → stored in etcd." },
    { cert: "kcna", d: "fund", type: "definition", q: "What is a CRD, and what is an operator?", o: ["A CRD adds a resource type; an operator is a controller that manages an application through it", "A CRD is a controller that watches objects; an operator is the resource type that it manages", "A CRD configures RBAC for a namespace; an operator is the cluster's human administrator", "A CRD is another name for a Helm chart; an operator is a release of that chart"], a: "A CustomResourceDefinition adds a new resource type to the Kubernetes API. An operator is a custom controller, usually paired with CRDs, that automates running a specific application (install, upgrade, backup)." },
    { cert: "kcna", d: "fund", type: "concept", q: "What do v1alpha1, v1beta1 and v1 tell you about an API?", o: ["How mature the API is: experimental, well tested, or stable", "Which Kubernetes release first introduced the API", "Which cloud providers are able to support the API", "How many API server replicas serve that API"], a: "Its maturity. Alpha: experimental, off by default, may be removed. Beta: well tested, may still change. v1: stable (GA) and covered by the deprecation policy." },
    { cert: "kcna", d: "fund", type: "definition", q: "What are the pod phases?", o: ["Pending, Running, Succeeded, Failed, Unknown", "Waiting, Running, Terminated", "Created, Scheduled, Ready, Deleted", "Pending, CrashLoopBackOff, Running, Completed"], a: "Pending, Running, Succeeded, Failed and Unknown. (CrashLoopBackOff and ImagePullBackOff are container states shown by kubectl, not phases.)" },
    { cert: "kcna", d: "fund", type: "definition", q: "What is an init container?", o: ["A container that must finish before the app containers start", "A container that runs beside the app for the pod's whole life", "The container that is listed first in a pod's spec", "A container that restarts the app whenever it fails"], a: "A container that runs to completion before the app containers start. Several init containers run one after another, and each must succeed. Used for setup work such as waiting for a dependency." },
    { cert: "kcna", d: "fund", type: "definition", q: "What is a sidecar container?", o: ["A helper container that runs beside the main container in the same pod", "A separate pod that is scheduled onto the same node as another pod", "A container that runs to completion before the main container starts", "A second replica of the application that is kept on standby"], a: "A helper container that runs next to the main container in the same pod, for example a log shipper or a mesh proxy. A native sidecar is declared as an init container with restartPolicy: Always." },
    { cert: "kcna", d: "fund", type: "concept", q: "What do the containers in one pod share?", o: ["The network namespace and any volumes they both mount", "The root filesystem and the container image", "One combined set of CPU and memory limits", "Environment variables and command arguments"], a: "The network namespace (one IP address; they reach each other on localhost) and any volumes they both mount. They do not share a filesystem." },
    { cert: "kcna", d: "fund", type: "concept", q: "ReplicaSet vs Deployment?", o: ["A Deployment manages ReplicaSets and adds rolling updates and rollbacks", "A ReplicaSet manages Deployments and adds rolling updates and rollbacks", "They are two names for the same object in different API versions", "A ReplicaSet is for stateful apps; a Deployment is for stateless ones"], a: "A ReplicaSet keeps a set number of identical pods running. A Deployment manages ReplicaSets and adds rolling updates and rollbacks. You normally create Deployments, not ReplicaSets." },
    { cert: "kcna", d: "fund", type: "definition", q: "What is a DaemonSet?", o: ["A workload that runs one copy of a pod on every node", "A workload that runs a task once, to completion", "A workload that gives each pod a stable identity", "A workload that scales its pods with CPU load"], a: "A workload that runs one copy of a pod on every node (or every matching node). Used for node-level agents: log collectors, monitoring agents, CNI plugins, kube-proxy." },
    { cert: "kcna", d: "fund", type: "concept", q: "Job vs CronJob?", o: ["A Job runs to completion once; a CronJob creates Jobs on a schedule", "A Job runs for ever; a CronJob runs once and is then deleted", "A Job runs on every node; a CronJob runs on a single node", "A Job is for batch work; a CronJob is for long-running servers"], a: "A Job runs pods until a set number complete successfully, then stops. A CronJob creates Jobs on a schedule written in cron syntax." },
    { cert: "kcna", d: "fund", type: "concept", q: "Which resources are not namespaced?", o: ["Nodes, PersistentVolumes, StorageClasses and Namespaces", "Pods, Services, Deployments and ReplicaSets", "ConfigMaps, Secrets and ServiceAccounts", "Roles, RoleBindings and PersistentVolumeClaims"], a: "Cluster-scoped resources: Nodes, PersistentVolumes, StorageClasses, Namespaces, ClusterRoles and ClusterRoleBindings. Check with kubectl api-resources --namespaced=false." },
    { cert: "kcna", d: "fund", type: "definition", q: "Which namespaces exist in a new cluster?", o: ["default, kube-system, kube-public and kube-node-lease", "default, system, public and private", "default, kube-system, kube-apps and kube-data", "kube-system, kube-proxy, kube-dns and default"], a: "default, kube-system (cluster components), kube-public (readable by everyone) and kube-node-lease (node heartbeats)." },
    { cert: "kcna", d: "fund", type: "concept", q: "Labels vs annotations?", o: ["Labels can be used to select objects; annotations cannot", "Annotations can be used to select objects; labels cannot", "Labels are read by people; annotations are read by Services", "Labels hold large values; annotations hold short ones"], a: "Labels identify and select objects: Services, Deployments and kubectl -l use them. Annotations hold extra information for tools and people and cannot be used to select objects." },
    { cert: "kcna", d: "fund", type: "command", q: "List the pods with label app=web in every namespace.", o: ["kubectl get pods -A -l app=web", "kubectl get pods -n all --name app=web", "kubectl get pods --all --field-selector app=web", "kubectl describe pods -l app=web -n default"], a: "kubectl get pods -A -l app=web" },
    { cert: "kcna", d: "fund", type: "command", q: "Generate the YAML for a Deployment without creating it.", o: ["kubectl create deployment web --image=nginx --dry-run=client -o yaml", "kubectl get deployment web --image=nginx -o yaml --create=false", "kubectl apply deployment web --image=nginx --print-only", "kubectl explain deployment web --image=nginx --output yaml"], a: "kubectl create deployment web --image=nginx --dry-run=client -o yaml" },
    { cert: "kcna", d: "fund", type: "command", q: "List every resource type the cluster knows, with short names and API groups.", o: ["kubectl api-resources", "kubectl get all", "kubectl api-versions", "kubectl explain resources"], a: "kubectl api-resources" },
    { cert: "kcna", d: "fund", type: "command", q: "Create or update the objects described in a manifest file.", o: ["kubectl apply -f <file>", "kubectl run -f <file>", "kubectl edit -f <file>", "kubectl get -f <file>"], a: "kubectl apply -f <file>   (declarative; kubectl create -f fails if the object already exists)" },
    { cert: "kcna", d: "fund", type: "concept", q: "Linux namespaces vs cgroups?", o: ["Namespaces limit what a process can see; cgroups limit what it can use", "Namespaces limit what a process can use; cgroups limit what it can see", "Namespaces isolate teams from each other; cgroups isolate nodes", "Namespaces are for networking only; cgroups are for storage only"], a: "Namespaces limit what a process can see (processes, network, mounts, hostname, users). Cgroups limit what it can use (CPU, memory, I/O). Together they make a container." },
    { cert: "kcna", d: "fund", type: "concept", q: "Container vs virtual machine?", o: ["A container shares the host's kernel; a VM runs its own", "A container runs its own kernel; a VM shares the host's", "A container needs a hypervisor; a VM does not", "A container starts more slowly than a VM does"], a: "A container shares the host's kernel and isolates processes, so it is small and starts in seconds or less. A VM runs its own kernel on a hypervisor: stronger isolation, but heavier and slower to start." },
    { cert: "kcna", d: "fund", type: "concept", q: "Image vs container?", o: ["An image is a read-only template; a container is a running instance of it", "A container is a read-only template; an image is a running instance of it", "An image runs on a node; a container is what is stored in a registry", "They are the same thing, and differ only in how large they are"], a: "An image is a read-only template made of layers. A container is a running instance of an image with a thin writable layer on top." },
    { cert: "kcna", d: "fund", type: "concept", q: "Image tag vs digest?", o: ["A tag can be moved to another image; a digest always names the same content", "A digest can be moved to another image; a tag always names the same content", "A tag is used with private registries; a digest with public registries", "A tag identifies a single layer; a digest identifies a whole registry"], a: "A tag (nginx:1.27) is a movable name that can later point to a different image. A digest (nginx@sha256:…) identifies exact content and never changes." },
    { cert: "kcna", d: "fund", type: "concept", q: "containerd vs runc?", o: ["containerd manages images and container lifecycles; runc creates the container process", "runc manages images and container lifecycles; containerd creates the container process", "containerd is the runtime for Docker only; runc is the runtime for Kubernetes only", "containerd runs on control plane nodes; runc runs on the worker nodes"], a: "containerd is a high-level runtime: it pulls images and manages container lifecycles, and the kubelet talks to it through the CRI. runc is the low-level runtime that actually creates the container process from the OCI runtime spec." },
    { cert: "kcna", d: "fund", type: "concept", q: "Kubernetes removed dockershim in v1.24. Do Docker-built images still run?", o: ["Yes, because Docker builds OCI images that any CRI runtime can run", "No, they have to be rebuilt with a different build tool first", "Only on the nodes that still have Docker Engine installed", "Only after they are converted to the CRI image format"], a: "Yes. Docker builds OCI images, and containerd and CRI-O run any OCI image. Only Docker Engine as the node's runtime was affected." },
    { cert: "kcna", d: "fund", type: "concept", q: "Role vs ClusterRole, RoleBinding vs ClusterRoleBinding?", o: ["Role and RoleBinding are namespaced; ClusterRole and ClusterRoleBinding are cluster-wide", "Role and RoleBinding are cluster-wide; ClusterRole and ClusterRoleBinding are namespaced", "Roles are meant for human users; ClusterRoles are meant for ServiceAccounts", "Roles grant access to resources; ClusterRoles are used to deny access"], a: "A Role grants permissions inside one namespace; a ClusterRole is cluster-wide and can cover cluster-scoped resources. A RoleBinding grants a role within a namespace; a ClusterRoleBinding grants a ClusterRole across the whole cluster." },
    { cert: "kcna", d: "fund", type: "concept", q: "Can an RBAC rule deny access?", o: ["No. RBAC only grants permissions; everything else is denied by default", "Yes. A deny rule in a Role overrides any allow rule for the same user", "Yes, but deny rules can be written only in a ClusterRole", "No, because everything is allowed unless a NetworkPolicy blocks it"], a: "No. RBAC is additive: everything is denied by default and rules only grant permissions. There are no deny rules." },
    { cert: "kcna", d: "fund", type: "definition", q: "What is a ServiceAccount?", o: ["An identity for the processes that run in pods", "An account for a human cluster administrator", "A billing account at the cloud provider", "The credential a node uses to join the cluster"], a: "An identity for processes running in pods, as opposed to human users. Every namespace has a default one, and pods use its token to authenticate to the API server." },
    { cert: "kcna", d: "fund", type: "command", q: "Check whether you are allowed to delete pods in namespace dev.", o: ["kubectl auth can-i delete pods -n dev", "kubectl get permissions pods -n dev", "kubectl describe role delete-pods -n dev", "kubectl rbac check delete pods -n dev"], a: "kubectl auth can-i delete pods -n dev" },
    { cert: "kcna", d: "fund", type: "concept", q: "ConfigMap vs Secret?", o: ["Both hold configuration; a Secret is for sensitive data but is only base64-encoded by default", "Both hold configuration; a ConfigMap is always encrypted and a Secret is stored as plain text", "A Secret is for large configuration files; a ConfigMap is only for short values", "A ConfigMap belongs to one namespace; a Secret is shared by the whole cluster"], a: "Both hold key-value configuration outside the image. A Secret is for sensitive data, but it is only base64-encoded, not encrypted, unless encryption at rest is switched on. Protect Secrets with RBAC." },
    { cert: "kcna", d: "fund", type: "concept", q: "How can a pod consume a ConfigMap or Secret?", o: ["As environment variables or as files in a mounted volume", "Only as environment variables set when the pod starts", "Only by calling the Kubernetes API from the application", "As labels and annotations copied onto the pod"], a: "As environment variables or as files in a mounted volume. Mounted files are updated when the object changes; environment variables are not, until the pod restarts." },
    { cert: "kcna", d: "fund", type: "concept", q: "ResourceQuota vs LimitRange?", o: ["A ResourceQuota caps a namespace's total; a LimitRange sets defaults and bounds per container", "A LimitRange caps a namespace's total; a ResourceQuota sets defaults and bounds per container", "A ResourceQuota applies to the nodes of a cluster; a LimitRange applies to its pods", "They are the same object, and differ only in the API version that serves them"], a: "A ResourceQuota caps the total a namespace may use (CPU, memory, number of objects). A LimitRange sets defaults and minimum/maximum values for each pod or container in a namespace." },
    { cert: "kcna", d: "fund", type: "concept", q: "kubectl cordon vs kubectl drain?", o: ["cordon stops new pods from being scheduled; drain also evicts the running pods", "drain stops new pods from being scheduled; cordon also evicts the running pods", "cordon removes the node from the cluster; drain reboots the node", "cordon applies to single pods; drain applies to a whole namespace"], a: "cordon marks a node unschedulable, so no new pods land on it; running pods stay. drain also evicts the pods that are already running, ready for maintenance. uncordon reverses it." },
    { cert: "kcna", d: "fund", type: "concept", q: "What are the rules for upgrading a cluster?", o: ["One minor version at a time, control plane first, then the nodes", "Any version jump is fine as long as the nodes are upgraded first", "Nodes first, then the control plane, one patch version at a time", "Every component must be upgraded at exactly the same moment"], a: "One minor version at a time; control plane first, then worker nodes; drain each node before upgrading it. No component may be newer than the kube-apiserver." },
    { cert: "kcna", d: "fund", type: "definition", q: "What is a PodDisruptionBudget?", o: ["A limit on how many pods of an app may be down at once during voluntary disruptions", "A cap on the total CPU and memory that the pods of one namespace may request", "A rule that restarts the pods of an application whenever one of them fails", "A budget for how many nodes the Cluster Autoscaler is allowed to add"], a: "A limit on how many pods of an application may be down at once during voluntary disruptions such as a node drain. It keeps an application available during maintenance." },
    { cert: "kcna", d: "fund", type: "concept", q: "Requests vs limits?", o: ["Requests are reserved for scheduling; limits are the maximum a container may use", "Limits are reserved for scheduling; requests are the maximum a container may use", "Requests apply only to CPU; limits apply only to memory", "Requests are set on nodes; limits are set on namespaces"], a: "Requests are what the scheduler reserves for a container when choosing a node. Limits are the maximum it may use: above the CPU limit it is throttled, above the memory limit it is killed (OOMKilled)." },
    { cert: "kcna", d: "fund", type: "definition", q: "What are the three QoS classes?", o: ["Guaranteed, Burstable and BestEffort", "High, Medium and Low", "Guaranteed, Standard and Preemptible", "Reserved, Shared and Spot"], a: "Guaranteed (requests equal limits for every container), Burstable (some requests or limits set) and BestEffort (none set). Under memory pressure, pods using more than they requested go first, so BestEffort pods are the most exposed and Guaranteed pods the least." },
    { cert: "kcna", d: "fund", type: "concept", q: "Taints and tolerations vs node affinity?", o: ["A taint repels pods from a node; node affinity attracts pods to nodes", "A taint attracts pods to a node; node affinity repels pods from nodes", "Taints are set on pods; node affinity is set on namespaces", "They do exactly the same thing, with different syntax"], a: "A taint on a node repels pods unless they tolerate it. Node affinity on a pod attracts it to nodes with certain labels. To dedicate nodes to a workload you usually need both." },
    { cert: "kcna", d: "fund", type: "concept", q: "nodeSelector vs node affinity?", o: ["nodeSelector is an exact label match; node affinity adds operators and soft preferences", "Node affinity is an exact label match; nodeSelector adds operators and soft preferences", "nodeSelector matches labels on pods; node affinity matches labels on nodes", "nodeSelector is deprecated and is ignored by current schedulers"], a: "nodeSelector is a simple exact match on node labels. Node affinity is more expressive (In, NotIn, Exists) and has a hard form (required…) and a soft form (preferred…)." },
    { cert: "kcna", d: "fund", type: "concept", q: "How do you spread the replicas of an app across nodes or zones?", o: ["With pod anti-affinity or topology spread constraints", "With the same nodeSelector on every replica", "With a ResourceQuota for each zone", "With a NoSchedule taint on every node"], a: "With pod anti-affinity or topology spread constraints, so that one node or zone failing does not take down every replica." },

    { cert: "kcna", d: "fund", type: "concept", q: "Does a namespace restrict who can access the objects in it?", o: ["No. Access is controlled by RBAC; a namespace only separates names and scopes policies", "Yes. Only the user who created the namespace can read the objects inside it", "Yes. Pods in other namespaces are blocked from reaching it by default", "No. A namespace has no effect on names, quotas, policies or access"], a: "Not by itself. A namespace separates names and is the unit for quotas and policies. Access is controlled by RBAC, and network isolation by NetworkPolicy." },

    { cert: "kcna", d: "fund", type: "definition", q: "What are the four top-level fields of a Kubernetes manifest?", o: ["apiVersion, kind, metadata and spec", "name, image, ports and replicas", "version, type, labels and status", "group, resource, namespace and data"], a: "apiVersion (the API group and version), kind (the type of object), metadata (name, namespace, labels) and spec (the desired state). Kubernetes adds status, the actual state." },
    { cert: "kcna", d: "fund", type: "concept", q: "A Deployment's selector does not match the labels in its pod template. What happens?", o: ["The API server rejects the Deployment", "The pods are created but never managed", "The Deployment creates pods without end", "The labels are corrected automatically"], a: "The API server rejects the Deployment. spec.selector must match spec.template.metadata.labels, so nothing is created." },
    { cert: "kcna", d: "fund", type: "command", q: "Forward local port 8080 to port 80 of a pod for testing.", o: ["kubectl port-forward pod/<pod> 8080:80", "kubectl expose pod <pod> --port=8080:80", "kubectl proxy pod/<pod> 8080:80", "kubectl exec <pod> --forward 8080:80"], a: "kubectl port-forward pod/<pod> 8080:80   (also works with service/<name>; it is a debugging tool, not a Service type)" },

    // KCNA — Container Orchestration (28%)
    { cert: "kcna", d: "orch", type: "concept", q: "What are the rules of the Kubernetes network model?", o: ["Every pod has its own IP and can reach every other pod without NAT", "Pods share the IP of their node and are told apart by port number", "Pods can communicate with each other only through a Service", "Pods on different nodes reach each other through NAT on each node"], a: "Every pod has its own IP address, and every pod can reach every other pod without NAT. Kubernetes does not implement this itself: a CNI plugin does." },
    { cert: "kcna", d: "orch", type: "concept", q: "Why do Services exist?", o: ["Pod IPs change, so a Service gives a stable address and balances across matching pods", "Pods cannot open any network connection unless a Service has been created for them", "Every pod needs a Service of its own before it can be given an IP address", "A Service encrypts the traffic between pods that run on different nodes"], a: "Pods are replaced often and their IPs change. A Service gives a stable virtual IP and DNS name and load-balances across the pods that match its label selector." },
    { cert: "kcna", d: "orch", type: "definition", q: "What are the Service types?", o: ["ClusterIP, NodePort, LoadBalancer and ExternalName", "ClusterIP, HostPort, Ingress and Gateway", "Internal, External, Headless and Public", "NodePort, PodPort, LoadBalancer and Proxy"], a: "ClusterIP (internal only, the default), NodePort (a port in 30000–32767 on every node), LoadBalancer (an external cloud load balancer) and ExternalName (a DNS alias to an outside name)." },
    { cert: "kcna", d: "orch", type: "definition", q: "What is the DNS name of Service web in namespace shop?", o: ["web.shop.svc.cluster.local", "shop.web.svc.cluster.local", "web.svc.shop.cluster.local", "web.shop.pod.cluster.local"], a: "web.shop.svc.cluster.local. From the same namespace, just web works. CoreDNS serves these names." },
    { cert: "kcna", d: "orch", type: "definition", q: "What is an EndpointSlice?", o: ["The list of IP addresses and ports of the ready pods behind a Service", "The part of an Ingress rule that describes a single host and path", "A portion of a node's address range that is reserved for its pods", "A group of Services that share one external load balancer"], a: "The object that lists the IP addresses and ports of the ready pods behind a Service. kube-proxy reads it to know where to send traffic. It replaced the older Endpoints object." },
    { cert: "kcna", d: "orch", type: "concept", q: "Ingress vs ingress controller?", o: ["An Ingress is a set of routing rules; the controller is the proxy that implements them", "An ingress controller is a set of routing rules; the Ingress is the proxy that runs them", "They are two names for the same object, used by different cloud providers", "An Ingress handles TCP traffic; an ingress controller handles HTTP traffic"], a: "An Ingress is only a set of HTTP routing rules (host and path to Service). An ingress controller is the proxy that reads those rules and carries the traffic. Kubernetes does not ship one." },
    { cert: "kcna", d: "orch", type: "concept", q: "Which Gateway API resource belongs to which role?", o: ["GatewayClass: infrastructure provider; Gateway: cluster operator; HTTPRoute: application developer", "GatewayClass: application developer; Gateway: infrastructure provider; HTTPRoute: cluster operator", "GatewayClass: cluster operator; Gateway: application developer; HTTPRoute: infrastructure provider", "All three resources are created and owned by the cluster operator"], a: "GatewayClass: the infrastructure provider. Gateway: the cluster operator (listeners, ports, TLS). HTTPRoute: the application developer (routing rules to Services)." },
    { cert: "kcna", d: "orch", type: "concept", q: "Ingress vs Gateway API?", o: ["Ingress is frozen at basic HTTP routing; the Gateway API is its more capable, role-oriented successor", "The Gateway API is frozen at basic HTTP routing; Ingress is its more capable, role-oriented successor", "Ingress is used for traffic inside the cluster; the Gateway API is used for traffic from outside", "They offer the same features, and differ only in the name of the resource"], a: "Ingress covers basic HTTP routing and is frozen; extras need controller-specific annotations. The Gateway API is its successor: role-oriented, portable, and able to express traffic splitting, header matching and other protocols." },
    { cert: "kcna", d: "orch", type: "concept", q: "What traffic is allowed when a namespace has no NetworkPolicy?", o: ["All traffic", "No traffic", "Only traffic from the same namespace", "Only traffic that arrives through a Service"], a: "All of it. Pods accept traffic from anywhere by default. Once a policy selects a pod, only the traffic that some policy allows gets through in that direction." },
    { cert: "kcna", d: "orch", type: "concept", q: "What does a NetworkPolicy need in order to have any effect?", o: ["A CNI plugin that enforces NetworkPolicy", "kube-proxy running in nftables mode", "A service mesh with sidecar proxies", "An ingress controller in the cluster"], a: "A CNI plugin that enforces it, such as Calico or Cilium. With a plugin that does not (plain Flannel), the policy is accepted and silently ignored." },
    { cert: "kcna", d: "orch", type: "concept", q: "What does a default-deny NetworkPolicy look like?", o: ["An empty podSelector, with policyTypes listed and no allow rules", "A podSelector that is written so that it matches no pods at all", "A policy whose ingress section contains one empty rule", "A policy that is created in the kube-system namespace"], a: "An empty podSelector ({}), which selects every pod in the namespace, with policyTypes listed and no allow rules." },
    { cert: "kcna", d: "orch", type: "concept", q: "Service mesh: data plane vs control plane?", o: ["The data plane proxies carry the traffic; the control plane configures them", "The control plane proxies carry the traffic; the data plane configures them", "The data plane stores application data; the control plane schedules pods", "Both carry traffic, the data plane for HTTP and the control plane for TCP"], a: "The data plane is the proxies (often Envoy sidecars) that carry the traffic between services. The control plane configures them and issues certificates. Istio and Linkerd are the main projects." },
    { cert: "kcna", d: "orch", type: "definition", q: "What is mutual TLS (mTLS)?", o: ["TLS in which both sides present a certificate and verify each other", "TLS in which only the server presents a certificate to the client", "Encryption of the data that the cluster keeps at rest in etcd", "A VPN tunnel that connects the nodes of a cluster"], a: "TLS where both sides present a certificate, so each service proves its identity to the other and the traffic is encrypted. A service mesh adds it without changing application code." },
    { cert: "kcna", d: "orch", type: "definition", q: "What are the 4Cs of cloud native security?", o: ["Cloud, Cluster, Container, Code", "Compute, Config, Container, Code", "Cloud, Cluster, Certificate, Credential", "Control, Compliance, Container, Cluster"], a: "Cloud, Cluster, Container, Code. Each layer depends on the security of the layer around it." },
    { cert: "kcna", d: "orch", type: "concept", q: "Name four securityContext settings that harden a container.", o: ["runAsNonRoot, allowPrivilegeEscalation: false, readOnlyRootFilesystem, drop all capabilities", "privileged: true, hostNetwork: true, hostPID: true, add all capabilities", "replicas, strategy, selector and the pod template", "requests and limits, nodeSelector, tolerations and a PriorityClass for the containers"], a: "runAsNonRoot: true, allowPrivilegeEscalation: false, readOnlyRootFilesystem: true and capabilities.drop: [ALL]. Avoid privileged: true." },
    { cert: "kcna", d: "orch", type: "definition", q: "What are the Pod Security Standards?", o: ["Privileged, Baseline and Restricted", "Enforce, Audit and Warn", "Low, Medium and High", "Permissive, Standard and Locked-down"], a: "Three levels: Privileged (no restrictions), Baseline (blocks known privilege escalations) and Restricted (current hardening best practice)." },
    { cert: "kcna", d: "orch", type: "concept", q: "How is a Pod Security Standard applied?", o: ["By Pod Security Admission, through labels on a namespace", "By a PodSecurityPolicy that is bound to users with RBAC", "By an annotation that is added to every pod", "By a command-line flag on each node's kubelet"], a: "By Pod Security Admission, a built-in admission controller, through labels on a namespace. Three modes: enforce (reject), audit (log) and warn (tell the user). It replaced PodSecurityPolicy, removed in v1.25." },
    { cert: "kcna", d: "orch", type: "concept", q: "How do you reduce risk from container images?", o: ["Scan them, sign and verify them, use small base images and pin them by digest", "Always use the latest tag, so that security fixes arrive automatically", "Include debugging tools in every image, so that incidents can be investigated", "Pull them from whichever public registry responds the fastest"], a: "Scan them for known vulnerabilities (Trivy), sign and verify them (Cosign), use small base images, pull from a trusted registry and refer to them by digest." },
    { cert: "kcna", d: "orch", type: "concept", q: "PersistentVolume vs PersistentVolumeClaim vs StorageClass?", o: ["A PV is storage, a PVC is a request for storage, a StorageClass describes how to provision it", "A PVC is storage, a PV is a request for storage, a StorageClass is a quota on storage", "A PV is used by pods, a PVC is used by nodes, a StorageClass is used by namespaces", "All three are different names for the same kind of volume"], a: "A PV is a piece of storage in the cluster. A PVC is a request for storage by a user, which binds to a PV. A StorageClass describes a kind of storage and lets PVs be created on demand." },
    { cert: "kcna", d: "orch", type: "concept", q: "Static vs dynamic provisioning?", o: ["Static: an administrator creates volumes in advance; dynamic: a StorageClass creates them on demand", "Static: a StorageClass creates volumes on demand; dynamic: an administrator creates them in advance", "Static: the volume is on the node's own disk; dynamic: the volume is in the cloud", "Static: a volume can never be resized; dynamic: a volume grows automatically"], a: "Static: an administrator creates PersistentVolumes in advance. Dynamic: a PVC names a StorageClass and its provisioner (a CSI driver) creates the volume automatically." },
    { cert: "kcna", d: "orch", type: "definition", q: "What are the volume access modes?", o: ["ReadWriteOnce, ReadOnlyMany, ReadWriteMany and ReadWriteOncePod", "ReadOnly, ReadWrite, ReadWriteShared and ReadWriteExclusive", "Private, Shared and Public", "Block, File and Object"], a: "ReadWriteOnce (one node, read-write), ReadOnlyMany (many nodes, read-only), ReadWriteMany (many nodes, read-write) and ReadWriteOncePod (a single pod)." },
    { cert: "kcna", d: "orch", type: "definition", q: "What does a PersistentVolume's reclaim policy decide?", o: ["What happens to the volume when its claim is deleted", "Which pods are allowed to mount the volume", "How large the volume is allowed to grow", "Which node the volume is attached to"], a: "What happens to the volume when its claim is deleted. Retain keeps the volume and its data for manual clean-up. Delete removes the volume and the underlying storage." },
    { cert: "kcna", d: "orch", type: "definition", q: "What is an emptyDir volume?", o: ["A temporary directory that lives as long as the pod", "A volume that is kept after the pod is deleted", "A directory mounted from the node's filesystem", "A read-only volume built from a ConfigMap"], a: "An empty directory created when the pod starts and deleted when the pod is removed. It survives container restarts and is used for scratch space or for sharing files between containers in a pod." },
    { cert: "kcna", d: "orch", type: "concept", q: "How does a StatefulSet give each replica its own storage?", o: ["With volumeClaimTemplates: each pod gets its own PersistentVolumeClaim", "With one PersistentVolumeClaim that all the replicas share", "With an emptyDir volume in each pod", "With a hostPath volume on each pod's node"], a: "Through volumeClaimTemplates: each pod gets its own PVC, which stays bound to that pod's identity (web-0, web-1) across restarts and rescheduling." },
    { cert: "kcna", d: "orch", type: "concept", q: "A pod is Pending. What are the usual causes?", o: ["No node fits: too few resources, an untolerated taint, unmatched affinity or an unbound PVC", "The container starts, exits with an error, and is restarted again and again", "The kubelet cannot pull the image from the registry and keeps retrying", "The liveness probe of the container keeps failing after it has started"], a: "No node fits it: not enough CPU or memory for its requests, a taint it does not tolerate, an affinity rule that matches no node, or a PVC that is not bound. kubectl describe pod shows the reason in Events." },
    { cert: "kcna", d: "orch", type: "concept", q: "What does ImagePullBackOff mean?", o: ["The kubelet cannot pull the image and is retrying", "The container starts and then crashes repeatedly", "The pod has not been assigned to a node yet", "The container was killed for using too much memory"], a: "The kubelet cannot pull the image and is retrying with a growing delay. Usual causes: a wrong image name or tag, a private registry without credentials, or no network path to the registry." },
    { cert: "kcna", d: "orch", type: "concept", q: "What does OOMKilled mean, and which exit code goes with it?", o: ["The container exceeded its memory limit and was killed; exit code 137", "The container exceeded its CPU limit and was killed; exit code 1", "The node ran out of disk space and evicted the pod; exit code 143", "The image could not be pulled from the registry; exit code 0"], a: "The container used more memory than its limit and the kernel killed it. Exit code 137 (128 + signal 9, SIGKILL)." },
    { cert: "kcna", d: "orch", type: "concept", q: "In what order do you investigate a failing pod?", o: ["get pods, describe pod, logs, then exec", "exec, logs, delete pod, then get pods", "logs, get nodes, top, then describe pod", "describe node, restart kubelet, then logs"], a: "kubectl get pods (status) → kubectl describe pod (events and container state) → kubectl logs (application output, --previous after a crash) → kubectl exec (look inside)." },
    { cert: "kcna", d: "orch", type: "concept", q: "A Service does not respond. What do you check first?", o: ["Whether the Service has endpoints, by comparing its selector with the pod labels", "Whether the API server has been restarted since the Service was created", "Whether the nodes have enough free CPU for the Service to run", "Whether the pods use the latest tag of their image"], a: "Whether it has endpoints. No endpoints means the selector matches no ready pods: compare the Service's selector with the pod labels and check the readiness probe. Then check port and targetPort." },
    { cert: "kcna", d: "orch", type: "command", q: "Show recent events in the current namespace, oldest first.", o: ["kubectl get events --sort-by=.lastTimestamp", "kubectl logs events --since=1h", "kubectl describe events --recent", "kubectl get events --order=lastTimestamp"], a: "kubectl get events --sort-by=.lastTimestamp" },

    { cert: "kcna", d: "orch", type: "concept", q: "Service: port vs targetPort?", o: ["port is where the Service listens; targetPort is the port on the pods", "targetPort is where the Service listens; port is the port on the pods", "port is used for TCP traffic; targetPort is used for UDP traffic", "port is opened on every node; targetPort is opened on one node"], a: "port is where the Service listens on its cluster IP. targetPort is the port on the pods that the traffic is sent to. nodePort, for NodePort Services, is the port opened on every node." },

    // KCNA — Cloud Native Application Delivery (16%)
    { cert: "kcna", d: "deliv", type: "definition", q: "What are the four GitOps principles?", o: ["Declarative, versioned and immutable, pulled automatically, continuously reconciled", "Scripted, tagged by hand, pushed manually, reviewed every week", "Declarative, pushed by a pipeline, approved manually, reconciled on request", "Plan, apply, verify and destroy"], a: "Declarative (the desired state is described, not scripted), versioned and immutable (stored in Git), pulled automatically (agents fetch it) and continuously reconciled (drift is corrected)." },
    { cert: "kcna", d: "deliv", type: "concept", q: "Push vs pull deployment?", o: ["Push: a pipeline outside applies changes; pull: an agent in the cluster fetches them", "Pull: a pipeline outside applies changes; push: an agent in the cluster fetches them", "Push takes its state from Git; pull takes its state from a container registry", "Push is used for production clusters; pull is used only for test clusters"], a: "Push: a CI pipeline outside the cluster runs kubectl or helm against it and needs cluster credentials. Pull: an agent inside the cluster fetches the desired state from Git and applies it. GitOps uses pull." },
    { cert: "kcna", d: "deliv", type: "concept", q: "Argo CD vs Flux?", o: ["Both are GitOps tools; Argo CD has a web UI, Flux is a set of controllers without one", "Both are GitOps tools; Flux has a web UI, Argo CD is a command-line tool without one", "Argo CD is a CI server that builds images; Flux is a registry that stores them", "Argo CD pushes changes into clusters; Flux is the only one that pulls them"], a: "Both are CNCF graduated GitOps tools that sync a cluster with Git. Argo CD is known for its web UI and Application resource. Flux is a set of controllers (source, kustomize, helm) with no built-in UI." },
    { cert: "kcna", d: "deliv", type: "concept", q: "CI vs continuous delivery vs continuous deployment?", o: ["Delivery keeps a manual approval before production; deployment releases automatically", "Deployment keeps a manual approval before production; delivery releases automatically", "Continuous integration releases to production; delivery only builds the code", "All three are different names for the same practice"], a: "CI: merge often, build and test automatically. Continuous delivery: every change is ready to release, with a manual approval before production. Continuous deployment: every change that passes goes to production automatically." },
    { cert: "kcna", d: "deliv", type: "definition", q: "What is Infrastructure as Code?", o: ["Describing infrastructure in versioned files that a tool applies", "Writing the application code that runs on the infrastructure", "Configuring servers by hand and documenting each step", "Storing container images in a private registry"], a: "Describing infrastructure in versioned files that a tool applies, instead of manual set-up. It makes environments repeatable and reviewable. Examples: Terraform, OpenTofu, Pulumi, Crossplane." },
    { cert: "kcna", d: "deliv", type: "definition", q: "Helm: chart, release, repository, values?", o: ["Chart: a package; release: an installed instance; repository: where charts are stored; values: settings", "Chart: an installed instance; release: a package; repository: a namespace; values: Secrets", "Chart: an architecture diagram; release: a Git tag; repository: a Git repo; values: labels", "Chart: a pod; release: a Deployment; repository: an image registry; values: environment variables"], a: "A chart is a package of templated manifests. A release is one installed instance of a chart. A repository stores charts. Values are the settings that fill in the templates." },
    { cert: "kcna", d: "deliv", type: "concept", q: "Kustomize: base vs overlay?", o: ["A base is the common manifests; an overlay patches them for one environment", "An overlay is the common manifests; a base patches them for one environment", "A base is a Helm chart; an overlay is the values file that configures it", "A base is what runs in production; an overlay is what runs in testing"], a: "A base is a set of plain manifests. An overlay refers to a base and patches it for one environment (dev, prod), so the common YAML is not copied." },
    { cert: "kcna", d: "deliv", type: "concept", q: "RollingUpdate vs Recreate?", o: ["RollingUpdate replaces pods gradually; Recreate stops all old pods first", "Recreate replaces pods gradually; RollingUpdate stops all old pods first", "RollingUpdate needs two full environments; Recreate needs only one", "RollingUpdate is for StatefulSets; Recreate is for Deployments"], a: "RollingUpdate (the default) replaces pods gradually with no downtime, controlled by maxSurge and maxUnavailable. Recreate stops all old pods before starting new ones, which causes downtime but never runs two versions together." },
    { cert: "kcna", d: "deliv", type: "concept", q: "Blue/green vs canary?", o: ["Blue/green switches all traffic at once; canary shifts a small share first", "Canary switches all traffic at once; blue/green shifts a small share first", "Blue/green always causes downtime; canary never causes downtime", "They are two names for an ordinary rolling update"], a: "Blue/green: run the new version alongside the old one and switch all traffic at once; rollback is switching back. Canary: send a small share of traffic to the new version and increase it step by step." },
    { cert: "kcna", d: "deliv", type: "concept", q: "Which tools automate canary and blue/green releases on Kubernetes?", o: ["Argo Rollouts and Flagger", "Helm and Kustomize", "Prometheus and Grafana", "Trivy and Falco"], a: "Argo Rollouts and Flagger. A plain Deployment only supports RollingUpdate and Recreate." },
    { cert: "kcna", d: "deliv", type: "command", q: "Roll a Deployment back to its previous version.", o: ["kubectl rollout undo deployment/web", "kubectl rollback deployment web", "kubectl delete deployment web --previous", "kubectl apply deployment/web --revert"], a: "kubectl rollout undo deployment/web" },
    { cert: "kcna", d: "deliv", type: "command", q: "Watch a rollout and list its past revisions.", o: ["kubectl rollout status and kubectl rollout history", "kubectl get rollout and kubectl describe rollout", "kubectl logs deployment and kubectl top deployment", "kubectl watch deployment and kubectl list revisions"], a: "kubectl rollout status deployment/web   and   kubectl rollout history deployment/web" },
    { cert: "kcna", d: "deliv", type: "definition", q: "In which ways can a probe check a container?", o: ["httpGet, tcpSocket, exec and grpc", "ping, curl, ssh and telnet", "liveness, readiness and startup", "get, list, watch and delete"], a: "httpGet (an HTTP request), tcpSocket (open a port), exec (run a command in the container) and grpc (a gRPC health check)." },
    { cert: "kcna", d: "deliv", type: "command", q: "Show the logs of a container that has crashed and restarted.", o: ["kubectl logs <pod> --previous", "kubectl logs <pod> --follow", "kubectl describe pod <pod> --logs", "kubectl get pod <pod> -o logs"], a: "kubectl logs <pod> --previous   (add -c <container> in a multi-container pod)" },

    { cert: "kcna", d: "deliv", type: "definition", q: "What is continuous integration (CI)?", o: ["Merging small changes often, with each one built and tested automatically", "Releasing every change to production automatically, without approval", "Keeping a cluster in sync with the manifests stored in Git", "Watching applications in production and alerting on failures"], a: "Developers merge small changes often, and every change is built and tested automatically, so problems are found early. Continuous delivery and deployment then take the tested build towards production." },

    // KCNA — Cloud Native Architecture (12%)
    { cert: "kcna", d: "arch", type: "definition", q: "How does the CNCF define cloud native?", o: ["Scalable applications built with containers, microservices and declarative APIs", "Any application at all, as long as it is hosted by a public cloud provider", "Virtual machines that were moved from a data centre into the cloud unchanged", "Serverless functions that depend on the services of a single vendor"], a: "Technologies that let organisations build and run scalable applications in dynamic environments (public, private and hybrid clouds), using containers, service meshes, microservices, immutable infrastructure and declarative APIs." },
    { cert: "kcna", d: "arch", type: "concept", q: "Microservices vs monolith?", o: ["Microservices are deployed and scaled independently; a monolith is one unit", "A monolith is deployed and scaled independently; microservices are one unit", "Microservices share one database; a monolith has one database per module", "Microservices cannot run in containers; a monolith can"], a: "A monolith is one deployable unit: simple to start with, but scaled and released as a whole. Microservices are small services deployed and scaled independently, at the cost of more operational complexity." },
    { cert: "kcna", d: "arch", type: "definition", q: "What is immutable infrastructure?", o: ["Infrastructure that is replaced, not changed, when it needs an update", "Infrastructure that can never be deleted once it has been created", "Infrastructure that administrators patch in place, server by server", "Infrastructure that is able to run only read-only workloads"], a: "Servers and containers are never changed after they are deployed. To change something you build a new image and replace the old instance, which keeps environments consistent and repeatable." },
    { cert: "kcna", d: "arch", type: "definition", q: "What is the twelve-factor app?", o: ["A set of twelve practices for building applications that suit the cloud", "A list of the first twelve projects that graduated in the CNCF", "A Kubernetes application that always runs with twelve replicas", "A security benchmark that consists of twelve controls"], a: "A set of twelve practices for building applications that suit the cloud, such as configuration in the environment, stateless processes, logs as event streams and fast start-up and shutdown." },
    { cert: "kcna", d: "arch", type: "definition", q: "What is KEDA?", o: ["An event-driven autoscaler that can scale workloads to zero", "A tool that adds nodes when pods cannot be scheduled", "A tool that adjusts the CPU and memory requests of pods", "A serverless platform for running request-driven services"], a: "Kubernetes Event-driven Autoscaling, a CNCF graduated project. It scales workloads on external events such as queue length, using ready-made scalers, and can scale to zero. It drives an HPA under the hood." },
    { cert: "kcna", d: "arch", type: "concept", q: "What does the HPA need in order to scale on CPU?", o: ["metrics-server, and CPU requests on the pods", "Prometheus, and CPU limits on the nodes", "A LimitRange in the pod's namespace", "The Cluster Autoscaler"], a: "metrics-server installed, and CPU requests set on the pods, because utilisation is measured as a percentage of the request." },
    { cert: "kcna", d: "arch", type: "definition", q: "What is Knative?", o: ["A CNCF project that adds serverless workloads to Kubernetes", "A CNCF project that provides pod networking based on eBPF", "A package manager that installs applications from charts", "A GitOps tool that syncs clusters and has a web UI"], a: "A CNCF graduated project that adds serverless to Kubernetes. Knative Serving runs request-driven workloads that scale to zero; Knative Eventing routes events between services." },
    { cert: "kcna", d: "arch", type: "definition", q: "What is CloudEvents?", o: ["A specification for describing event data in a common format", "A service that stores the events of a Kubernetes cluster", "A message broker offered by the large cloud providers", "A dashboard for viewing the events of a cluster"], a: "A CNCF graduated specification for describing event data in a common format, so that events from different sources and platforms can be handled the same way." },
    { cert: "kcna", d: "arch", type: "definition", q: "What is a cold start?", o: ["The delay on the first request when no instance is running", "The time a new node needs before it joins the cluster", "A pod that was started without any resource requests", "A restart that was caused by a failed liveness probe"], a: "The delay on the first request when no instance is running and the platform must start one, for example after a serverless workload has scaled to zero." },
    { cert: "kcna", d: "arch", type: "concept", q: "Why do open standards such as OCI, CNI and CSI matter?", o: ["They let components from different vendors work together and be swapped", "They make every Kubernetes cluster faster than proprietary systems", "They are required by law in most countries where clouds operate", "They remove the need for a container runtime on the nodes"], a: "They let components from different vendors work together and be swapped, which avoids vendor lock-in. Any OCI image runs on any OCI runtime; any CSI driver works with Kubernetes." },
    { cert: "kcna", d: "arch", type: "definition", q: "What is OpenTelemetry?", o: ["A vendor-neutral standard for producing and exporting traces, metrics and logs", "A backend that stores distributed traces and displays them as timelines", "A time-series database that scrapes and stores metrics", "A log collector that runs as a DaemonSet on every node"], a: "A CNCF graduated project: a vendor-neutral standard (APIs, SDKs, the OTLP protocol and the Collector) for producing and exporting traces, metrics and logs. It is not a storage backend." },
    { cert: "kcna", d: "arch", type: "concept", q: "How are container logs collected in Kubernetes?", o: ["Apps write to stdout and stderr, and a node agent such as Fluent Bit ships the log files", "Apps send their log lines to etcd, where the API server makes them searchable", "The API server collects the logs from every pod and stores them centrally", "kube-proxy forwards the logs of each node to the Prometheus server"], a: "Applications write to stdout and stderr, the runtime stores that in files on the node, and a node-level agent such as Fluentd or Fluent Bit (run as a DaemonSet) ships them to a central store." },
    { cert: "kcna", d: "arch", type: "definition", q: "What are the four Prometheus metric types?", o: ["Counter, gauge, histogram and summary", "Log, metric, trace and event", "Info, warning, error and critical", "Scalar, vector, matrix and string"], a: "Counter (only goes up), gauge (goes up and down), histogram (observations counted in buckets) and summary (quantiles calculated by the client)." },
    { cert: "kcna", d: "arch", type: "definition", q: "Prometheus: PromQL, Alertmanager, exporter?", o: ["PromQL: query language; Alertmanager: routes alerts; exporter: exposes metrics for another system", "PromQL: routes alerts; Alertmanager: query language; exporter: stores metrics for the long term", "PromQL: a dashboard; Alertmanager: a database; exporter: a tool that ships logs", "PromQL: scrapes targets; Alertmanager: exposes metrics; exporter: runs queries"], a: "PromQL is the query language. Alertmanager groups, silences and routes alerts to people. An exporter exposes metrics for a system that does not expose them itself (node exporter for a host)." },
    { cert: "kcna", d: "arch", type: "concept", q: "What do Thanos and Cortex add to Prometheus?", o: ["Long-term storage, high availability and a global query view", "Distributed tracing across many services", "Collection and long-term storage of container logs from every node", "Routing of alerts to chat and email"], a: "Long-term storage, high availability and one query view across many Prometheus servers. Both are CNCF incubating projects." },
    { cert: "kcna", d: "arch", type: "concept", q: "SLI vs SLO vs SLA?", o: ["SLI is the measurement, SLO the target, SLA the contract", "SLO is the measurement, SLA the target, SLI the contract", "SLA is the measurement, SLI the target, SLO the contract", "All three are names for the same uptime percentage"], a: "SLI: a measured indicator, such as the share of successful requests. SLO: the internal target for it, such as 99.9%. SLA: a contract with customers that has consequences if it is missed." },
    { cert: "kcna", d: "arch", type: "definition", q: "What is an error budget?", o: ["The amount of unreliability that an SLO allows", "The money that is set aside for incident response", "The number of bugs that a release may contain", "The hours that engineers may spend on call"], a: "The amount of unreliability an SLO allows: a 99.9% target leaves 0.1%. While budget remains, teams can release; when it is used up, the focus moves to reliability." },
    { cert: "kcna", d: "arch", type: "definition", q: "What are FinOps and OpenCost?", o: ["FinOps is the practice of managing cloud cost; OpenCost shows what Kubernetes workloads cost", "FinOps is a CNCF project that bills teams; OpenCost is a practice for reducing cloud cost", "FinOps is accounting software; OpenCost is a discount programme of the cloud providers", "FinOps is a role defined in RBAC; OpenCost is a ResourceQuota on spending"], a: "FinOps is the practice of engineering and finance managing cloud cost together. OpenCost is a CNCF incubating project that shows what Kubernetes workloads cost." },
    { cert: "kcna", d: "arch", type: "concept", q: "CNCF: TOC vs Governing Board?", o: ["The TOC makes technical decisions; the Governing Board handles business matters", "The Governing Board makes technical decisions; the TOC handles business matters", "Both of them vote on every new feature of Kubernetes", "The TOC organises KubeCon; the Governing Board reviews code"], a: "The Technical Oversight Committee makes technical decisions: it admits projects and moves them between maturity levels. The Governing Board handles business matters: budget, marketing and legal." },
    { cert: "kcna", d: "arch", type: "definition", q: "What is a CNCF TAG?", o: ["A Technical Advisory Group that supports the TOC in one area", "A label that marks the maturity level of a project", "A team of volunteers that organises KubeCon", "A Kubernetes group that owns one component"], a: "A Technical Advisory Group: experts in one area who support the TOC with reviews and guidance for projects. Examples: TAG Security and Compliance, TAG Infrastructure." },
    { cert: "kcna", d: "arch", type: "definition", q: "Kubernetes: what are a SIG, a Working Group and a KEP?", o: ["A SIG owns part of the project, a Working Group is temporary, a KEP is a design proposal", "A SIG is temporary, a Working Group owns part of the project, a KEP is a release", "A SIG is a CNCF body, a Working Group is a vendor team, a KEP is a certification", "All three are kinds of regular community meeting"], a: "A SIG (Special Interest Group) permanently owns part of the project, such as SIG Network. A Working Group is temporary and cuts across SIGs. A KEP (Kubernetes Enhancement Proposal) is the design document every significant change needs." },
    { cert: "kcna", d: "arch", type: "concept", q: "How does the CNCF relate to the Linux Foundation, and what was its first project?", o: ["The CNCF is part of the Linux Foundation; its first project was Kubernetes", "The Linux Foundation is part of the CNCF; its first project was Linux", "The two are unrelated; the CNCF's first project was Docker", "The CNCF is part of the Linux Foundation; its first project was Prometheus"], a: "The CNCF is a foundation within the Linux Foundation, started in 2015. Its first project was Kubernetes, donated by Google." },
    { cert: "kcna", d: "arch", type: "concept", q: "CLA vs DCO?", o: ["A CLA is signed once; the DCO is a sign-off line on each commit", "The DCO is signed once; a CLA is a sign-off line on each commit", "A CLA is for end users; the DCO is for vendors", "Both are kinds of open source licence"], a: "Both confirm that a contributor may submit their work. A Contributor License Agreement is signed once; Kubernetes uses one. The Developer Certificate of Origin is a Signed-off-by line on each commit, used by many other CNCF projects." },
    { cert: "kcna", d: "arch", type: "concept", q: "How can someone take part in the Kubernetes community without writing code?", o: ["Documentation, testing, issue triage and joining SIG meetings", "Only by sponsoring KubeCon or another CNCF event", "Only by working for a company that is a CNCF member", "It is not possible to take part without writing code"], a: "Documentation, testing, issue triage, translation, answering questions, and joining the open SIG meetings, Slack channels and mailing lists." },
    { cert: "kcna", d: "arch", type: "concept", q: "Which CNCF project detects threats in running containers?", o: ["Falco", "Trivy", "Harbor", "Kyverno"], a: "Falco (graduated). It watches system calls and alerts on suspicious behaviour, such as a shell started inside a container." },
    { cert: "kcna", d: "arch", type: "concept", q: "Which CNCF projects cover policy as code?", o: ["Open Policy Agent and Kyverno", "Falco and Trivy", "Argo and Flux", "Open Policy Agent and Falco"], a: "Open Policy Agent (used in Kubernetes through Gatekeeper, policies written in Rego) and Kyverno (policies written as Kubernetes resources). Both are graduated." },
    { cert: "kcna", d: "arch", type: "concept", q: "Match the project: Harbor, Rook, Envoy, CoreDNS.", o: ["Harbor: registry; Rook: storage; Envoy: proxy; CoreDNS: DNS", "Harbor: storage; Rook: registry; Envoy: DNS; CoreDNS: proxy", "Harbor: proxy; Rook: DNS; Envoy: registry; CoreDNS: storage", "Harbor: DNS; Rook: proxy; Envoy: storage; CoreDNS: registry"], a: "Harbor: image registry. Rook: storage (runs Ceph on Kubernetes). Envoy: service proxy, the data plane of many meshes. CoreDNS: cluster DNS." },
    { cert: "kcna", d: "arch", type: "concept", q: "Match the project: cert-manager, Crossplane, Backstage, Dapr.", o: ["cert-manager: certificates; Crossplane: infrastructure; Backstage: developer portal; Dapr: app building blocks", "cert-manager: developer portal; Crossplane: certificates; Backstage: app building blocks; Dapr: infrastructure", "cert-manager: infrastructure; Crossplane: app building blocks; Backstage: certificates; Dapr: developer portal", "cert-manager: app building blocks; Crossplane: developer portal; Backstage: infrastructure; Dapr: certificates"], a: "cert-manager: issues and renews TLS certificates. Crossplane: manages cloud infrastructure through the Kubernetes API. Backstage: developer portal. Dapr: building blocks for distributed applications." },
    { cert: "kcna", d: "arch", type: "concept", q: "Match the project: TUF, in-toto, Notary, SPIFFE.", o: ["TUF: secure updates; in-toto: supply chain attestations; Notary: image signing; SPIFFE: workload identity", "TUF: workload identity; in-toto: image signing; Notary: secure updates; SPIFFE: supply chain attestations", "TUF: image signing; in-toto: workload identity; Notary: supply chain attestations; SPIFFE: secure updates", "TUF: supply chain attestations; in-toto: secure updates; Notary: workload identity; SPIFFE: image signing"], a: "TUF: secure software updates. in-toto: attestations for supply chain steps. Notary: image signing. SPIFFE (with SPIRE): workload identity." },
    { cert: "kcna", d: "arch", type: "concept", q: "Which CNI plugin is built on eBPF and is a CNCF graduated project?", o: ["Cilium", "Flannel", "Calico", "Antrea"], a: "Cilium. It provides pod networking, NetworkPolicy enforcement and observability, and can replace kube-proxy." },
    { cert: "kcna", d: "arch", type: "concept", q: "Which role is described by SLOs, error budgets and reducing toil?", o: ["The Site Reliability Engineer", "The platform engineering lead", "The security engineer", "The cloud architect"], a: "The Site Reliability Engineer (SRE)." },
    { cert: "kcna", d: "arch", type: "concept", q: "What does a platform engineering team provide?", o: ["An internal developer platform with self-service tools and golden paths", "On-call support for every application team in the company", "Approval of the cloud budget of each engineering team", "Security audits of the code that application teams write"], a: "An internal developer platform: self-service tools and standard 'golden paths', so that application teams can ship software without running the infrastructure themselves." },
    { cert: "kcna", d: "arch", type: "definition", q: "What does 'shift left' mean?", o: ["Dealing with security and testing earlier in the development process", "Moving workloads to a cheaper region of the cloud provider", "Reducing the number of replicas outside business hours", "Rolling an application back to its previous release"], a: "Dealing with security (or testing) earlier in the development process, for example scanning images and checking policies in the pipeline and not just before release." },

    { cert: "kcna", d: "arch", type: "definition", q: "What is KubeCon + CloudNativeCon?", o: ["The CNCF's flagship conference", "A Kubernetes certification exam", "A CNCF project for event streaming", "A local meetup run by volunteers"], a: "The CNCF's flagship conference, held several times a year in different regions. Kubernetes Community Days are the smaller, locally organised events." },

    { cert: "kcna", d: "arch", type: "concept", q: "How does the HPA calculate the number of replicas?", o: ["ceil(currentReplicas x currentValue / targetValue)", "currentReplicas + 1 while usage is above the target", "maxReplicas x currentValue / 100, rounded up", "targetValue / currentValue, rounded down"], a: "desiredReplicas = ceil(currentReplicas x currentValue / targetValue). Example: 4 replicas at 100% CPU with a 50% target gives ceil(4 x 100 / 50) = 8." },
    { cert: "kcna", d: "arch", type: "concept", q: "Monitoring vs observability?", o: ["Monitoring watches known signals; observability lets you investigate problems nobody predicted", "Observability watches known signals; monitoring lets you investigate problems nobody predicted", "Monitoring is concerned with logs; observability is concerned only with metrics", "They are two names for the same practice and the same tools"], a: "Monitoring watches known signals and alerts on thresholds set in advance. Observability is being able to work out what is happening inside a system from its metrics, logs and traces, including for problems nobody predicted." },

    // KCSA
    { cert: "kcsa", d: "overview", type: "definition", q: "What are the 4Cs of cloud native security?", a: "Cloud, Cluster, Container, Code. Each layer builds on the security of the layer outside it." },
    { cert: "kcsa", d: "components", type: "concept", q: "In what order does the API server process a request?", a: "Authentication → Authorization (e.g. RBAC) → Mutating admission → Schema validation → Validating admission → persisted to etcd." },
    { cert: "kcsa", d: "fundamentals", type: "definition", q: "Name the three Pod Security Standards.", a: "Privileged (unrestricted), Baseline (blocks known privilege escalations), Restricted (current hardening best practice)." },
    { cert: "kcsa", d: "fundamentals", type: "concept", q: "What are the Pod Security Admission modes?", a: "enforce (reject the pod), audit (allow, add an audit annotation), warn (allow, show the user a warning). Set with namespace labels." },
    { cert: "kcsa", d: "compliance", type: "definition", q: "What does STRIDE stand for?", a: "Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege." },
    { cert: "kcsa", d: "fundamentals", type: "concept", q: "Which RBAC verbs enable privilege escalation?", a: "escalate and bind (on roles), impersonate (on users/groups/SAs), plus wildcards (*) and create on pods or on serviceaccounts/token." },
    { cert: "kcsa", d: "fundamentals", type: "concept", q: "Are Kubernetes Secrets encrypted by default?", a: "No — they are only base64-encoded in etcd. Enable encryption at rest with an EncryptionConfiguration, ideally backed by a KMS provider." },
    { cert: "kcsa", d: "fundamentals", type: "concept", q: "What happens to pod traffic when no NetworkPolicy selects the pod?", a: "All ingress and egress is allowed. A pod becomes isolated for a direction only once a policy selects it for that direction." },
    { cert: "kcsa", d: "components", type: "definition", q: "seccomp vs AppArmor?", a: "seccomp filters which syscalls a process may make. AppArmor (like SELinux) is mandatory access control restricting files, capabilities and network access." },
    { cert: "kcsa", d: "platform", type: "definition", q: "What is an SBOM?", a: "A Software Bill of Materials: a machine-readable inventory of the components in an artifact (SPDX or CycloneDX format)." },
    { cert: "kcsa", d: "compliance", type: "definition", q: "What does SLSA define?", a: "Supply-chain Levels for Software Artifacts: graded requirements for build integrity and provenance so artifacts can be traced to source." },
    { cert: "kcsa", d: "compliance", type: "command", q: "Check a cluster against the CIS Kubernetes Benchmark.", a: "kube-bench run --targets master,node" },
    { cert: "kcsa", d: "fundamentals", type: "command", q: "Check whether a ServiceAccount can read secrets.", a: "kubectl auth can-i get secrets --as=system:serviceaccount:<ns>:<sa> -n <ns>" },
    { cert: "kcsa", d: "platform", type: "concept", q: "What does Falco do?", a: "Runtime threat detection: it watches syscalls (via eBPF) and Kubernetes audit events and alerts when rules match, e.g. a shell spawned in a container." },
    { cert: "kcsa", d: "components", type: "concept", q: "Name three kubelet hardening settings.", a: "--anonymous-auth=false, --authorization-mode=Webhook, and the read-only port (10255) disabled." },

    { cert: "kcsa", d: "platform", type: "concept", q: "What does a service mesh add for security?", a: "Mutual TLS between workloads (encryption plus workload identity) and authorization policies, without changing application code." },
    { cert: "kcsa", d: "components", type: "concept", q: "Why is a kubeconfig file sensitive?", a: "It can hold client certificates, keys or tokens that grant cluster access. Protect its file permissions, prefer short-lived or exec-plugin credentials, and never commit it." },
    { cert: "kcsa", d: "components", type: "concept", q: "Why is hostPath dangerous?", a: "It mounts the node's filesystem into the pod. Writable or broad mounts (/, /var/run, the runtime socket) let a container escape to the node. Baseline Pod Security forbids it." },
    { cert: "kcsa", d: "threat", type: "concept", q: "How can a pod reach cloud credentials it was never given?", a: "Through the cloud instance metadata API (169.254.169.254) on the node. Block it with NetworkPolicy egress rules or use workload identity." },
    { cert: "kcsa", d: "platform", type: "definition", q: "What is the cluster CA used for?", a: "It signs the certificates components use to authenticate each other (API server, kubelets, etcd, clients). Anyone holding its key can mint an identity, including cluster-admin." },

    // CKA
    { cert: "cka", d: "ws", type: "command", q: "Generate a Deployment manifest without creating it.", a: "kubectl create deployment web --image=nginx --replicas=3 --dry-run=client -o yaml > web.yaml" },
    { cert: "cka", d: "arch", type: "command", q: "Take an etcd snapshot.", a: "ETCDCTL_API=3 etcdctl --endpoints=https://127.0.0.1:2379 --cacert=<ca.crt> --cert=<server.crt> --key=<server.key> snapshot save /opt/backup.db" },
    { cert: "cka", d: "tr", type: "concept", q: "Where do the control plane static pod manifests live?", a: "/etc/kubernetes/manifests/ on the control plane node. The kubelet watches the directory and recreates pods when a file changes." },
    { cert: "cka", d: "arch", type: "concept", q: "In what order do you upgrade a kubeadm control plane node?", a: "Upgrade kubeadm → kubeadm upgrade plan → kubeadm upgrade apply → drain → upgrade kubelet & kubectl → restart kubelet → uncordon." },
    { cert: "cka", d: "tr", type: "concept", q: "A node is NotReady. First three checks?", a: "systemctl status kubelet; journalctl -u kubelet; then the runtime (systemctl status containerd, crictl ps). Also kubectl describe node." },
    { cert: "cka", d: "tr", type: "concept", q: "A Service has no endpoints. Likely cause?", a: "Its selector doesn't match the pod labels, or the pods aren't Ready. Compare kubectl get svc -o wide with kubectl get pods --show-labels." },
    { cert: "cka", d: "arch", type: "command", q: "Safely empty a node for maintenance.", a: "kubectl drain <node> --ignore-daemonsets --delete-emptydir-data   (afterwards: kubectl uncordon <node>)" },
    { cert: "cka", d: "ws", type: "command", q: "Roll back a Deployment to the previous revision.", a: "kubectl rollout undo deployment/<name>" },
    { cert: "cka", d: "st", type: "concept", q: "PVC is stuck Pending. What do you check?", a: "kubectl describe pvc: missing or wrong StorageClass, no PV matching size/access mode, or volumeBindingMode WaitForFirstConsumer with no pod yet." },
    { cert: "cka", d: "ws", type: "definition", q: "The three taint effects?", a: "NoSchedule (no new pods), PreferNoSchedule (soft), NoExecute (also evicts running pods without a toleration)." },
    { cert: "cka", d: "st", type: "definition", q: "PersistentVolume reclaim policies?", a: "Retain (keep data, manual cleanup) and Delete (remove backing storage). Recycle is deprecated." },
    { cert: "cka", d: "arch", type: "command", q: "Print a fresh worker join command.", a: "kubeadm token create --print-join-command" },
    { cert: "cka", d: "sn", type: "concept", q: "Which Gateway API resources route HTTP traffic?", a: "GatewayClass (which controller), Gateway (listeners: ports, hostnames, TLS), HTTPRoute (rules attaching to a Gateway via parentRefs → backend Services)." },
    { cert: "cka", d: "tr", type: "command", q: "See why a container crashed last time.", a: "kubectl logs <pod> -c <container> --previous   and   kubectl describe pod <pod>  (Last State, Exit Code)" },
    { cert: "cka", d: "tr", type: "command", q: "List containers on a node when kubectl doesn't work.", a: "crictl ps -a   then   crictl logs <container-id>" },
    { cert: "cka", d: "sn", type: "command", q: "Test DNS resolution from inside the cluster.", a: "kubectl run dns --rm -it --image=busybox:1.36 --restart=Never -- nslookup kubernetes.default" },
    { cert: "cka", d: "arch", type: "command", q: "Install a Helm chart into its own namespace.", a: "helm repo add <name> <url> && helm install <release> <name>/<chart> -n <ns> --create-namespace" },
    { cert: "cka", d: "arch", type: "command", q: "Apply a Kustomize directory.", a: "kubectl apply -k <dir>   (preview with: kubectl kustomize <dir>)" },
    { cert: "cka", d: "sn", type: "concept", q: "A default-deny NetworkPolicy is applied and pods can't resolve names. Why?", a: "Egress is denied too, including DNS. Add an egress rule allowing UDP and TCP port 53 to the cluster DNS pods." },
    { cert: "cka", d: "ws", type: "concept", q: "An HPA shows <unknown> for its CPU target. Likely causes?", a: "metrics-server isn't installed or healthy, or the pods have no CPU requests — utilisation is measured against the request." },
    { cert: "cka", d: "arch", type: "command", q: "Let ServiceAccount ci in namespace dev list pods there.", a: "kubectl create role pod-reader --verb=get,list,watch --resource=pods -n dev && kubectl create rolebinding ci-pods --role=pod-reader --serviceaccount=dev:ci -n dev" },
    { cert: "cka", d: "tr", type: "concept", q: "How does the current CKA exam give you access to each cluster?", a: "Each task names a host. ssh to it, do the work (sudo -i if needed), then exit back to the base host before the next task." }
  ]
};

if (typeof module !== "undefined") module.exports = DATA;
