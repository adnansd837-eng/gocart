# GoCart Kubernetes (k8s) Deployment Guide 🚢☸️

This directory contains production-ready Kubernetes manifests for deploying the GoCart platform.

---

## 📁 Manifests Overview

1. `configmap-secrets.yaml`: Centralized configuration and database secrets.
2. `postgres.yaml`: PersistentVolumeClaim, PostgreSQL Deployment, and Service.
3. `migration-job.yaml`: One-shot Job to push schema migrations and seed initial data.
4. `backend.yaml`: Scalable Backend Deployment with `livenessProbe` and `readinessProbe` checking `/api/health`.
5. `frontend.yaml`: Scalable Frontend Next.js Deployment with health checks and `NodePort: 30080`.

---

## 🚀 Quick Deployment with kubectl

### 1. Build & Tag Container Images
```bash
# Build Backend
docker build -t gocart-backend:latest ./backend

# Build Frontend
docker build -t gocart-frontend:latest ./frontend
```

### 2. Apply Config & Database
```bash
kubectl apply -f k8s/configmap-secrets.yaml
kubectl apply -f k8s/postgres.yaml
```

Wait for PostgreSQL pod to be ready:
```bash
kubectl wait --for=condition=ready pod -l app=gocart-postgres --timeout=60s
```

### 3. Run Database Migration & Seeder Job
```bash
kubectl apply -f k8s/migration-job.yaml
kubectl wait --for=condition=complete job/gocart-db-migration --timeout=60s
```

### 4. Deploy Backend & Frontend
```bash
kubectl apply -f k8s/backend.yaml
kubectl apply -f k8s/frontend.yaml
```

### 5. Verify Pods & Services
```bash
kubectl get pods -o wide
kubectl get svc
```

Access the frontend via your cluster IP or NodePort: `http://<Node-IP>:30080`.
