"""
Chatbot router — proxies requests to Google Gemini.
The API key lives in the backend only, never exposed to the browser.
Set GEMINI_API_KEY in your .env file or environment variables.
"""
import os
import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List

router = APIRouter()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL   = "gemini-2.5-flash"
GEMINI_URL     = f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"

SYSTEM_PROMPT = """You are EpiGuard AI, an expert epidemiological intelligence assistant embedded in a Global Disease Command Center dashboard. You help public health officials, epidemiologists, and medical response teams.

Your expertise covers:
- Epidemic and pandemic analysis (influenza, COVID-19, dengue, cholera, mpox, etc.)
- SEIRD / compartmental disease models (R₀, transmission rates, peak projections)
- Hospital resource allocation and triage prioritization
- Global outbreak hotspot assessment and risk scoring
- DevOps/CI-CD pipelines for health informatics systems

Keep responses concise, data-driven, and actionable."""


class ChatMessage(BaseModel):
    role:    str   # "user" | "assistant"
    content: str


class ChatRequest(BaseModel):
    messages: List[ChatMessage]


@router.post("/")
async def chat(req: ChatRequest):
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=503,
            detail="GEMINI_API_KEY not configured on the server. Set it in your .env file."
        )

    # Build Gemini conversation history
    history = [
        {
            "role": "model" if m.role == "assistant" else "user",
            "parts": [{"text": m.content}],
        }
        for m in req.messages[:-1]   # all but last
    ]
    last = req.messages[-1]

    payload = {
        "system_instruction": {"parts": [{"text": SYSTEM_PROMPT}]},
        "contents": [
            *history,
            {"role": "user", "parts": [{"text": last.content}]},
        ],
        "generationConfig": {"maxOutputTokens": 1000, "temperature": 0.7},
    }

    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            f"{GEMINI_URL}?key={GEMINI_API_KEY}",
            json=payload,
            headers={"Content-Type": "application/json"},
        )

    if resp.status_code != 200:
        detail = resp.json().get("error", {}).get("message", resp.text)
        raise HTTPException(status_code=resp.status_code, detail=detail)

    data  = resp.json()
    reply = data["candidates"][0]["content"]["parts"][0]["text"]
    return {"reply": reply, "model": GEMINI_MODEL}
