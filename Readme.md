# Personal Fitness Tracker AI Assistant

A simple, modular, and production-clean Personal Fitness Tracker AI Assistant built with FastAPI (Python), React + Vite (TypeScript), and the Gemini API.

## Project Structure
- `backend/`: FastAPI Python backend with SQLite.
- `frontend/`: React + Vite frontend.

## Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   .\venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the FastAPI server (it will start on port 6969):
   ```bash
   uvicorn main:app --reload --port 6969
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server (it will start on port 4200):
   ```bash
   npm run dev
   ```

### 3. Usage
- Open your browser and go to `http://localhost:4200`.
- Setup your profile, log workouts, and generate AI recommendations.
- **Important**: You need to provide your own Gemini API key in the UI to generate recommendations. The API key is only used during the session and is NOT stored permanently on the backend.

### What NOT to do
- Do not commit your Gemini API key or any secrets to GitHub.
- Do not expect medical advice; the AI recommendations are for general guidance only and are constrained with safety guardrails.

## Deployment to GitHub
1. Make sure you don't have any sensitive information hardcoded.
2. The project includes a `.gitignore` to avoid pushing `node_modules/`, `venv/`, and the local SQLite database (`fitness.db`).
3. Push the main code:
   ```bash
   git add .
   git commit -m "Your message"
   git push
   ```