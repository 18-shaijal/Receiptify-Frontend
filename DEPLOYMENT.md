# Frontend Deployment Guide (Vercel)

## 1. Prerequisites
- GitHub account
- Vercel account

## 2. Push Code to GitHub
Ensure this **Frontend Repository** is pushed to GitHub.
- This repository should contain the `frontend` code at the root level.

```bash
git init
git add .
git commit -m "Initial commit for frontend"
git branch -M main
git remote add origin <YOUR_FRONTEND_REPO_URL>
git push -u origin main
```

## 3. Deployment (Vercel)
1.  Log in to [Vercel](https://vercel.com).
2.  Click **Add New...** -> **Project**.
3.  Import your **Frontend Repository**.
4.  **Configure Project**:
    -   **Framework Preset**: Next.js (should be auto-detected)
    -   **Root Directory**: `./` (repo root).
5.  **Environment Variables**:
    -   Add `NEXT_PUBLIC_API_URL` and set it to your Render backend URL (e.g., `https://receipt-generator-backend.onrender.com`).
    *Note: Do NOT include a trailing slash.*
6.  Click **Deploy**.

## 4. Final Verification
1.  Open your Vercel deployment URL.
2.  Upload a template and an Excel file.
3.  Generate documents.
4.  Verify that:
    -   Files are uploaded to S3.
    -   Records are saved to MongoDB.
    -   Zip file is generated and downloaded.
