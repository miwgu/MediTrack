# Full-stack MediTrack - React + Node.js + Express.js + Docker 

## 📚 Overview

Describe your project briefly.
  **XXXX**.  


---
## ✅ Features
- **Feature 1** — simple ....
- **Feature 2** — messages are ...
- **Feature 3** — easily store ...

>  **XXXXX** is a ...

---
## 🚀 Tech Stack

- **Frontend:** React (TypeScript + Vite) 
- **Backend:** Express.js (TypeScript)
- **Database:** PostgreSQL
- **Containerization:** Docker, Docker Compose

---

## 💬 How It Works
### User Interaction Flow
1. The user ...  
2. The frontend sends a POST request to **`/api/.....`**.  
3. The backend processes the request using **XXX**:  
   - The question is ...  
   - xxxxxxx.  
   - xxxxxxx.  


## 🧠 System Architecture Diagram


---

## ⚙️ Project Setup Instructions

1. Clone the Repository
```bash
git clone XXXXX
```
2. Install Dependencies both frontend and backend
```bash
npm install
``` 
---

## 🌍Enviroment file

- Add a .env file in the project root
- change settings for Docker
```bash
          
PORT=3000
FRONTEND_ORIGIN=http://localhost:4173
VITE_BACKEND_URL=http://localhost:3000

# Database Docker
DB_HOST=postgres
DB_PORT=5432
DB_USER=myuser
DB_PASSWORD=mypassword
DB_NAME=XXXXXdb

```
-for Frontend
```bash
VITE_BACKEND_URL=http://localhost:3001
```
-for Backend
```bash
FRONTEND_ORIGIN=http://localhost:4173
```
---

## 🐳Docker Container Setup 

1. Start Containers
```bash
docker compose up -d --build
```
> This command automatically builds and starts all containers.
You don’t need to manually create the database or register knowledge — these are handled automatically when the backend container starts.

2. Check backed logs
> Verify that the knowledge base is successfully registered and the server is running.
```bash
docker logs aida-backend
```
3. Stop and Remove Containers (Optional)
```bash
docker compose down
```
>⚠️ Note: The knowledge embeddings are stored in the persistent PostgreSQL volume (postgres_data).
You do not need to re-run the registration script or rebuild the containers unless the volume or database is deleted.
---

## 💾 Database Setup with init.sql
You don’t need to do anything manually to set up the database `XXXXdb`.  
It is automatically created by `docker-compose.yml`.

The `postgres_data` volume is **persistent**, which means that even if you delete the container, the volume (and thus the database data) will remain. This is why the database may continue to operate with old data.

```yaml
environment:
  - POSTGRES_DB=${DB_NAME}
  - POSTGRES_USER=${DB_USER}
  - POSTGRES_PASSWORD=${DB_PASSWORD}
volumes:
  - ./init.sql:/docker-entrypoint-initdb.d/init.sql
```
---

## 🔄 Resetting the Database

If you want to completely delete chatdb and create a new one:
```bash
docker compose down -v
```
>This will remove both the container and the persistent volume, so the database is recreated from scratch

- Rebuilds the image from the Dockerfile.
- All latest code and dependency changes are applied.
```bash
docker compose up -d --build
```
OR
- Reuses the existing image.
- Code changes are not reflected in the container.
```bash
docker compose up -d
```

---

## 📝 Accessing the Database
Login to the Postgres container (you will need to enter the password):
```bash
docker exec -it XXXX-postgres-container psql -U myuser -d XXdb
```
Check existing tables:
```bash
\dt  
```


---

## 📈 API Endpoints


---

## 📝 Future Improvements 

- XXX.
- XXX.
