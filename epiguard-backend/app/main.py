from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import disease, hospitals, hotspots, resources, allocation, stats, chatbot

app = FastAPI(
    title="EpiGuard API",
    description="Global Epidemic Intelligence Backend — FastAPI",
    version="1.0.0",
)

# Allow the Vite dev server to call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stats.router,      prefix="/api/stats",      tags=["Stats"])
app.include_router(disease.router,    prefix="/api/disease",    tags=["Disease"])
app.include_router(hospitals.router,  prefix="/api/hospitals",  tags=["Hospitals"])
app.include_router(hotspots.router,   prefix="/api/hotspots",   tags=["Hotspots"])
app.include_router(resources.router,  prefix="/api/resources",  tags=["Resources"])
app.include_router(allocation.router, prefix="/api/allocation", tags=["Allocation"])
app.include_router(chatbot.router,    prefix="/api/chat",       tags=["Chatbot"])


@app.get("/")
def root():
    return {
        "service": "EpiGuard API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "operational",
    }


@app.get("/health")
def health():
    return {"status": "ok"}
