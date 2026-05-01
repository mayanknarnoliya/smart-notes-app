# 📝 Smart Notes App

A full-stack **MERN** (MongoDB, Express, React, Node.js) Notes application with **AI-powered features** using the Claude API.

## ✨ Features

- **Add, View & Delete notes** with a clean, responsive UI
- **Color-coded notes** for better organization
- **Search notes** by title, content, or tags
- **AI: Summarize** — generates a 2-3 sentence summary of any note (Claude API)
- **AI: Auto Tags** — automatically generates relevant tags for notes (Claude API)
- Notes persist in **MongoDB**

## 🛠 Tech Stack

| Layer    | Technology              |
| -------- | ----------------------- |
| Frontend | React 18, Vite          |
| Backend  | Node.js, Express.js     |
| Database | MongoDB, Mongoose       |
| AI       | Anthropic Claude API    |
| HTTP     | Axios                   |

## 📁 Project Structure

```
smart-notes-app/
├── backend/
│   ├── models/
│   │   └── Note.js          # Mongoose schema
│   ├── routes/
│   │   └── notes.js         # REST API + AI endpoints
│   ├── server.js            # Express server entry point
│   ├── .env.example         # Environment variables template
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── NoteCard.jsx # Individual note with AI actions
│   │   │   └── NoteForm.jsx # Add note form
│   │   ├── App.jsx          # Main app component
│   │   ├── main.jsx         # React entry point
│   │   └── index.css        # Global styles
│   ├── index.html
│   ├── vite.config.js       # Vite + proxy config
│   └── package.json
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** v18+ ([Download](https://nodejs.org))
- **MongoDB** — local install OR free [MongoDB Atlas](https://www.mongodb.com/atlas) cloud
- **Anthropic API Key** — get one at [console.anthropic.com](https://console.anthropic.com)

---

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/smart-notes-app.git
cd smart-notes-app
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file (copy from example):

```bash
cp .env.example .env
```

Edit `.env` and fill in your values:

```env
MONGODB_URI=mongodb://localhost:27017/smart-notes
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/smart-notes

ANTHROPIC_API_KEY=sk-ant-your-key-here
PORT=5000
```

Start the backend server:

```bash
npm run dev       # development (auto-restart)
# OR
npm start         # production
```

Backend runs on: `http://localhost:5000`

---

### 3. Setup Frontend

Open a **new terminal**:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

### 4. Open the App

Visit **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔌 API Endpoints

| Method | Endpoint                   | Description                   |
| ------ | -------------------------- | ----------------------------- |
| GET    | `/api/notes`               | Get all notes                 |
| POST   | `/api/notes`               | Create a new note             |
| DELETE | `/api/notes/:id`           | Delete a note                 |
| PUT    | `/api/notes/:id`           | Update a note                 |
| POST   | `/api/notes/:id/summarize` | ✨ AI: Summarize note content  |
| POST   | `/api/notes/:id/tags`      | ✨ AI: Generate tags for note  |

## 🤖 AI Features Explained

### Summarize
Sends the note's title and content to the Claude API with a prompt to generate a concise 2-3 sentence summary. The summary is saved to MongoDB and displayed on the card.

### Auto Tags
Sends the note content to Claude asking for 3-5 relevant tags in JSON format. The response is parsed and tags are saved to the note in MongoDB.

Both features use the `claude-opus-4-6` model via the `@anthropic-ai/sdk` package.

## 🌐 Deployment (Optional)

### Backend — Render / Railway
1. Push code to GitHub
2. Connect repo to [Render](https://render.com) or [Railway](https://railway.app)
3. Set environment variables in the dashboard
4. Deploy!

### Frontend — Vercel / Netlify
1. Build: `cd frontend && npm run build`
2. Deploy the `dist/` folder to [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
3. Update the API proxy URL to point to your deployed backend

### Database — MongoDB Atlas (Free)
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Get the connection string
3. Replace `MONGODB_URI` in your `.env`

---

## 📸 Screenshots
## 🌐 Live Demo
https://smart-notes-app-ai.onrender.com/

> Add screenshots of your running app here.

---

## 👤 Author

Made as part of a technical assignment demonstrating MERN stack + AI integration.
