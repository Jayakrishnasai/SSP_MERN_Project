<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f2027,100:2c5364&height=240&section=header&text=SSP%20MERN%20PROJECT&fontSize=45&fontColor=ffffff&animation=fadeIn&fontAlignY=35"/>

<img src="https://readme-typing-svg.herokuapp.com?size=26&duration=2500&color=00F7FF&center=true&vCenter=true&width=900&lines=Production-Ready+MERN+Stack+Application;CI/CD+Pipeline+with+GitHub+Actions;SonarCloud+Code+Quality+%26+Coverage;Dockerized+Deployment+on+AWS+EC2"/>

<br>

### ⚡ Perseverance Software Training Institute Platform  
<b>🚀 Full Stack + DevOps + Cloud + Quality Engineering</b>

<br>

<img src="https://img.shields.io/badge/BUILD-PASSING-success?style=for-the-badge"/>
<img src="https://img.shields.io/badge/COVERAGE-80%25-brightgreen?style=for-the-badge"/>
<img src="https://img.shields.io/badge/DOCKERIZED-YES-blue?style=for-the-badge"/>
<img src="https://img.shields.io/badge/CI/CD-ACTIVE-orange?style=for-the-badge"/>

<br><br>

<img src="https://skillicons.dev/icons?i=react,nodejs,express,mongodb,docker,nginx,aws,github,linux" />

</div>

---

# 🌟 PROJECT OVERVIEW

This is a **production-grade MERN stack monorepo application** engineered with:

✔ Scalability  
✔ Maintainability  
✔ Automated CI/CD  
✔ Code Quality Enforcement  
✔ Containerized Deployment  

---

# 🔥 CORE FEATURES

### 🎯 Application Layer
- Responsive React UI
- CRUD Operations (Courses)
- RESTful API architecture
- Input validation & centralized error handling

### ⚙️ Backend Engineering
- Modular Express architecture
- Mongoose ODM with schema validation
- Structured routing & service logic
- Health check endpoints

### 🐳 DevOps Excellence
- Fully Dockerized (Frontend + Backend + DB)
- Nginx reverse proxy (frontend serving)
- Multi-container orchestration (Docker Compose)

### 🚀 CI/CD & Automation
- GitHub Actions pipeline
- SonarCloud integration
- Automated testing & coverage
- Docker image build + deploy

---

# 🧠 SYSTEM ARCHITECTURE

```text
        ┌──────────────┐
        │   Browser    │
        └──────┬───────┘
               │
               ▼
     ┌────────────────────┐
     │  NGINX (Frontend)  │
     │   React App (:80)  │
     └────────┬───────────┘
              │ API Calls
              ▼
     ┌────────────────────┐
     │   Node.js Backend  │
     │   Express (:3100)  │
     └────────┬───────────┘
              │
              ▼
     ┌────────────────────┐
     │     MongoDB        │
     └────────────────────┘
```

---

# 🔄 REQUEST FLOW

```text
1. User hits frontend (React via Nginx)
2. API request sent → /courses
3. Express validates request
4. Mongoose interacts with MongoDB
5. Response returned → UI updates
```

---

# 🛠️ TECH STACK

## 🎨 Frontend
- React 17
- Tailwind CSS
- Axios
- React Testing Library

## ⚙️ Backend
- Node.js 20
- Express.js
- Mongoose
- Jest

## 🧪 Testing & Quality
- Jest (Backend)
- RTL (Frontend)
- LCOV Coverage Reports
- SonarCloud Analysis

## 🚀 DevOps & Cloud
- Docker & Docker Compose
- GitHub Actions (CI/CD)
- SonarCloud
- AWS EC2 Deployment
- Nginx

---

# 📁 PROJECT STRUCTURE

```text
SSP_MERN_Project/
│
├── backend/
│   ├── db.js
│   ├── index.js
│   ├── models/
│   ├── routes/
│   └── tests/
│
├── frontend/
│
├── docs/
│   └── CODEBASE_DOCUMENTATION.md
│
├── .github/workflows/
│   └── ci-cd.yml
│
├── docker-compose.yml
├── sonar-project.properties
└── README.md
```

---

# 🚀 GETTING STARTED

```bash
git clone https://github.com/Jayakrishnasai/SSP_MERN_Project.git
cd SSP_MERN_Project
```

---

# 🐳 RUN WITH DOCKER

```bash
docker compose up -d --build
```

---

# 🌐 APPLICATION ACCESS

| Service   | URL |
|----------|-----|
| Frontend | http://localhost |
| Backend  | http://localhost:3100/courses |
| Health   | http://localhost:3100/health |

---

# 📡 API ENDPOINTS

| Method | Endpoint        | Description        |
|--------|---------------|--------------------|
| GET    | /courses      | Fetch all courses  |
| POST   | /courses      | Create course      |
| PUT    | /courses/:id  | Update course      |
| DELETE | /courses/:id  | Delete course      |

---

# 🧪 TESTING & COVERAGE

## Backend
```bash
cd backend
npm test -- --runInBand
```

## Frontend
```bash
cd frontend
npm test -- --coverage
```

✔ Coverage uploaded to SonarCloud  
✔ Uses LCOV reports  

---

# ⚙️ CI/CD PIPELINE (GitHub Actions)

## 🔄 PIPELINE FLOW

```text
1. Checkout Code
2. Install Dependencies
3. Run Tests
4. Generate Coverage Reports
5. SonarCloud Analysis
6. Docker Build
7. Push to Registry
8. Deploy to AWS EC2
```

---

# 📊 SONARCLOUD INTEGRATION

✔ Code Smell Detection  
✔ Security Vulnerability Scan  
✔ Coverage Threshold Enforcement (≥80%)  
✔ Maintainability Rating  

### Coverage Sources

```text
backend/coverage/lcov.info
frontend/coverage/lcov.info
```

---

# ☁️ DEPLOYMENT FLOW (AWS EC2)

```text
1. Build Docker Images
2. Tag using commit SHA
3. Push to registry
4. SSH into EC2
5. Pull latest images
6. Restart containers
```

---

# 🔒 SECURITY BEST PRACTICES

- MongoDB not publicly exposed
- Secrets stored in GitHub Secrets
- No hardcoded credentials
- Immutable Docker image tagging
- Environment-based configs

---

# 📚 DOCUMENTATION

- docs/CODEBASE_DOCUMENTATION.md  
- backend/README.md  

---

# 🎬 SYSTEM VISUAL (ANIMATION)

<div align="center">
<img src="https://media.giphy.com/media/qgQUggAC3Pfv687qPC/giphy.gif" width="500"/>
</div>

---

# 🏆 PROJECT QUALITY METRICS

| Metric        | Status |
|--------------|--------|
| Build        | ✅ Passing |
| Coverage     | ✅ ≥ 80% |
| Code Quality | ✅ Sonar Verified |
| Deployment   | ✅ Automated |

---

# 📄 LICENSE

ISC

---

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:0f2027,100:2c5364&height=120&section=footer"/>

### 💙 ENGINEERED WITH PRECISION | BUILT FOR SCALE

<img src="https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge"/>

</div>
