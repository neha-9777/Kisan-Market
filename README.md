# Kisan Market - AI Chatbot (Partial Implementation)

This workspace contains a marketplace with an AI chatbot backend and React frontend. This patch adds a chatbot backend scaffold integrating Google Gemini (stub), MongoDB models, authentication, Socket.io, and a minimal React chat component.

Backend
- Location: `backend/`
- Copy `.env.example` to `.env` and fill the values (MONGO_URI, JWT_SECRET, GEMINI_API_KEY, CLOUDINARY_URL)
- Install and run:

```powershell
cd backend
npm install
npm run dev
```

Frontend
- Location: `frontend/`
- Add `VITE_BACKEND_URL` in `.env` if needed.

```powershell
cd frontend
npm install
npm run dev
```

Notes
- Gemini integration is a minimal template and may require adjustments to match Google's current API shape and auth method.
- This patch focuses on core scaffolding (auth, models, chat endpoints, socket events, upload endpoint) and a minimal frontend component. Further features (multi-language, voice, admin panel, analytics) can be added iteratively.
