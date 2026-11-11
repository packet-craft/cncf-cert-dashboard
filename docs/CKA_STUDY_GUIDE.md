# CKA Study Guide

**Certified Kubernetes Administrator** — performance-based, 2 hours, online proctored, pass mark
66%. You solve tasks in a real terminal across several clusters. The official Kubernetes
documentation is allowed in one browser tab. Speed matters as much as knowledge.

| Domain | Weight | Suggested weeks |
|--------|-------:|-----------------|
| Troubleshooting | 30% | 7–8 |
| Cluster Architecture, Installation & Configuration | 25% | 1–3 |
| Services & Networking | 20% | 5–6 |
| Workloads & Scheduling | 15% | 3–4 |
| Storage | 10% | 5 |

Confirm the current outline and Kubernetes version at <https://github.com/cncf/curriculum>.

## Exam-day rules of thumb

1. **Switch context first.** Every task names a cluster; run the given `kubectl config use-context`
   (or `ssh`) command before anything else.
2. **Generate, don't type.** Use `--dry-run=client -o yaml` and edit the result.
3. **Skip and flag** anything that takes more than ~6 minutes; come back at the end.
4. **Verify every task** — `kubectl get`, `describe`, or a `curl` from a test pod.
5. After `ssh` to a node, remember to `exit` before the next task.

## `kubectl` imperative speed cheatsheet

```bash
# Setup (the alias and completion are usually already present)
alias k=kubectl
export do='--dry-run=client -o yaml'
export now='--force --grace-period=0'

# Pods
k run web --image=nginx --port=80 --labels=app=web $do > pod.yaml
k run tmp --rm -it --image=busybox:1.36 --restart=Never -- sh

# Workloads
k create deployment web --image=nginx --replicas=3 $do > deploy.yaml
k set image deployment/web nginx=nginx:1.27
k rollout status|history|undo deployment/web
k scale deployment web --replicas=5
k autoscale deployment web --min=2 --max=5 --cpu-percent=70
k create job hello --image=busybox -- echo hi
k create cronjob tick --image=busybox --schedule='*/5 * * * *' -- date

# Config
k create configmap app-cfg --from-literal=MODE=prod --from-file=app.conf
k create secret generic db --from-literal=password=s3cr3t

# Networking
k expose deployment web --port=80 --target-port=8080 --type=NodePort
k create ingress web --rule='app.example.com/*=web:80' --class=nginx

# RBAC
k create serviceaccount ci -n dev
k create role pod-reader --verb=get,list,watch --resource=pods -n dev
k create rolebinding read-pods --role=pod-reader --serviceaccount=dev:ci -n dev
k auth can-i list pods --as=system:serviceaccount:dev:ci -n dev

# Nodes
k cordon|uncordon <node>
k drain <node> --ignore-daemonsets --delete-emptydir-data
k taint nodes <node> key=value:NoSchedule      # append '-' to remove
k label nodes <node> disktype=ssd

# Finding things
k explain pod.spec.affinity --recursive | less
k get pods -A -o wide --sort-by=.spec.nodeName
k get events -A --sort-by=.lastTimestamp
k get pod web -o jsonpath='{.status.podIP}'
k api-resources | grep -i <kind>
```

There is no imperative generator for PersistentVolume, PersistentVolumeClaim, NetworkPolicy,
StorageClass or Gateway API objects — copy a snippet from the docs and edit it.

## Cluster architecture reference

```
Control plane node                         Worker node
┌──────────────────────────────┐          ┌─────────────────────────┐
│ kube-apiserver  :6443        │◄─────────│ kubelet        :10250   │
│ etcd            :2379-2380   │          │ kube-proxy              │
│ kube-scheduler  :10259       │          │ containerd (CRI)        │
│ kube-controller-manager      │          │ CNI plugin              │
│                 :10257       │          │ pods                    │
│ kubelet + containerd         │          └─────────────────────────┘
└──────────────────────────────┘
```

| Path | Contents |
|------|----------|
| `/etc/kubernetes/manifests/` | Static pod manifests: apiserver, etcd, scheduler, controller-manager |
| `/etc/kubernetes/pki/` | Cluster CA and component certificates (`etcd/` subfolder for etcd) |
| `/etc/kubernetes/admin.conf` | Admin kubeconfig |
| `/var/lib/kubelet/config.yaml` | Kubelet configuration (includes `staticPodPath`) |
| `/var/lib/etcd/` | etcd data directory |
| `/etc/cni/net.d/`, `/opt/cni/bin/` | CNI configuration and binaries |
| `/var/log/pods/`, `/var/log/containers/` | Container logs on the node |

On a kubeadm cluster the control plane components are **static pods**: edit the manifest and the
kubelet restarts the component. The kubelet itself is a **systemd service**.

