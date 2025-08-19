# <img width="50" height="50" alt="image" src="https://github.com/user-attachments/assets/330eb469-80cb-4dcb-ad93-63b996bc7319" />
 Saarthi AI — GitaBot

**Saarthi AI (GitaBot)** is a spiritual AI companion that shares timeless wisdom from the **Bhagavad Gita** through a modern chat interface.
It bridges ancient philosophy and modern AI so anyone can seek guidance on duty, purpose, decision‑making, and inner peace.

---

## ✨ Concept & Motivation

The Bhagavad Gita offers practical guidance on life, but reading and interpreting verses can be overwhelming. Saarthi AI turns this into an interactive experience:

* Chat with Gita’s wisdom like a friend or mentor.
* Get contextual answers with referenced verses and plain‑English explanations.
* Learn through relatable examples and gentle takeaways.
* Make ancient philosophy accessible and useful in daily life.

**How it helps people**

* **Personal guidance** for life decisions and dilemmas.
* **Mental clarity** via reflective, compassionate answers.
* **Spiritual learning** made interactive and approachable.
* **Stress relief** through supportive dialogue and timeless principles.

---

## 🧩 Architecture Overview

```
User → Next.js (client) → FastAPI (server)
                       ↘  FAISS + Sentence-Transformers (semantic search)
                        ↘ Google Gemini (response generation)
                         ↘ Database (Chats, Messages)
```

* **FAISS** finds relevant Bhagavad Gita verses using embeddings from **Sentence Transformers**.
* **Gemini** (GenerativeModel: `gemini-2.0-flash`) crafts warm, truthful responses using the verses as context.
* **SQLAlchemy** persists chats and messages.

---

## 📂 Project Structure

```
saarthi-ai/
├── README.md
├── client/                  # Next.js frontend
│   ├── app/
│   │   ├── chatbox/
│   │   │   ├── _components/
│   │   │   │   ├── chat-input.jsx
│   │   │   │   └── message-bubble.jsx
│   │   │   └── page.jsx
│   │   ├── globals.css
│   │   ├── layout.js
│   │   ├── page.js
│   │   └── sidebar/
│   │       ├── _components/
│   │       │   ├── chat-item.jsx
│   │       │   └── drop-down-menu.jsx
│   │       └── page.jsx
│   ├── context/
│   │   └── SaarthiContext.jsx
│   ├── hooks/
│   │   ├── useChatMessages.js
│   │   └── useSidebarChats.js
│   ├── jsconfig.json
│   ├── next.config.mjs
│   ├── package.json
│   ├── postcss.config.mjs
│   ├── public/
│   │   ├── favicon.png
│   │   └── lord2.png
│   └── utils/
│       └── importantFunc.js
└── server/                  # FastAPI backend
    ├── .gitignore
    ├── BhagavadGita_Verses.json
    ├── app/
    │   ├── chat.py
    │   ├── config.py
    │   ├── database.py
    │   ├── main.py
    │   ├── models.py
    │   └── schemas.py
    └── requirements.txt
```

---

## 🎨 Frontend (Next.js) — Design & UX

**Stack:** Next.js (App Router), React 18, Tailwind CSS.

**Key ideas**

* Familiar, low‑friction chat layout so users focus on the message, not the UI.
* Minimalist visuals to reduce cognitive load and support a calm reading experience.
* Modular components for maintainability and reuse.

**Features**

* **Modern Chat UI** with distinct user/bot bubbles.
* **Sidebar** to organize multiple conversations.
* **Global Context (`SaarthiContext`)** for app‑wide state.
* **Custom Hooks** (`useChatMessages`, `useSidebarChats`) for data flow.
* **API Integration** with the FastAPI server for chat creation, message streaming, and history.

---

## ⚙️ Backend (FastAPI) — AI & Data

**Stack:** FastAPI, SQLAlchemy, Pydantic, FAISS, Sentence‑Transformers, Google Gemini.

**Flow**

1. **User question** is sent to `/api/chat/{chat_id}/message/stream`.
2. **Embedding search** with FAISS retrieves the most relevant verses.
3. **Prompt building** includes Sanskrit, transliteration, and translation.
4. **Gemini** streams a friendly, contextual answer.
5. **Persistence**: User and assistant messages are stored with timestamps.

**Core endpoints**

* `POST /api/chat` — create chat
* `GET /api/chats` — list chats
* `PATCH /api/chat/{chat_id}` — rename chat
* `DELETE /api/chat/{chat_id}` — delete chat and messages
* `GET /api/chat/{chat_id}` — fetch message history
* `POST /api/chat/{chat_id}/message` — add a message
* `POST /api/chat/{chat_id}/message/stream` — stream AI response (SSE)

---

## 🗝️ Environment Variables

Create a `.env` file (do not commit it):

```
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=postgresql://username:password@host:5432/dbname
```

`config.py` reads these via `python-dotenv` and `os.getenv`.

---

## 🚀 Local Development

### Backend

```bash
cd server
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload   # http://localhost:8000
```

### Frontend

```bash
cd client
npm install
npm run dev                     # http://localhost:3000
```

---

## 📦 Backend Dependencies (pinned)

If you need to recreate the environment, see `server/requirements.txt`. Recommended pinned set:

```
fastapi==0.115.2
uvicorn==0.30.6
sqlalchemy==2.0.34
pydantic==2.9.2
python-dotenv==1.0.1
google-generativeai==0.8.3
numpy==2.1.1
faiss-cpu==1.8.0.post1
sentence-transformers==3.0.1
psycopg2-binary==2.9.9   # only if using PostgreSQL
```

---

## 📄 API Docs

Once the backend is running, open:

* Swagger UI: `http://localhost:8000/docs`
* ReDoc: `http://localhost:8000/redoc`

---

## 🔒 Security & Privacy

* Do not commit real secrets: keep them in `.env`.
* CORS is enabled for local dev; tighten origins for production.
* Validate inputs and handle prompt safety for production use.

---

## 🛣️ Roadmap (Ideas)

* Auth & user accounts
* Rate limiting and abuse prevention
* Conversation tagging and search
* Export chat transcripts (PDF/Markdown)
* Multilingual verse display

---

## 📜 License

MIT — feel free to fork and build upon it.

---

## 🙌 Acknowledgements

* **Bhagavad Gita** translations and transliterations
* **Sentence‑Transformers** and **FAISS** for semantic search
* **Google Gemini** for generation

