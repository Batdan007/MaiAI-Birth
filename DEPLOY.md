# Mai-AI Deployment Guide

Domain: **https://mai-ai.app**

## Architecture

```
mai-ai.app (Landing Page)     → Cloudflare Pages
├── app.mai-ai.app (PWA)      → Vercel
└── api.mai-ai.app (Backend)  → Fly.io / Railway
```

---

## 1. Static Website → Cloudflare Pages

### Option A: Cloudflare Dashboard (Recommended)

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/) → Pages
2. Click "Create a project" → "Connect to Git"
3. Select the `MaiAI-Birth` repo
4. Configure build settings:
   - **Project name**: `mai-ai-website`
   - **Production branch**: `main`
   - **Build command**: (leave empty)
   - **Build output directory**: `website`
5. Deploy

### Option B: Wrangler CLI

```bash
cd website
npx wrangler pages deploy . --project-name=mai-ai-website
```

### DNS Configuration

Add to Cloudflare DNS:
- `CNAME` → `mai-ai.app` → `mai-ai-website.pages.dev`

---

## 2. Next.js PWA → Vercel

### Option A: Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import `MaiAI-Birth` repo
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `web`
   - **Environment Variables**:
     - `NEXT_PUBLIC_API_URL` = `https://api.mai-ai.app`
5. Deploy

### Option B: Vercel CLI

```bash
cd web
npm i -g vercel
vercel login
vercel --prod
```

### Domain Configuration

In Vercel Dashboard → Settings → Domains:
- Add `app.mai-ai.app`
- Configure DNS: `CNAME` → `app.mai-ai.app` → `cname.vercel-dns.com`

---

## 3. API → Fly.io

### First-time Setup

```bash
# Install Fly CLI
# Windows: iwr https://fly.io/install.ps1 -useb | iex
# Mac/Linux: curl -L https://fly.io/install.sh | sh

fly auth login
cd api
fly launch --name mai-ai-api --region ord
```

### Environment Variables

```bash
fly secrets set MAIAI_BACKEND_URL=http://your-private-backend:8080
fly secrets set ENVIRONMENT=production
```

### Deploy

```bash
fly deploy
```

### Domain Configuration

```bash
fly certs add api.mai-ai.app
```

Then add DNS: `CNAME` → `api.mai-ai.app` → `mai-ai-api.fly.dev`

---

## Alternative: Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

cd api
railway login
railway init
railway up
```

Add custom domain in Railway Dashboard → Settings → Domains.

---

## Environment Variables Summary

| Service | Variable | Value |
|---------|----------|-------|
| Web (Vercel) | `NEXT_PUBLIC_API_URL` | `https://api.mai-ai.app` |
| API (Fly/Railway) | `MAIAI_BACKEND_URL` | Your private backend URL |
| API | `ENVIRONMENT` | `production` |

---

## DNS Records (Cloudflare)

| Type | Name | Content |
|------|------|---------|
| CNAME | `@` | `mai-ai-website.pages.dev` |
| CNAME | `app` | `cname.vercel-dns.com` |
| CNAME | `api` | `mai-ai-api.fly.dev` |

---

## Quick Deploy Commands

```bash
# Deploy everything
./deploy.sh

# Or individually:
cd website && npx wrangler pages deploy . --project-name=mai-ai-website
cd web && vercel --prod
cd api && fly deploy
```
