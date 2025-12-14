# ZenTask AI

A beautiful, full-stack task management application with AI capabilities.

## Features
- **Smart AI Brainstorming**: Ask Gemini to plan projects for you.
- **Magic Split**: Break down complex tasks into subtasks instantly.
- **Dual Mode**: Works entirely in the browser (Local) or connects to a Python backend.
- **Modern UI**: Glassmorphism design with smooth animations.

## Local Development

1. **Frontend**: The app runs directly via the provided preview link or any React environment.
2. **Backend (Optional)**:
   - Install dependencies: `pip install fastapi uvicorn`
   - Run server: `python backend.py`
   - Switch mode to "Python" in the UI.

## Deployment

### Frontend (Vercel/Netlify)
1. Push this code to a GitHub repository.
2. Connect the repo to Vercel or Netlify.
3. Set the Build Command to `npm run build` (or equivalent).
4. Add your `API_KEY` (Gemini) in the environment variables.

### Backend (Render/Railway)
1. Create a `requirements.txt` containing:
   ```
   fastapi
   uvicorn
   ```
2. Deploy the repo to Render/Railway.
3. Update `API_URL` in `constants.ts` to point to your deployed backend URL.
