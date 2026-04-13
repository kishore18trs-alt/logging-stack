# 🪵 Self-Hosted Logging Stack

A lightweight, self-hosted logging solution with browser-accessible dashboards for viewing and filtering logs — built using Docker Compose.

## 🌐 Live Dashboards

| Tool | URL | Purpose |
|---|---|---|
| **Grafana** | http://localhost:3000 | Log visualization & querying |
| **Dozzle** | http://localhost:8080 | Live container log viewer |

---

## 🔍 Tool Evaluation

### Tools Researched

#### 1. Dozzle ✅ (Deployed)
- **What it is:** A real-time Docker container log viewer with a minimal web UI
- **Pros:** Zero config, runs in one command, extremely lightweight (~10MB), instant live logs
- **Cons:** No log persistence (logs vanish on restart), no search across time, no alerting
- **RAM usage:** ~20MB
- **Best for:** Quick debugging during development

#### 2. Grafana Loki ✅ (Deployed)
- **What it is:** A full log aggregation stack (Promtail + Loki + Grafana)
- **Pros:** Persistent log storage, powerful search/filter, industry-standard, great dashboards
- **Cons:** Three components to set up, slightly more complex config
- **RAM usage:** ~400–600MB
- **Best for:** Dev and production environments, team use

#### 3. Graylog ❌ (Not deployed — too heavy)
- **What it is:** Enterprise-grade log management platform
- **Pros:** Very feature-rich, alerting, role-based access, dashboards
- **Cons:** Requires MongoDB + OpenSearch + Graylog = 3 heavy services, needs 4GB+ RAM
- **RAM usage:** ~2–4GB
- **Best for:** Large-scale enterprise environments

#### 4. SigNoz ❌ (Not deployed — too heavy)
- **What it is:** Full observability platform (logs + metrics + traces)
- **Pros:** Modern UI, OpenTelemetry native, all-in-one observability
- **Cons:** Requires ClickHouse + Kafka + Zookeeper + 5 more services, needs 3GB+ RAM
- **RAM usage:** ~2–3GB
- **Best for:** Teams needing full observability (not just logging)

---

## ✅ Why We Chose Grafana Loki + Dozzle

| Requirement | Grafana Loki | Dozzle |
|---|---|---|
| Browser dashboard | ✅ | ✅ |
| Log persistence | ✅ | ❌ |
| Search & filter | ✅ Advanced | ❌ Basic |
| Lightweight | ✅ | ✅ Very |
| Zero config | ❌ Small config | ✅ |
| Docker support | ✅ | ✅ |

**Decision:** Grafana Loki is the primary logging solution — it stores logs persistently, supports powerful querying, and scales to production. Dozzle complements it as a quick live viewer during development. Graylog and SigNoz were evaluated but ruled out as too resource-heavy for a dev environment.

---

## 🏗️ Architecture

```
Docker Containers (your apps)
         ↓
      Promtail          ← collects logs
         ↓
        Loki            ← stores & indexes logs
         ↓
      Grafana           ← browser dashboard (localhost:3000)

+ Dozzle               ← live log viewer (localhost:8080)
```

---

## 📁 Project Structure

```
logging-stack/
├── docker-compose.yml       ← defines Loki + Promtail + Grafana
├── loki-config.yml          ← Loki configuration
├── promtail-config.yml      ← Promtail log collection config
└── README.md                ← this file
```

---

## 🚀 Setup Instructions

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running
- Windows / Mac / Linux supported

### Step 1 — Clone the Repo

```bash
git clone https://github.com/YOUR_USERNAME/logging-stack.git
cd logging-stack
```

### Step 2 — Start the Grafana Loki Stack

```bash
docker compose up -d
```

Wait ~30 seconds for all containers to start.

### Step 3 — Verify All Containers Are Running

```bash
docker compose ps
```

Expected output:
```
NAME       STATUS
grafana    Up
loki       Up
promtail   Up
```

### Step 4 — Open Grafana Dashboard

Go to: **http://localhost:3000**

Login with:
- Username: `admin`
- Password: `admin123`

### Step 5 — Connect Loki Data Source

1. Click ☰ menu → **Connections** → **Data Sources**
2. Click **Add data source** → Search **Loki**
3. Set URL to: `http://loki:3100`
4. Click **Save & Test** → should show ✅ connected

### Step 6 — View Logs

1. Click ☰ menu → **Explore**
2. Select **Loki** as data source
3. Click **Code** and type: `{job="docker-containers"}`
4. Click **Run query**

---

## 🐳 Run Dozzle (Live Log Viewer)

```bash
docker run -d --name dozzle \
  --restart unless-stopped \
  -p 8080:8080 \
  -e DOCKER_HOST=tcp://host.docker.internal:2375 \
  amir20/dozzle:latest
```

Then open: **http://localhost:8080**

> **Note for Windows:** Enable "Expose daemon on tcp://localhost:2375" in Docker Desktop → Settings → General

---

## 🛑 Stop Everything

```bash
docker compose down
docker rm -f dozzle
```

---

## 🔎 Querying Logs in Grafana

| Query | What it shows |
|---|---|
| `{job="docker-containers"}` | All container logs |
| `{job="docker-containers"} \|= "error"` | Only error logs |
| `{job="docker-containers"} \|= "warn"` | Only warnings |
| `{container="loki"}` | Loki container logs only |
| `{container="grafana"}` | Grafana container logs only |

---

## 📊 Resource Usage Comparison

| Tool | RAM | Setup Time | Persistence |
|---|---|---|---|
| Dozzle | ~20MB | 1 minute | ❌ |
| Grafana Loki | ~500MB | 15 minutes | ✅ |
| Graylog | ~3GB | 45 minutes | ✅ |
| SigNoz | ~2.5GB | 60 minutes | ✅ |

---

## 👥 Team Reproduction

Anyone on the team can reproduce this setup by:
1. Installing Docker Desktop
2. Cloning this repo
3. Running `docker compose up -d`
4. Opening http://localhost:3000

Total setup time: **~5 minutes**