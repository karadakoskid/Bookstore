# Bookstore – Fullstack App with Docker, Kubernetes, and CI/CD

This project is a demonstration of a modern fullstack application deployment using Docker, Kubernetes, and GitHub Actions. The app consists of a React frontend, Flask backend, and MongoDB database, and can be deployed both locally (with Docker Compose/Kubernetes) and remotely.

---

## 🌟 Features

- **Multi-service architecture:** React (frontend), Flask (backend), MongoDB (database)
- **Dockerized:** Each component runs in its own Docker container
- **Kubernetes-ready:** Ready for deployment on Kubernetes clusters
- **Works locally:** via Docker Compose (`localhost:3001` for frontend)
- **Secure:** Uses environment variables for configuration

---

## 🚀 Quick Start

### 1. **Local Setup with Docker Compose**

1. **Clone the repo:**
   ```sh
   git clone https://github.com/<your-username>/bookstore.git
   cd bookstore
   ```

2. **Copy `.env.example` to `.env`** and fill in MongoDB credentials.

3. **Start all services:**
   ```sh
   docker-compose up --build
   ```

4. **Visit the app:**
   - Frontend: [http://localhost:3001](http://localhost:3001)
   - Backend: [http://localhost:5050](http://localhost:5050)

---

## 🔗 Project Structure

```
.
├── backend/                    # Flask backend
├── bookstore-frontend/         # React frontend
├── docker-compose.yaml         # Local Docker Compose config
└── ...
```

---

## 📄 License

MIT
