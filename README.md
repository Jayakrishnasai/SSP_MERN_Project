<div align="center">

# SSP MERN Project

### Perseverance Software Training Institute Platform

<p>
  <b>A modern, production-ready MERN application built with scalability, clean UI, Dockerized delivery, and GitHub Actions based CI/CD.</b>
</p>

<p>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white" alt="Nginx" />
</p>

<p>
  <img src="https://img.shields.io/badge/GitHub_Actions-CI%2FCD-2088FF?style=flat-square&logo=githubactions&logoColor=white" alt="GitHub Actions" />
  <img src="https://img.shields.io/badge/SonarCloud-Code_Quality-F3702A?style=flat-square&logo=sonarcloud&logoColor=white" alt="SonarCloud" />
  <img src="https://img.shields.io/badge/AWS-EC2-FF9900?style=flat-square&logo=amazonaws&logoColor=white" alt="AWS EC2" />
</p>

</div>

---

## Overview

This project powers a modern training institute platform for Perseverance Software Training Institute. It combines a polished React frontend, an Express API, MongoDB persistence, Dockerized deployment, and automated CI/CD.

### Highlights

- Responsive React landing page
- CRUD-powered enrollment interest list
- Express REST API with validation and centralized error handling
- MongoDB persistence with Mongoose
- Dockerized frontend and backend services
- SonarCloud quality checks with backend and frontend coverage
- GitHub Actions pipeline for test, analysis, image build, and deployment

---

## Architecture

```text
Browser -> Frontend (Nginx :80) -> Backend API (Express :3100) -> MongoDB
```

### Request Flow

1. The browser loads the frontend.
2. The frontend sends requests to `/courses`.
3. The backend validates input and performs CRUD operations.
4. MongoDB stores and returns task data.
5. The frontend updates the UI with the latest state.

---

## Tech Stack

### Frontend

- React 17
- Tailwind CSS
- Axios
- React Testing Library

### Backend

- Node.js 20
- Express
- Mongoose
- Jest

### DevOps

- Docker
- Docker Compose
- GitHub Actions
- SonarCloud
- AWS EC2

---

## Project Structure

```text
SSP_MERN_Project/
|-- backend/
|   |-- db.js
|   |-- index.js
|   |-- models/
|   |   `-- task.js
|   |-- routes/
|   |   `-- courses.js
|   `-- tests/
|-- frontend/
|   |-- public/
|   `-- src/
|       |-- components/
|       |-- services/
|       |-- App.js
|       `-- courses.js
|-- docs/
|   `-- CODEBASE_DOCUMENTATION.md
|-- .github/workflows/
|   `-- cicd.yml
|-- docker-compose.yml
`-- sonar-project.properties
```

---

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/Jayakrishnasai/SSP_MERN_Project.git
cd SSP_MERN_Project
```

### Prerequisites

- Node.js 20+
- npm
- Docker and Docker Compose
- MongoDB if running the backend outside Docker

---

## Run Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend default URL:

```text
http://localhost:3100
```

### Frontend

```bash
cd frontend
npm install
npm start
```

Frontend development URL:

```text
http://localhost:3000
```

---

## Run with Docker

### Start the Full Stack

```bash
docker compose up -d --build
```

### Stop the Full Stack

```bash
docker compose down
```

### Reset Volumes

```bash
docker compose down -v
```

### Default Access

- Frontend: `http://localhost`
- Backend API: `http://localhost:3100/courses`
- Backend health: `http://localhost:3100/health`

---

## Environment Variables

### Backend

- `PORT`
- `DB_CONN_STR`
- `USE_DB_AUTH`
- `DB_USERNAME`
- `DB_PASSWORD`
- `FRONTEND_URL`

### Frontend

- `REACT_APP_BACKEND_URL`

---

## API Endpoints

Base path:

```text
/courses
```

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `GET` | `/courses` | Fetch all interests |
| `POST` | `/courses` | Create a new interest |
| `PUT` | `/courses/:id` | Update a task or completion state |
| `DELETE` | `/courses/:id` | Delete an interest |

### Example Payload

```json
{
  "task": "Cloud Architect",
  "completed": false
}
```

---

## Testing

### Backend

```bash
cd backend
npm test -- --runInBand
```

### Frontend

```bash
cd frontend
npm test -- --watchAll=false --coverage --runInBand
```

### Frontend Build

```bash
cd frontend
npm run build
```

---

## CI/CD Pipeline

The GitHub Actions workflow currently runs:

1. Quality Check
2. Sonar Analysis
3. Docker Build and Push
4. Deploy to EC2

### Quality Check Includes

- backend dependency install
- backend tests with coverage
- frontend dependency install
- frontend tests with coverage
- frontend production build
- LCOV upload for SonarCloud

### SonarCloud Coverage Inputs

- `backend/coverage/lcov.info`
- `frontend/coverage/lcov.info`

---

## Deployment

Deployment is handled through GitHub Actions and Docker image tags.

Current flow:

1. Run tests and collect coverage
2. Run Sonar analysis
3. Build frontend and backend images
4. Push SHA-tagged images
5. SSH into EC2 and restart the Docker Compose stack

---

## Security Notes

- keep MongoDB credentials in secrets or environment variables
- do not commit production secrets
- use GitHub Secrets for pipeline credentials
- use SHA-based image tags for predictable deployments
- keep generated files and test files excluded correctly from Sonar source coverage

---

## Documentation

Additional docs:

- [Full Codebase Documentation](docs/CODEBASE_DOCUMENTATION.md)
- [Backend Notes](backend/README.md)

---

## License

ISC

---

<div align="center">
  <sub>Made by Jaya Krishna Sai</sub>
</div>
