from fastapi import FastAPI
from chat import router as chat_router
from fastapi.middleware.cors import CORSMiddleware
import models
from database import engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Saarthi AI",
    description="""
DISCLAIMER:
This Saarthi AI shares general wisdom from the Bhagavad Gita.
It does not replace medical, legal, or professional advice.
For serious concerns, consult a qualified human advisor.
""",
    version="1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "*",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)
