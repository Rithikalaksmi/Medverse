# EpiGuard — Global Epidemic Intelligence Platform

A full-stack epidemic surveillance dashboard with a **React + Vite** frontend and a **FastAPI** backend.

---

## Project Structure

```
epiguard/               ← React frontend (Vite + TypeScript)
epiguard-backend/       ← FastAPI backend (Python)
```

---

## 1 — Backend Setup (FastAPI)

### Prerequisites
- Python 3.10+

### Install & Run

```bash
cd epiguard-backend

# Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
python run.py
```

The API will be live at **http://localhost:8000**

- Interactive docs (Swagger UI): http://localhost:8000/docs
- Alternative docs (ReDoc):      http://localhost:8000/redoc

### Environment Variables

The `.env` file in `epiguard-backend/` already has your Gemini key set.
Edit it if you need to change the key or port:

```env
GEMINI_API_KEY=your_key_here
PORT=8000
```

---

## 2 — Frontend Setup (React + Vite)

### Prerequisites
- Node.js 18+

### Install & Run

```bash
cd epiguard

npm install
npm run dev
```

The app will be at **http://localhost:5173**

The frontend automatically connects to `http://localhost:8000`.
If the backend isn't running, it falls back to built-in mock data gracefully.

---

## API Endpoints

| Method | Endpoint                        | Description                        |
|--------|---------------------------------|------------------------------------|
| GET    | `/api/stats/`                   | Global epidemic summary            |
| GET    | `/api/stats/timeline?weeks=24`  | Weekly case timeline               |
| GET    | `/api/disease/`                 | All countries disease data         |
| GET    | `/api/disease/country/{code}`   | Single country (e.g. IN, US, CN)   |
| GET    | `/api/disease/seird?days=90`    | SEIRD model simulation             |
| GET    | `/api/hotspots/`                | All hotspots                       |
| GET    | `/api/hotspots/top?limit=5`     | Top N hotspots by risk score       |
| GET    | `/api/hospitals/`               | All hospitals                      |
| GET    | `/api/resources/`               | Medical resource availability      |
| GET    | `/api/resources/utilization`    | Bed & ICU utilization rates        |
| GET    | `/api/allocation/scenarios`     | Pre-built allocation scenarios     |
| POST   | `/api/allocation/calculate`     | Calculate resource allocation      |
| POST   | `/api/chat/`                    | AI chat (proxied to Gemini)        |

---

## Running Both Together

Open two terminals:

**Terminal 1 — Backend**
```bash
cd epiguard-backend
source venv/bin/activate
python run.py
```

**Terminal 2 — Frontend**
```bash
cd epiguard
npm run dev
```

Then open http://localhost:5173
