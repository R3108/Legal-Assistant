# Legal Document Summarizer

AI-powered legal document summarizer using CrewAI, React, and FastAPI.

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env
# Add your Google API key to .env
uvicorn main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Usage

1. Start the backend server (runs on http://localhost:8000)
2. Start the frontend (runs on http://localhost:3000)
3. Upload a legal document or paste text
4. Get an AI-generated summary with key points

## Features

- Upload .txt files or paste text directly
- AI-powered analysis using CrewAI agents with Google Gemini
- Clean, modern React interface
- FastAPI backend with CORS support
