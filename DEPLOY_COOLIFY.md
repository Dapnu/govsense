# Deploy to VPS using Coolify (step-by-step)

This guide explains how to deploy the GovSense frontend and backend to a VPS using Coolify. It assumes you already have Coolify installed on your VPS or you have access to a Coolify instance that can reach your Git repository.

Summary of current repo configuration (important)
- Backend: `backend/Dockerfile` — uvicorn serving FastAPI. Container port: 9000 (changed to avoid conflicts).
- Frontend: `frontend/Dockerfile` — multi-stage build (Node build -> nginx). Nginx configured to listen on container port 8081.
- Backend requires the environment variable `GEMINI_API_KEY`. The app will raise an error at startup if this is missing.
- The frontend can be served as a static build or via the included Dockerfile.

Prerequisites
- A Git repository for this project (GitHub / GitLab / Bitbucket) that your Coolify instance can access.
- Coolify installed and reachable (self-hosted on your VPS or a hosted Coolify instance).
- DNS control for your domain to point to your VPS IP (for HTTPS via Let's Encrypt).

High-level options
- Option A (recommended): Let Coolify build from Dockerfiles in this repo (one app per service). This is simplest and uses the Dockerfiles in `backend/` and `frontend/`.
- Option B: Let Coolify run build commands and publish static files (frontend) and use the backend Dockerfile. This is useful if you prefer Coolify's static site builder.
- Option C: Build images in CI and push to a registry; then deploy images from registry in Coolify.

Step-by-step: push repo and connect it to Coolify
1. Push your repo to a Git provider (example commands):

```bash
git remote add origin git@github.com:youruser/govsense.git
git push -u origin main
```

2. In Coolify: connect your Git provider (GitHub/GitLab/Bitbucket) and grant access to the repository.

Deploy the backend (using its Dockerfile)
1. In Coolify, create a new application and choose the Docker/Dockerfile option.
2. Repository: select this repo.
3. Dockerfile path: `backend/Dockerfile` (or the build context `backend/` depending on UI).
4. Container port: set to `9000` (this matches the `EXPOSE` and uvicorn port in the Dockerfile).
5. Environment variables / Secrets (CRITICAL):
   - `GEMINI_API_KEY` = <your Gemini API key>
   - Any other runtime variables your app needs (e.g., SENTRY_DSN)
   Add them in Coolify's Environment variables / Secrets area and mark secrets as private.
6. Health check: set a health check to `GET /` (the backend root returns a JSON status).
7. Create/Deploy. Coolify will build the Docker image from `backend/Dockerfile`, run it with container port 9000, and expose a domain.

Deploy the frontend (Dockerfile approach — recommended)
1. In Coolify, create another application and choose Docker/Dockerfile.
2. Repository: select this repo.
3. Dockerfile path: `frontend/Dockerfile`.
4. Container port: set to `8081` (matches `nginx.conf` shipped in `frontend/`).
5. Environment variables (optional):
   - `REACT_APP_API_URL` = https://api.example.com (the production backend URL). If you set this, you must rebuild the frontend so the value is compiled into the bundle. If you prefer runtime config, implement an env-fetch in the frontend.
6. Create/Deploy. Coolify will run `npm ci` and `npm run build` in the build stage and create a static site served by nginx inside the container.

Alternative frontend: static-site build in Coolify
- If you'd rather use Coolify's static site option, set:
  - Build command: `npm ci --legacy-peer-deps && npm run build`
  - Publish directory: `frontend/build`
- Then set `REACT_APP_API_URL` in the static site builder's build environment variables so the build includes the correct API URL.

Domains and SSL
- After deployment, in each Coolify app you can add a domain (e.g., `api.example.com` for the backend, `app.example.com` for the frontend).
- Add the appropriate DNS records (A record) that point your domain to your VPS public IP.
- In Coolify, enable Let's Encrypt / SSL for the domain. Coolify will request certificates automatically.

CORS and security
- Backend currently sets CORS to allow all origins. For production, update the CORS middleware to allow only your frontend origin(s), e.g. `https://app.example.com`.
- Make sure `GEMINI_API_KEY` and any secrets are stored only in Coolify's env/secrets and not committed to git.

Local verification commands (before pushing to Coolify)
- Build & run backend container locally (container port 9000):

```bash
docker build -t govsense-backend -f backend/Dockerfile ./backend
docker run --rm -p 9000:9000 -e GEMINI_API_KEY="your_key_here" govsense-backend
# then test
curl -s http://localhost:9000/ | jq .
```

- Build & run frontend container locally (container port 8081):

```bash
docker build -t govsense-frontend -f frontend/Dockerfile ./frontend
docker run --rm -p 8081:8081 govsense-frontend
# then open http://localhost:8081
```

Verification after Coolify deployment
- Backend health: `curl -sS https://api.example.com/ | jq .` should return the status JSON.
- Frontend: open `https://app.example.com` in a browser — the SPA should load.
- Cross-check the frontend calling the API by exercising a simple endpoint (e.g., using the app UI or directly with curl).

Troubleshooting
- Build fails due to Node dependency errors: try using `npm ci --legacy-peer-deps` in the build command (this repo's Dockerfile uses `npm ci --legacy-peer-deps`).
- Backend fails at startup complaining about `GEMINI_API_KEY`: set the env var in Coolify before starting the app.
- Coolify build times out: check logs in Coolify for build output and increase build timeout (if the UI supports it), or build image in CI and push to a registry.
- Port conflicts: ensure you set container ports to `9000` (backend) and `8081` (frontend) in Coolify app settings — do not assume host ports.

Optional: CI/CD (quick outline)
- Add a GitHub Actions workflow that builds & pushes images to Docker Hub, then trigger a Coolify deployment by connecting to the registry or calling Coolify's API (if available).

Files added to support this guide
- `frontend/Dockerfile` — multi-stage build to create a static build and serve with nginx.
- `frontend/nginx.conf` — nginx listens on 8081 and serves the SPA with fallback.
- `frontend/.dockerignore` — to reduce build context size.

FAQ / common commands
- How do I change the backend port? Update `backend/Dockerfile` and change the container port in Coolify. Also update any local run commands.
- How to set env vars in Coolify? In the app settings, go to Environment Variables / Secrets and add them there; mark sensitive values as secret.

If you'd like, I can also:
- Add `backend/.env.example` to the repo (without secrets) for documentation.
- Create a short `README.md` snippet and link to this file.
- Create a GitHub Actions workflow that builds and pushes Docker images to Docker Hub on each push.

Done — follow the steps above to deploy. If you want, I can now add `backend/.env.example` and a short README snippet describing required envs.
