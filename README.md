# Devfolio AI

<div align="center">

![Devfolio AI Banner](https://img.shields.io/badge/Devfolio-AI-8b5cf6?style=for-the-badge&logo=github&logoColor=white)

**An AI-powered developer portfolio and resume generator, driven by your GitHub profile.**

[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-6DB33F?style=flat-square&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini%20API-4285F4?style=flat-square&logo=google&logoColor=white)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

</div>

---

## Overview

**Devfolio AI** is a full-stack application that connects to your GitHub account and uses **Google Gemini** to automatically generate stunning developer portfolios and tailored resumes. It syncs your repositories, analyzes your code, and produces AI-powered insights — so you can focus on building, not writing about what you build.

Users authenticate via **GitHub OAuth**, grant the app read access to their repositories, and within minutes have a professionally generated portfolio site and a polished resume ready to share or export.

---

## Features

- **GitHub OAuth Login**: One-click sign-in with your GitHub account — no passwords needed
- **Repository Sync**: Automatically fetches and stores all your public repos with metadata
- **AI Portfolio Generator**: Gemini AI generates a full portfolio website from your GitHub projects
- **AI Resume Builder**: Creates a tailored developer resume based on your actual code and contributions
- **AI Insights Dashboard**: Get a detailed breakdown of your tech stack, coding patterns, and strengths
- **AI Roast Mode**: Let the AI humorously critique your GitHub profile
- **Cover Letter Generator**: AI writes a custom cover letter for any job description
- **LinkedIn About Generator**: AI crafts the perfect LinkedIn summary in your chosen tone
- **Public Portfolio Links**: Share your portfolio with a unique public URL — no account needed to view
- **AI Chatbot on Portfolio**: Visitors can chat with an AI trained on your portfolio content
- **Template Selection**: Choose from multiple portfolio and resume templates
- **Smart Caching**: MongoDB stores all analysis results to minimize API costs
- **JWT Authentication**: Stateless, secure token-based auth for all protected endpoints
- **Secure**: All API keys and OAuth secrets live server-side only, never exposed to the frontend

---

## Prerequisites

Before you begin, ensure you have:

- **Java 17+** - [Download here](https://adoptium.net/)
- **Maven 3.8+** - [Download here](https://maven.apache.org/download.cgi) *(or use the bundled `.maven` script)*
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **MongoDB Atlas account** (free tier sufficient) - [Sign up here](https://www.mongodb.com/cloud/atlas)
- **GitHub OAuth App** - [Create here](https://github.com/settings/developers) (OAuth Apps → New OAuth App)
- **Google Gemini API Key** - [Get key here](https://aistudio.google.com/app/apikey)

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/tharunprinz/Devfolio-AI.git
cd Devfolio-AI
```

### 2. Install frontend dependencies

```bash
cd frontend
npm install
cd ..
```

### 3. Configuration

#### Root Environment Variables

Create a file named `.env` in the **project root** and add the following:

```env
# Google Gemini API Key (Required for AI generation features)
GEMINI_API_KEY=your_gemini_api_key_here

# GitHub OAuth App Credentials
# Create at: https://github.com/settings/developers → OAuth Apps
# Homepage URL: http://localhost:5173
# Callback URL:  http://localhost:5173/login
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# MongoDB Connection URI
# Local:  mongodb://localhost:27017/devportfolio
# Atlas:  mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/devportfolio
MONGODB_URI=mongodb://localhost:27017/devportfolio

# CORS Allowed Origins (comma-separated)
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

#### Frontend Environment Variables

Create a file named `frontend/.env` and add:

```env
VITE_GITHUB_CLIENT_ID=your_github_client_id_here
VITE_API_BASE_URL=http://localhost:8080/api
```

**Important Notes:**
- `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`: Create an OAuth App at https://github.com/settings/developers
- `MONGODB_URI`: Get from MongoDB Atlas → Connect → Drivers → copy the connection string
- `GEMINI_API_KEY`: Free tier available at Google AI Studio
- Never commit your `.env` files — they are gitignored by default

---

## Usage

### 1. Start everything with the run script

```bash
chmod +x run.sh
./run.sh
```

This script auto-detects Java, downloads Maven if needed, loads your `.env`, and starts the Spring Boot backend.

### 2. Start the frontend development server

In a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will run on **http://localhost:5173**

### 3. Use the application

1. Open your browser and navigate to **http://localhost:5173**
2. Click **Connect with GitHub** to authenticate
3. Go to the **Dashboard** → sync your GitHub repositories
4. Navigate to **Portfolio Builder** → generate your AI-powered portfolio
5. Navigate to **Resume Builder** → generate your tailored resume
6. Visit **AI Insights** for a deep-dive into your coding profile
7. Share your public portfolio URL with anyone — no login required

---

## Project Structure

```
Devfolio-AI/
│
├── backend/
│   ├── src/main/java/com/devportfolio/
│   │   ├── config/
│   │   │   └── SecurityConfig.java        # Spring Security + CORS
│   │   ├── controller/
│   │   │   ├── AuthController.java        # GitHub OAuth endpoints
│   │   │   ├── GitHubController.java      # Repo sync endpoints
│   │   │   ├── PortfolioController.java   # Portfolio CRUD
│   │   │   ├── ResumeController.java      # Resume CRUD
│   │   │   ├── AIController.java          # AI insights, roast, cover letter
│   │   │   ├── ProjectController.java     # Project analysis
│   │   │   └── PublicPortfolioController.java # Public portfolio + chatbot
│   │   ├── dto/
│   │   │   ├── AuthRequest.java
│   │   │   └── AuthResponse.java
│   │   ├── entity/
│   │   │   ├── User.java                  # MongoDB document
│   │   │   ├── Repository.java            # GitHub repo document
│   │   │   ├── Portfolio.java             # Portfolio document
│   │   │   ├── Resume.java                # Resume document
│   │   │   └── AIInsight.java             # AI analysis document
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   ├── RepositoryRepository.java
│   │   │   ├── PortfolioRepository.java
│   │   │   ├── ResumeRepository.java
│   │   │   └── AIInsightRepository.java
│   │   ├── security/
│   │   │   ├── JwtUtils.java              # JWT generation & validation
│   │   │   ├── AuthTokenFilter.java       # JWT request filter
│   │   │   ├── AuthEntryPointJwt.java     # 401 handler
│   │   │   ├── CustomUserDetails.java
│   │   │   └── UserDetailsServiceImpl.java
│   │   ├── service/
│   │   │   ├── UserService.java           # User logic
│   │   │   ├── GitHubService.java         # GitHub API client
│   │   │   └── AIService.java             # Gemini AI integration
│   │   └── DevfolioApplication.java   # Spring Boot entry point
│   ├── src/main/resources/
│   │   └── application.properties         # App configuration
│   ├── Procfile                            # Render start command
│   └── pom.xml                            # Maven dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── DashboardLayout.jsx
│   │   │   │   ├── Navbar.jsx
│   │   │   │   └── Sidebar.jsx
│   │   │   ├── portfolio/
│   │   │   │   └── ChatbotWidget.jsx      # AI chatbot on public portfolio
│   │   │   └── ui/
│   │   │       └── BrandIcons.jsx
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx            # Home / marketing page
│   │   │   ├── Login.jsx                  # GitHub OAuth login
│   │   │   ├── PublicPortfolio.jsx        # Shareable public portfolio
│   │   │   └── dashboard/
│   │   │       ├── Dashboard.jsx          # Overview dashboard
│   │   │       ├── GitHubAnalysis.jsx     # Repo sync & analysis
│   │   │       ├── PortfolioBuilder.jsx   # Portfolio generator
│   │   │       ├── ResumeBuilder.jsx      # Resume generator
│   │   │       ├── AIInsights.jsx         # AI insights panel
│   │   │       └── Settings.jsx           # User settings
│   │   ├── services/
│   │   │   └── api.js                     # Axios API client + interceptors
│   │   ├── App.jsx                        # Routes & auth guard
│   │   ├── main.jsx                       # Entry point
│   │   └── index.css                      # Global styles
│   ├── vercel.json                        # Vercel SPA routing config
│   ├── vite.config.js
│   └── package.json
│
├── render.yaml                            # Render deployment config
├── docker-compose.yml                     # Local MongoDB (optional)
├── run.sh                                 # One-command local startup script
├── .env.example                           # Environment variable template
├── .gitignore
└── README.md
```

---

## API Endpoints

### Authentication

```http
POST /api/auth/github
Content-Type: application/json

{ "code": "github_oauth_code" }
```

### GitHub Repositories

```http
GET  /api/github/repos       # List synced repositories
POST /api/github/sync        # Sync latest repos from GitHub
```

### Portfolio

```http
GET    /api/portfolios                    # List all portfolios
POST   /api/portfolios                    # Generate new portfolio
GET    /api/portfolios/:id                # Get portfolio by ID
PUT    /api/portfolios/:id                # Update portfolio
GET    /api/public/portfolios/:url        # View public portfolio (no auth)
POST   /api/public/portfolios/:url/chat   # Chat with portfolio AI
```

### Resume

```http
GET    /api/resumes           # List all resumes
POST   /api/resumes           # Generate new resume
GET    /api/resumes/:id       # Get resume by ID
PUT    /api/resumes/:id       # Update resume
POST   /api/resumes/:id/polish # AI polish with custom instructions
```

### AI Features

```http
GET    /api/ai/insights                 # Get AI profile insights
POST   /api/ai/insights/regenerate      # Regenerate insights
GET    /api/ai/roast                    # Get AI roast of your profile
POST   /api/ai/cover-letter             # Generate cover letter
POST   /api/ai/linkedin-about           # Generate LinkedIn About section
```

---

## Deployment

### Backend → Render

1. Go to [render.com](https://render.com) → **New → Web Service**
2. Connect repo `tharunprinz/Devfolio-AI`, set **Root Directory** to `backend`
3. Set **Build Command**: `mvn clean package -DskipTests`
4. Set **Start Command**: `java -jar target/backend-0.0.1-SNAPSHOT.jar`
5. Add environment variables in the Render dashboard:
   `MONGODB_URI`, `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`, `GEMINI_API_KEY`, `CORS_ALLOWED_ORIGINS`

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import repo `tharunprinz/Devfolio-AI`, set **Root Directory** to `frontend`
3. Add environment variables: `VITE_GITHUB_CLIENT_ID`, `VITE_API_BASE_URL` (your Render URL)
4. Deploy — Vercel auto-detects Vite

> After deploying, update your GitHub OAuth App callback URL to `https://your-app.vercel.app/login`  
> and update `CORS_ALLOWED_ORIGINS` in Render to match your Vercel URL.

---

## Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add your feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/your-feature
   ```
5. **Open a Pull Request**

Please include:
- Clear description of changes
- Screenshots for UI changes
- Manual verification steps

---

## Tech Stack

### Frontend
- **React 19** — UI library
- **Vite 8** — Build tool
- **React Router 7** — Routing
- **Tailwind CSS 4** — Styling
- **Framer Motion** — Animations
- **Lucide React** — Icons
- **Axios** — HTTP client
- **TanStack Query** — Server state management

### Backend
- **Java 17** — Runtime
- **Spring Boot 3.2.5** — Web framework
- **Spring Data MongoDB** — Database ORM
- **Spring Security** — Auth & authorization
- **JWT (JJWT 0.11.5)** — Token-based authentication
- **WebFlux / WebClient** — Reactive HTTP for GitHub & Gemini APIs
- **Google Gemini API** — AI generation (portfolios, resumes, insights)
- **MongoDB Atlas** — Cloud database

---

## License

This project is licensed under the **MIT License**.

---

<div align="center">

**⭐ Star this repo if you find it useful!**

**Author: [tharunprinz](https://github.com/tharunprinz)**

*Build your developer story — powered by AI*

</div>
