# Mai-AI Deployment Status

**Date**: January 18, 2026

## Completed

| Service | URL | Platform | Status |
|---------|-----|----------|--------|
| Landing Page | mai-ai.app | Cloudflare Pages | ✅ Live |
| PWA | app.mai-ai.app | Vercel | ✅ Live |
| API | api.mai-ai.app / mai-ai-api.onrender.com | Render | ✅ Deployed |

## DNS Records (Cloudflare)

| Type | Name | Target |
|------|------|--------|
| CNAME | @ | mai-ai-website.pages.dev |
| CNAME | app | cname.vercel-dns.com |
| CNAME | api | mai-ai-api.onrender.com |

## Pending: Backend Tunnel

The public API needs to connect to your private ALFRED_PRIME backend.

### Steps to complete:

1. **Install cloudflared**:
   ```powershell
   winget install Cloudflare.cloudflared
   ```
   Then restart PowerShell.

2. **Start ALFRED server** (Terminal 1):
   ```powershell
   cd "C:\BATDAN Gx Private\ALFRED_PRIME"
   python main.py --server
   ```

3. **Create tunnel** (Terminal 2):
   ```powershell
   cloudflared tunnel --url http://localhost:8000
   ```
   Copy the URL it outputs (like `https://random-words.trycloudflare.com`)

4. **Add to Render**:
   - Go to: https://dashboard.render.com → mai-ai-api → Environment
   - Add: `MAIAI_BACKEND_URL` = `<your tunnel URL>`
   - Save and redeploy

## Files Modified

- `C:\Users\danie\Projects\MaiAI-Birth\` - Public SaaS repo
- `C:\BATDAN Gx Private\ALFRED_PRIME\.env` - Changed to `DEFAULT_PROVIDER=groq`

## Notes

- Anthropic credits are empty - using Groq instead
- ALFRED_PRIME and GX_TECH repos are now private
- MaiAI-Birth is the clean public repo (no patent code)
