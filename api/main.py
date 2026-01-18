"""
Mai-AI Public API
Your personal AI companion service
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import httpx
import os

app = FastAPI(
    title="Mai-AI API",
    description="Your personal AI companion API",
    version="1.0.0"
)

# CORS for web/mobile clients
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Private backend URL (set in environment)
BACKEND_URL = os.getenv("MAIAI_BACKEND_URL", "http://localhost:8080")


class ChatRequest(BaseModel):
    message: str
    user_id: str
    session_id: str = None


class ChatResponse(BaseModel):
    response: str
    session_id: str
    memory_updated: bool = False


class BirthRequest(BaseModel):
    name: str
    personality: str = "balanced"
    voice: str = "british"


@app.get("/")
async def root():
    return {
        "service": "Mai-AI",
        "status": "online",
        "version": "1.0.0"
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """Send message to your AI companion"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{BACKEND_URL}/api/chat",
                json={
                    "message": request.message,
                    "user_id": request.user_id,
                    "session_id": request.session_id
                },
                timeout=30.0
            )
            response.raise_for_status()
            return response.json()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=503, detail="AI backend unavailable")


@app.post("/birth")
async def birth_ai(request: BirthRequest):
    """Birth a new AI companion"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{BACKEND_URL}/api/birth",
                json=request.dict(),
                timeout=60.0
            )
            response.raise_for_status()
            return response.json()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=503, detail="Birth service unavailable")


@app.get("/user/{user_id}/stats")
async def get_user_stats(user_id: str):
    """Get user's AI companion stats"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{BACKEND_URL}/api/user/{user_id}/stats",
                timeout=10.0
            )
            response.raise_for_status()
            return response.json()
    except httpx.HTTPError:
        raise HTTPException(status_code=503, detail="Stats unavailable")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
