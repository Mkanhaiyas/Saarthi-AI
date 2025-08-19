from config import GEMINI_API_KEY
import google.generativeai as genai
import numpy as np
import json
import faiss
from sentence_transformers import SentenceTransformer
import asyncio
from fastapi import APIRouter, HTTPException, Depends, Body, Path
from fastapi.responses import StreamingResponse
from uuid import uuid4
from sqlalchemy.orm import Session
from sqlalchemy import asc
import models, schemas
from database import get_db
from datetime import datetime

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")
embedder = SentenceTransformer("all-MiniLM-L6-v2")
index = faiss.read_index("BhagavadGita_FAISS.index")
with open("BhagavadGita_Verses.json", "r", encoding="utf-8") as f:
    metadata = json.load(f)

router = APIRouter()


@router.post("/api/chat")
async def create_chat(chat_data: schemas.ChatCreate, db: Session = Depends(get_db)):
    title = chat_data.title or "New chat"
    new_chat = models.Chat(title=title)
    db.add(new_chat)
    db.commit()
    db.refresh(new_chat)
    return {"success": True, "chat": new_chat}


@router.get("/api/chats")
def get_all_chats(db: Session = Depends(get_db)):
    try:
        chats = db.query(models.Chat).order_by(models.Chat.created_at.desc()).all()
        chat_list = [schemas.ChatOut.model_validate(chat) for chat in chats]
        return {"success": True, "chats": chat_list}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.patch("/api/chat/{chat_id}")
def update_chat(
    chat_id: int, request: schemas.ChatCreate, db: Session = Depends(get_db)
):
    try:
        chat = db.query(models.Chat).filter(models.Chat.id == chat_id).first()
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")
        chat.title = request.title
        db.commit()
        db.refresh(chat)
        return {"success": True, "chat": chat}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/api/chat/{chat_id}/message")
def add_message(
    chat_id: int = Path(...),
    msg: schemas.MessageCreate = Body(...),
    db: Session = Depends(get_db),
):
    try:
        new_message = models.Message(
            chat_id=chat_id,
            role=msg.role,
            content=msg.content,
            created_at=datetime.utcnow(),
        )
        db.add(new_message)
        db.commit()
        db.refresh(new_message)

        return {"success": True, "message": new_message}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/api/chat/{chat_id}")
def get_chat_history(chat_id: int = Path(...), db: Session = Depends(get_db)):
    try:
        messages = (
            db.query(models.Message)
            .filter(models.Message.chat_id == chat_id)
            .order_by(asc(models.Message.created_at))
            .all()
        )
        return {"success": True, "messages": [msg.__dict__ for msg in messages]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/api/chat/{chat_id}/stop")
def stop_streaming(chat_id: int = Path(...), db: Session = Depends(get_db)):
    chat = db.query(models.Chat).filter(models.Chat.id == chat_id).first()
    if not chat:
        raise HTTPException(status_code=404, detail="Chat not found")

    # TODO: Add actual streaming cancellation logic
    return {"success": True, "message": f"Streaming stopped for chat {chat_id}"}


@router.delete("/api/chat/{chat_id}")
def delete_chat(chat_id: int = Path(...), db: Session = Depends(get_db)):
    try:
        chat = db.query(models.Chat).filter(models.Chat.id == chat_id).first()
        if not chat:
            raise HTTPException(status_code=404, detail="Chat not found")
        db.delete(chat)
        db.commit()
        return {"success": True, "message": "Chat and associated messages deleted"}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/api/chat/{chat_id}/message/stream")
async def stream_chat_message(
    chat_id: int, request: schemas.MessageRequest, db: Session = Depends(get_db)
):
    question = request.content.strip()
    detail_level = (request.detail_level or "brief").lower()

    user_msg = models.Message(
        chat_id=chat_id, role="user", content=question, created_at=datetime.utcnow()
    )
    db.add(user_msg)
    db.commit()
    db.refresh(user_msg)

    query_embedding = embedder.encode([question])
    D, I = index.search(np.array(query_embedding).astype("float32"), k=3)

    top_score = D[0][0]
    THRESHOLD = 0.6

    if top_score < THRESHOLD:
        prompt = f"""
You are a warm, truthful assistant.

The user asked: "{question}"

This question does not directly match Bhagavad Gita teachings.

Give a polite, honest answer.
If suitable, add a gentle spiritual note but don't make up verses.
Keep it {detail_level} length.

Answer:
"""
    else:
        relevant_verses = []
        for idx in I[0]:
            relevant_verses.append(
                f"Chapter {metadata[idx]['chapter']}, Verse {metadata[idx]['verse_number']}\n"
                f"Sanskrit:\n{metadata[idx]['sanskrit']}\n\n"
                f"Transliteration:\n{metadata[idx]['transliteration']}\n\n"
                f"Translation:\n{metadata[idx]['translation']}\n"
            )
        context = "\n\n".join(relevant_verses)
        prompt = f"""
You are a wise Gita teacher.

Context:
{context}

User's question:
{question}

Show the best Sanskrit verse.
Explain its meaning in simple English.
Add a relatable real-life example.
Encourage the user with a warm takeaway.
Keep your explanation {detail_level} length: brief, medium, or detailed.

Answer:
"""

    async def gemini_streamer(prompt: str, chat_id: int, db: Session):
        full_response = ""
        try:
            stream = model.generate_content(prompt, stream=True)
            for chunk in stream:
                if chunk.parts:
                    text = chunk.text
                    full_response += text
                    print(full_response)
                    yield f"data: {text}\n\n"
                    await asyncio.sleep(0.001)

            assistant_msg = models.Message(
                chat_id=chat_id,
                role="assistant",
                content=full_response.strip(),
                created_at=datetime.utcnow(),
            )
            db.add(assistant_msg)
            db.commit()
            db.refresh(assistant_msg)

            yield f"event: done\ndata:[DONE]\n\n"

        except Exception as e:
            yield f"event: error\ndata: {str(e)}\n\n"

    return StreamingResponse(
        gemini_streamer(prompt, chat_id, db), media_type="text/event-stream"
    )
