# 🚀 Deploying SYNAPSE ML Platform to Render

This project is fully configured for seamless, zero-configuration deployment on **Render** as a unified single-service web application (combining the FastAPI backend and the React Vite frontend).

---

## 🌟 Method 1: Render Blueprint (Recommended & 1-Click)

The repository includes a ready-to-use [`render.yaml`](./render.yaml) file configured for Docker.

1. Push your code to your GitHub repository:
   ```bash
   git add .
   git commit -m "Configure production deployment for Render"
   git push origin main
   ```
2. Log in to your [Render Dashboard](https://dashboard.render.com/).
3. Click the **"New +"** button at top right and select **"Blueprint"**.
4. Connect your GitHub repository (`AP62-Main/SYNAPSE`).
5. Render will automatically detect [`render.yaml`](./render.yaml) and configure:
   - **Service Name:** `synapse-ml`
   - **Environment:** Docker (`Dockerfile`)
   - **Health Check Path:** `/api/health`
   - **Plan:** Free
6. Click **"Apply"**. Render will build the React frontend, package the Python ML environment, and launch your live site!

---

## 🛠️ Method 2: Manual Web Service Setup (Docker)

If you prefer to configure the Web Service manually via the Render UI:

1. In Render Dashboard, click **"New +"** -> **"Web Service"**.
2. Connect your GitHub repository (`AP62-Main/SYNAPSE`).
3. Fill in the following fields:
   - **Name:** `synapse-ml` (or any custom name)
   - **Region:** Choose the region closest to you (e.g., Oregon, Frankfurt, Singapore)
   - **Branch:** `main`
   - **Root Directory:** *(leave blank)*
   - **Runtime:** **Docker**
   - **Dockerfile Path:** `./Dockerfile`
   - **Docker Build Context:** `.`
   - **Instance Type:** **Free**
4. Expand **Advanced**:
   - **Health Check Path:** `/api/health`
5. Click **"Create Web Service"**.

---

## 🐍 Method 3: Manual Web Service Setup (Native Python)

If you wish to use Render's native Python runtime rather than Docker:

1. In Render Dashboard, click **"New +"** -> **"Web Service"**.
2. Connect your GitHub repository.
3. Configure the following fields:
   - **Name:** `synapse-ml`
   - **Branch:** `main`
   - **Root Directory:** *(leave blank)*
   - **Runtime:** **Python 3**
   - **Build Command:** `./build.sh`
   - **Start Command:** `python run.py`
   - **Instance Type:** **Free**
4. Under **Advanced Settings**:
   - Add Environment Variable:
     - `PYTHON_VERSION` = `3.11.9`
   - **Health Check Path:** `/api/health`
5. Click **"Create Web Service"**.

*(The included `./build.sh` script automatically provisions Node.js via `nodeenv`, builds the React frontend bundle, installs all Python dependencies, and serves the static assets through FastAPI.)*

---

## 🔍 Verification & Health Check

Once your deployment completes, visit your Render URL:
- **Application Frontend:** `https://<your-render-subdomain>.onrender.com/`
- **Health Check:** `https://<your-render-subdomain>.onrender.com/api/health`
  - Expected JSON: `{"status": "ok", "models_loaded": true, "frontend_loaded": true}`
- **Interactive Documentation:** `https://<your-render-subdomain>.onrender.com/docs`
