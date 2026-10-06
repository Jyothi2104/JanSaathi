# JanSaathi – AI Civic Helpdesk

JanSaathi is a full-stack AI-powered civic complaint management platform that helps citizens report local civic issues through text or voice in English, Telugu, and Hindi.

Google Gemini analyzes complaints, identifies the category, urgency, and responsible department, and generates a response in the citizen's language. Complaints are stored in MongoDB Atlas and managed through an officer dashboard.

## Features

- 📝 Text-based civic complaint submission
- 🎤 Voice-based complaint submission
- 🌐 English, Telugu, and Hindi support
- 🤖 AI-powered complaint classification
- 🚨 Automatic urgency detection
- 🏢 Automatic department assignment
- 💬 AI-generated multilingual responses
- 🔎 Complaint tracking
- 👮 Officer login and dashboard
- 📊 Complaint statistics and category charts
- 🔄 Complaint status management

## AI Analysis

JanSaathi uses Google Gemini to classify complaints into:

- Water
- Roads
- Electricity
- Health
- Sanitation
- Other

It also determines:

- Urgency: Low / Medium / High
- Responsible department
- Response for the citizen

## Technology Stack

**Frontend**
- React.js
- Vite
- JavaScript
- CSS3
- Axios
- React Router
- Recharts
- Browser Speech Recognition API

**Backend**
- Node.js
- Express.js
- REST APIs
- JWT
- bcryptjs

**AI & Database**
- Google Gemini API
- MongoDB Atlas

**Tools**
- Git
- GitHub
- VS Code

## Architecture

```text
Citizen
   │
   ▼
React + Vite
   │
   ▼
Node.js + Express
   │
   ├── Google Gemini → AI Analysis
   │
   └── MongoDB Atlas → Complaint Storage
   │
   ▼
Officer Dashboard

## Project  Structure
JanSaathi/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── CitizenPage.jsx
│   │   ├── OfficerLogin.jsx
│   │   ├── OfficerDashboard.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   └── package.json
│
├── backend/
│   ├── evaluation/
│   ├── routes/
│   ├── database.js
│   ├── gemini.js
│   ├── server.js
│   └── package.json
│
├── .gitignore
└── README.md

## Run locally
## Run Locally

### 1. Clone the repository

git clone https://github.com/Jyothi2104/JanSaathi.git
cd JanSaathi

### 2. Backend

cd backend
npm install

Create `backend/.env`:

MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_jwt_secret
PORT=5000

Start the backend:

node server.js

## 3. Frontend

Open another terminal:

cd frontend
npm install

Create `frontend/.env`:

VITE_API_URL=http://localhost:5000

Start the frontend:

npm run dev

Open the URL shown by Vite, usually:

http://localhost:5173

## Future Scope
- Citizen registration and login
- Role-based access control
- Department-specific dashboards
- SMS/Email notifications
- WhatsApp complaint submission
- Image-based complaint evidence
- GPS-based complaint mapping
- Duplicate complaint detection
- Complaint heatmaps
- Advanced analytics

## Security
- JWT authentication
- bcryptjs password handling
- Environment variables for secrets
- Backend validation
- .env excluded using .gitignore
Never commit API keys, passwords, or .env files to GitHub.


## Author
Jyothi Mandava
B.Tech – Artificial Intelligence and Data Science
Shri Vishnu Engineering College for Women
GitHub: https://github.com/Jyothi2104
Project Status


## Active Development
JanSaathi is being developed as a full-stack AI civic technology platform with multilingual support, voice assistance, AI-powered complaint analysis, complaint tracking, and officer management.