# End-to-End DevOps Pipeline Guide on WSL

This guide walks you through setting up your DevOps pipeline entirely within Windows Subsystem for Linux (WSL). We'll go from installing WSL to deploying your application via ArgoCD and monitoring it with Grafana.

> [!IMPORTANT]  
> Before starting, ensure virtualization is enabled in your BIOS/UEFI settings, as WSL 2 requires it.

---

## 1. Environment Setup (WSL & Core Tools)

First, we need to get your WSL environment ready with Ubuntu and the necessary CLI tools.

### Install WSL 2 (If not already installed)
Open your Windows Command Prompt or PowerShell **as Administrator** and run:
```powershell
wsl --install
```
*Restart your computer if prompted.* By default, this installs Ubuntu.

### Install Docker Desktop
For the best experience on Windows:
1. Download and install [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows/).
2. Open Docker Desktop settings -> **General** -> Check **"Use the WSL 2 based engine"**.
3. Go to **Resources** -> **WSL Integration** -> Toggle on integration for your Ubuntu distro.

### Install Kubernetes Tools (in WSL Ubuntu Terminal)
Open your Ubuntu terminal and install `kubectl`, `minikube` (for local Kubernetes), and `helm`:

```bash
# Update packages
sudo apt-get update && sudo apt-get install -y curl wget apt-transport-https

# Install Kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Install Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Install Helm
curl -fsSL -o get_helm.sh https://raw.githubusercontent.com/helm/helm/main/scripts/get-helm-3
chmod 700 get_helm.sh
./get_helm.sh
```

---

## 2. Docker: Build & Push Images

Now, let's build your backend and frontend applications and push them to Docker Hub.

```bash
# 1. Login to Docker Hub (Enter your username and password when prompted)
docker login

# 2. Build the Backend Image
docker build -t <your-dockerhub-username>/epiguard-backend:latest ./epiguard-backend

# 3. Build the Frontend Image (assuming the directory is named 'epiguard')
docker build -t <your-dockerhub-username>/epiguard-frontend:latest ./epiguard

# 4. Push images to Docker Hub
docker push <your-dockerhub-username>/epiguard-backend:latest
docker push <your-dockerhub-username>/epiguard-frontend:latest
```
> [!TIP]
> Update your Kubernetes deployment manifests in the `k8s/` folder so the `image:` fields point to your newly pushed `<your-dockerhub-username>/epiguard...` images instead of local ones.

---

## 3. Jenkins & SonarQube Setup

We will run Jenkins and SonarQube as Docker containers inside WSL.

### Start SonarQube
```bash
docker run -d --name sonarqube -p 9000:9000 sonarqube:lts-community
```
- Access it at `http://localhost:9000` (Default credentials: `admin` / `admin`).
- Go to **My Account -> Security** and generate a token for Jenkins.

### Start Jenkins
```bash
docker run -d --name jenkins -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts
```
- Retrieve the initial admin password:
  ```bash
  docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
  ```
- Access it at `http://localhost:8080`, paste the password, and install suggested plugins.

### Connect Jenkins and SonarQube
1. In Jenkins, go to **Manage Jenkins -> Plugins** and install the **SonarQube Scanner** plugin.
2. Go to **Manage Jenkins -> Credentials** and add the SonarQube token you generated earlier as a "Secret text".
3. Go to **Manage Jenkins -> System** -> Find **SonarQube servers**, add the URL (`http://<your-wsl-ip>:9000` or `http://host.docker.internal:9000`) and attach the credential.

---

## 4. Kubernetes Cluster Initialization

Start your local Kubernetes cluster using Minikube:
```bash
# Start minikube with sufficient resources
minikube start --cpus=4 --memory=8192

# Verify it's running
kubectl get nodes
```

---

## 5. GitOps with ArgoCD

ArgoCD will monitor your Git repository and automatically deploy changes to your Kubernetes cluster.

### Install ArgoCD
```bash
# Create namespace and install ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Wait for pods to be ready
kubectl get pods -n argocd -w
```

### Access ArgoCD Dashboard
```bash
# Get the auto-generated admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d; echo

# Port forward to access the UI locally
kubectl port-forward svc/argocd-server -n argocd 8080:443
```
- Open `https://localhost:8080` (Accept the self-signed certificate risk).
- Login with username `admin` and the password retrieved above.

### Connect your Repository
Run the following to apply your existing ArgoCD application manifest:
```bash
kubectl apply -f k8s/argocd-application.yaml
```
ArgoCD will now sync the manifests in your repository to the cluster!

---

## 6. Monitoring with Prometheus & Grafana

We'll use Helm to easily deploy the complete Prometheus monitoring stack.

### Install Kube-Prometheus-Stack
```bash
# Add the Prometheus community Helm repository
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
helm repo update

# Install the stack using your existing values file
helm install monitoring prometheus-community/kube-prometheus-stack \
  -n monitoring --create-namespace \
  -f k8s/monitoring/kube-prometheus-stack-values.yaml
```

### Access Grafana
```bash
# Port forward to access Grafana locally
kubectl port-forward -n monitoring svc/monitoring-grafana 3000:80
```
- Open `http://localhost:3000`.
- The default credentials are `admin` / `prom-operator` (unless changed in your `kube-prometheus-stack-values.yaml`).

> [!NOTE]  
> In your Jenkins pipeline (Jenkinsfile), your continuous delivery (CD) step won't directly run `kubectl apply`. Instead, the pipeline will update the image tag in your Git repository's `k8s/` manifests, and ArgoCD will automatically detect the Git change and sync it to the cluster!
