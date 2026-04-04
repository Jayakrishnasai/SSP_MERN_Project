<p align="center">
  <img src="https://img.shields.io/badge/PERSEVERANCE-Software%20Training%20Institute-64ffda?style=for-the-badge&labelColor=0a192f" alt="Perseverance Banner"/>
</p>

<h1 align="center">🎓 SSP MERN Project</h1>

<p align="center">
  <em>A full-stack, containerized platform for Perseverance Software Training Institute built using the MERN stack, Docker, and CI/CD pipelines.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white"/>
  <img src="https://img.shields.io/badge/Nginx-009639?style=for-the-badge&logo=nginx&logoColor=white"/>
</p>

---

## 🌟 Overview

This project is a production-ready MERN application designed for a training institute platform.

- Modern React UI
- Express REST API
- MongoDB database
- Dockerized deployment
- CI/CD with GitHub Actions
- SonarCloud quality checks

---

## 🏗️ Architecture

Browser → Frontend (Nginx - 80) → Backend (3100) → MongoDB

---

## 🛠️ Tech Stack

Frontend:
- React
- Tailwind CSS
- Axios

Backend:
- Node.js
- Express
- Mongoose

DevOps:
- Docker
- GitHub Actions
- SonarCloud
- AWS EC2

---

## 📁 Project Structure

SSP_MERN_Project/
- backend/
- frontend/
- docker-compose.yml
- .github/workflows/
- sonar-project.properties

---

## 🚀 Getting Started

git clone https://github.com/Jayakrishnasai/SSP_MERN_Project.git
cd SSP_MERN_Project

---

## 🐳 Run with Docker

docker compose up -d --build

Access:
- Frontend: http://localhost
- Backend: http://localhost:3100/courses

---

## 📡 API

GET /courses  
POST /courses  
PUT /courses/:id  
DELETE /courses/:id  

---

## 🧪 Testing

cd backend  
npm test -- --coverage  

---

## ⚙️ CI/CD

Pipeline:
1. Test  
2. Sonar  
3. Docker Build  
4. Deploy  

---

## ☁️ Deployment

docker compose up -d

---

## 🔒 Security

- Do not expose MongoDB  
- Use GitHub Secrets  
- Use SHA-based Docker tags  

---

## 📄 License

ISC

<p align="center">
  <sub>Made by Jaya Krishna Sai</sub>
</p>
