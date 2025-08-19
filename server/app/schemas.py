from pydantic import BaseModel
from datetime import datetime
from typing import Literal
from typing import Optional


class ChatCreate(BaseModel):
    title: Optional[str] = None


class ChatOut(BaseModel):
    id: int
    title: str
    created_at: datetime

    class Config:
        from_attributes = True


class MessageCreate(BaseModel):
    role: str
    content: str


class MessageRequest(BaseModel):
    content: str
    detail_level: Optional[Literal["brief", "medium", "detailed"]] = "brief"
