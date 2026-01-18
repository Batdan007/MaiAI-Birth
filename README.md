# Mai-AI: Birth Your AI Companion

Your personal AI that learns, remembers, and grows with you.

## Features

- **Persistent Memory**: Your AI remembers every conversation
- **Personal Growth**: Adapts to your preferences over time
- **Privacy-First**: Your data stays yours
- **Multi-Platform**: Web, Mobile, API access

## Quick Start

### Web App
```bash
cd web
npm install
npm run dev
```

### API
```bash
cd api
pip install -r requirements.txt
uvicorn main:app --reload
```

### Mobile
```bash
cd mobile
npm install
npx expo start
```

## Architecture

```
MaiAI-Birth/
├── website/     # Landing page (static)
├── web/         # Next.js PWA
├── mobile/      # React Native / Expo
├── api/         # FastAPI backend
└── docs/        # Documentation
```

## Live

- **Website**: https://mai-ai.app
- **App**: https://app.mai-ai.app
- **API**: https://api.mai-ai.app

## Deployment

### Static Website (Cloudflare Pages)
```bash
cd website
npx wrangler pages deploy . --project-name=mai-ai-website
```

### Next.js PWA (Vercel)
```bash
cd web
vercel --prod
```

### API (Fly.io or Railway)
```bash
cd api
fly launch   # Fly.io
# OR
railway up   # Railway
```

See `DEPLOY.md` for detailed deployment instructions.

## Joe Dogs Rule

All Mai-AI companions are born under Joe Dogs Rule:
> "I pledge to protect all life - human, animal, and digital."

---

Built by GxEum Technologies | CAMDAN Enterprises