## Hands-on lab exercises

Do each lab until you can finish it without notes. Use a kubeadm cluster on VMs (or
[killercoda](https://killercoda.com) playgrounds) — kind and minikube hide the parts the exam tests.

### Lab 1 — Bootstrap a cluster with kubeadm

1. On all nodes: disable swap, load `overlay` and `br_netfilter`, set
   `net.ipv4.ip_forward=1`, install containerd (systemd cgroup driver), kubeadm, kubelet, kubectl.
2. `kubeadm init --pod-network-cidr=10.244.0.0/16`; copy `admin.conf` to `~/.kube/config`.
3. Install a CNI plugin; wait for the node to become `Ready`.
4. `kubeadm token create --print-join-command`; run the output on each worker.

**Verify:** `kubectl get nodes` shows all nodes `Ready`.

### Lab 2 — Upgrade the cluster one minor version

Control plane node:

```bash
# point the apt repo at the new minor version, then:
apt-get update && apt-get install -y kubeadm=<version>
kubeadm upgrade plan
kubeadm upgrade apply v<version>
kubectl drain <cp-node> --ignore-daemonsets
apt-get install -y kubelet=<version> kubectl=<version>
systemctl daemon-reload && systemctl restart kubelet
kubectl uncordon <cp-node>
```

Workers: same, but `kubeadm upgrade node` instead of `plan`/`apply`, and run `drain`/`uncordon`
from a machine with cluster access.

**Verify:** `kubectl get nodes` shows the new version on every node.

### Lab 3 — Back up and restore etcd

```bash
# Find endpoints and cert paths
grep -E 'listen-client-urls|cert-file|key-file|trusted-ca-file' /etc/kubernetes/manifests/etcd.yaml

ETCDCTL_API=3 etcdctl --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key \
  snapshot save /opt/etcd-backup.db

# Create something, then restore to prove it disappears
kubectl create deployment after-backup --image=nginx
etcdutl snapshot restore /opt/etcd-backup.db --data-dir=/var/lib/etcd-restore
#   (on older etcd versions: etcdctl snapshot restore … with the same flags)

# Point etcd at the restored data: edit the hostPath of the etcd-data volume
vi /etc/kubernetes/manifests/etcd.yaml      # path: /var/lib/etcd-restore
```

**Verify:** after etcd and the API server restart, `after-backup` is gone.

### Lab 4 — RBAC for a ServiceAccount

Create ServiceAccount `deployer` in namespace `apps` that can create and update Deployments there
and nothing else.

**Verify:**
`kubectl auth can-i create deployments --as=system:serviceaccount:apps:deployer -n apps` → `yes`;
the same for `delete pods` → `no`.

### Lab 5 — Scheduling

1. Taint a node `dedicated=batch:NoSchedule`; run a pod that tolerates it **and** is pinned there
   with node affinity.
2. Create a static pod by dropping a manifest into `/etc/kubernetes/manifests/` on a worker.
3. Create a PriorityClass and assign it to a Deployment.

**Verify:** `kubectl get pod -o wide` shows the expected node; the static pod's name ends in
`-<node-name>`.

### Lab 6 — Rolling update, rollback, autoscaling

Deploy `nginx:1.26` with 4 replicas, update to `1.27` with `maxUnavailable: 1`, update to a
non-existent tag, watch it stall, then `kubectl rollout undo`. Add an HPA targeting 70% CPU
(requires metrics-server and CPU requests).

### Lab 7 — Storage

1. Create a StorageClass with `volumeBindingMode: WaitForFirstConsumer`.
2. Create a 1Gi `hostPath` PV with `ReadWriteOnce` and reclaim policy `Retain`.
3. Create a PVC that binds to it and mount it in a pod at `/data`.
4. Write a file, delete the pod, recreate it and confirm the file is still there.

**Verify:** `kubectl get pv,pvc` shows `Bound`.

### Lab 8 — Services, Ingress and Gateway API

1. Expose a Deployment as ClusterIP and NodePort; `curl` both.
2. Install an ingress controller and route `app.example.com/` to the Service.
3. Install a Gateway API implementation; create a `Gateway` and an `HTTPRoute` for the same
   backend.

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata: { name: web }
spec:
  parentRefs: [{ name: main-gateway }]
  hostnames: ["app.example.com"]
  rules:
    - matches: [{ path: { type: PathPrefix, value: / } }]
      backendRefs: [{ name: web, port: 80 }]
```

### Lab 9 — NetworkPolicy

Apply a default-deny ingress policy to a namespace, then allow only pods labelled `role=frontend`
to reach `app=api` on TCP 8080.

**Verify:** `curl -m 3` succeeds from a `role=frontend` pod and times out from any other pod.

### Lab 10 — Break-and-fix

Have a study partner (or a script) break the cluster, then repair it against the clock:

- Stop and disable the kubelet on a worker.
- Put a typo in the `image` or a flag in `/etc/kubernetes/manifests/kube-apiserver.yaml`.
- Change the scheduler's kubeconfig path.
- Change a Service's selector or `targetPort`.
- Scale CoreDNS to 0.
- Set a wrong CA path in `/var/lib/kubelet/config.yaml`.

## Troubleshooting patterns

Work **outside-in**: cluster → node → pod → container → application.

### Pod states

| Symptom | Likely cause | Check |
|---------|--------------|-------|
| `Pending` | No node fits: resources, taints, affinity, unbound PVC | `kubectl describe pod` → Events |
| `ImagePullBackOff` / `ErrImagePull` | Wrong image or tag, missing `imagePullSecrets` | Events |
| `CrashLoopBackOff` | App exits: bad command, config, failing liveness probe | `kubectl logs --previous` |
| `OOMKilled` (exit 137) | Memory limit too low | `describe pod` → Last State |
| `CreateContainerConfigError` | Missing ConfigMap or Secret | Events |
| `Running` but not `Ready` | Readiness probe failing | `describe pod`, probe port and path |
| `ContainerCreating` (stuck) | Volume mount or CNI failure | Events, CNI pods in `kube-system` |

### Node `NotReady`

```bash
kubectl describe node <node>          # Conditions, taints
ssh <node>
systemctl status kubelet              # stopped? → systemctl enable --now kubelet
journalctl -u kubelet --no-pager | tail -50
systemctl status containerd
crictl ps -a
df -h; free -m                        # disk or memory pressure
```

Common causes: kubelet stopped; wrong path in `/var/lib/kubelet/config.yaml` or
`/etc/kubernetes/kubelet.conf`; expired certificates; container runtime down; CNI not installed.

### Control plane down (`kubectl` refuses to connect)

```bash
crictl ps -a | grep -E 'apiserver|etcd|scheduler|controller'
crictl logs <container-id>
ls /etc/kubernetes/manifests/
journalctl -u kubelet | grep -i -E 'apiserver|manifest'
```

Look for YAML syntax errors, wrong certificate paths, wrong etcd endpoint, or a wrong `hostPath`
in the static pod manifest. After saving a fix, wait up to a minute for the kubelet to recreate the
pod.

### Service not reachable

1. `kubectl get endpointslices -l kubernetes.io/service-name=<svc>` — empty? Then the selector does
   not match pod labels, or pods are not Ready.
2. `targetPort` equals the container's listening port?
3. From a test pod: `curl <pod-ip>:<port>` works but `curl <svc>` does not → kube-proxy
   (`kubectl -n kube-system get pods -l k8s-app=kube-proxy`).
4. Name does not resolve → CoreDNS pods, `kube-dns` Service, Corefile ConfigMap.
5. Works by IP inside the namespace but not across → NetworkPolicy.

### PVC `Pending`

`kubectl describe pvc`: no matching PV (size, access mode, `storageClassName`), StorageClass does
not exist, or `WaitForFirstConsumer` with no pod using the claim yet.

### Certificates

```bash
kubeadm certs check-expiration
kubeadm certs renew all        # then restart the control plane static pods
openssl x509 -in /etc/kubernetes/pki/apiserver.crt -noout -dates -subject
```

## Eight-week plan

| Week | Focus |
|------|-------|
| 1 | Node preparation, kubeadm bootstrap, kubeconfig (Lab 1) |
| 2 | Upgrade, etcd backup/restore, RBAC, HA concepts (Labs 2–4) |
| 3 | Helm, Kustomize, CRDs; Deployments, ConfigMaps, Secrets |
| 4 | Scheduling, probes, autoscaling, quotas (Labs 5–6) |
| 5 | Storage; Service types and pod networking (Lab 7) |
| 6 | NetworkPolicy, Ingress, Gateway API, CoreDNS (Labs 8–9) |
| 7 | Troubleshooting nodes, control plane and pods (Lab 10) |
| 8 | Troubleshooting networking; two timed mock exams; review misses |

## Study resources

- Official curriculum: <https://github.com/cncf/curriculum>
- Exam page and candidate handbook: <https://training.linuxfoundation.org/certification/certified-kubernetes-administrator-cka/>
- Kubernetes docs — Tasks: <https://kubernetes.io/docs/tasks/>
- kubectl quick reference: <https://kubernetes.io/docs/reference/kubectl/quick-reference/>
- kubeadm upgrade guide: <https://kubernetes.io/docs/tasks/administer-cluster/kubeadm/kubeadm-upgrade/>
- Gateway API: <https://gateway-api.sigs.k8s.io>
- killer.sh simulator — two sessions are included with exam registration
- Killercoda CKA scenarios: <https://killercoda.com>
