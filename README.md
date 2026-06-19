# ⚡ NexusRoute AI

> Intelligent full-stack route planning — real routes, live weather, traffic analysis, and an AI engine that picks the best path.

![NexusRoute AI Banner](https://via.placeholder.com/1200x400/050a14/00e5ff?text=NexusRoute+AI)

---

## ✨ Features

| Feature | Details |
|---|---|
| 🗺️ **Interactive Map** | Leaflet-powered dark map with custom markers |
| 🔵🟢 **Dual Routes** | Main route (cyan) + Alternative route (green dashed) |
| 📏 **Route Stats** | Distance (km), ETA, and average speed |
| 🌤️ **Live Weather** | Temperature, humidity, wind at start, midpoint, and end |
| 🚦 **Traffic Status** | Heuristic traffic estimation per route |
| 🤖 **AI Recommendation** | Scoring engine weighing distance, time, traffic, and weather |

---

## 🗂️ Project Structure

```
NexusRoute-AI/
├── backend/
│   ├── app.py                 # Flask API (routing, weather, AI)
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchPanel.jsx      # City input + popular routes
│   │   │   ├── MapView.jsx          # Leaflet map with routes & markers
│   │   │   ├── RouteCard.jsx        # Distance / ETA / traffic card
│   │   │   ├── WeatherPanel.jsx     # 3-point weather display
│   │   │   ├── AIRecommendation.jsx # AI scoring & recommendation
│   │   │   ├── LoadingState.jsx     # Animated loading screen
│   │   │   └── ErrorBanner.jsx      # Error display
│   │   ├── hooks/
│   │   │   └── useRouteQuery.js     # Axios data-fetching hook
│   │   ├── utils/
│   │   │   └── helpers.js           # Formatting utilities
│   │   ├── App.jsx                  # Root layout
│   │   ├── index.js
│   │   └── index.css               # Tailwind + custom styles
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env.example
│
├── .vscode/
│   ├── nexusroute.code-workspace
│   └── launch.json
├── .gitignore
└── README.md
```

---

## 🔑 API Keys Required

### 1. OpenRouteService (Free)
- Sign up → [openrouteservice.org/dev/#/signup](https://openrouteservice.org/dev/#/signup)
- Go to **Dashboard → Tokens** and copy your API key.
- Free tier: **2,000 requests/day**.

### 2. OpenWeatherMap (Free)
- Sign up → [home.openweathermap.org/users/sign_up](https://home.openweathermap.org/users/sign_up)
- Go to **API Keys** tab and copy your key.
- Free tier: **60 calls/minute**.

---

## 🚀 Setup & Run in VS Code

### Prerequisites
- **Python 3.9+** — [python.org](https://python.org)
- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **Git** — [git-scm.com](https://git-scm.com)

---

### Step 1 — Clone the repository

```bash
git clone https://github.com/your-username/NexusRoute-AI.git
cd NexusRoute-AI
```

---

### Step 2 — Backend Setup

```bash
# Navigate to backend folder
cd backend

# Create a virtual environment
python -m venv venv

# Activate it
# macOS / Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create your .env file
cp .env.example .env
```

Open `backend/.env` and fill in your API keys:

```env
ORS_API_KEY=your_openrouteservice_api_key_here
OWM_API_KEY=your_openweathermap_api_key_here
```

Start the Flask server:

```bash
python app.py
```

You should see:
```
 * Running on http://127.0.0.1:5000
 * Debug mode: on
```

---

### Step 3 — Frontend Setup

Open a **new terminal** in VS Code (`Ctrl+Shift+\`):

```bash
# Navigate to frontend folder
cd frontend

# Install Node packages
npm install

# Create your .env file (optional — defaults to localhost:5000)
cp .env.example .env

# Start the React dev server
npm start
```

The browser will open automatically at **http://localhost:3000**.

---

### Step 4 — Open in VS Code

```bash
# From the project root
code .

# Or open the workspace file
code .vscode/nexusroute.code-workspace
```

Use the **Run & Debug** panel (`Ctrl+Shift+D`) to launch the Flask backend with breakpoint support.

---

## 🧪 Test the API Directly

```bash
curl -X POST http://localhost:5000/api/route \
  -H "Content-Type: application/json" \
  -d '{"origin": "Hyderabad", "destination": "Warangal"}'
```

Expected response shape:
```json
{
  "origin": { "lat": 17.38, "lng": 78.47, "label": "Hyderabad, India" },
  "destination": { "lat": 17.97, "lng": 79.59, "label": "Warangal, India" },
  "main_route": { "polyline": [...], "distance_km": 145.2, "duration_min": 142.5, "traffic": "Low" },
  "alternative_route": { "polyline": [...], "distance_km": 162.8, "duration_min": 154.1, "traffic": "Low" },
  "weather": { "start": {...}, "end": {...}, "midpoint": {...} },
  "recommendation": { "recommended_route": "main", "confidence": "High", "summary": "..." }
}
```

---

## 🌐 Deploying to GitHub

```bash
# From project root
git init
git add .
git commit -m "feat: initial NexusRoute AI project"
git branch -M main
git remote add origin https://github.com/your-username/NexusRoute-AI.git
git push -u origin main
```

> **Note:** Never commit your `.env` files. They are already in `.gitignore`.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Tailwind CSS, Leaflet / react-leaflet |
| **Backend** | Python 3, Flask, Flask-CORS |
| **Routing API** | OpenRouteService v2 Directions |
| **Weather API** | OpenWeatherMap Current Weather |
| **AI Engine** | Rule-based scoring (distance · time · weather · traffic) |
| **HTTP Client** | Axios (frontend), Requests (backend) |

---

## 🔮 Future Enhancements

- [ ] Turn-by-turn directions panel
- [ ] Road type breakdown (highway vs local)
- [ ] Historical traffic patterns
- [ ] Multi-waypoint routing
- [ ] GPX export
- [ ] LLM-powered AI narration (Claude / GPT)

---

## 📄 License

MIT © 2024 NexusRoute AI
