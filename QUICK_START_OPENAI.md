# 🚀 Quick Start - OpenAI Integration

## ⚡ 3 Steps to Get Started

### 1️⃣ Add Your API Key

Open `.env` and update this line:

```env
OPENAI_API_KEY="sk-proj-YOUR_NEW_KEY_HERE"
```

🚨 **IMPORTANT**: 
- Get a NEW key from https://platform.openai.com/api-keys
- REVOKE the old key you shared in chat (security risk!)

### 2️⃣ Start the Dev Server

```bash
npm run dev
```

### 3️⃣ Test It!

Open in browser: **http://localhost:3000/test-ai**

---

## ✨ What You Can Do Now

### 1. Test Page (Easiest)
Visit `/test-ai` and try these prompts:
- "write a haiku about ai"
- "Give me 5 product names for smart water bottles"
- "Explain machine learning in simple terms"

### 2. API Endpoints (For Your Code)

```javascript
// Generate any text
fetch('/api/ai/test', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    prompt: 'write a haiku about ai' 
  })
}).then(r => r.json()).then(d => console.log(d.output_text));

// Get product suggestions
fetch('/api/ai/suggestions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    query: 'gifts for mom',
    limit: 5
  })
}).then(r => r.json()).then(d => console.log(d.suggestions));

// Chat assistant
fetch('/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    message: 'I need a laptop for gaming'
  })
}).then(r => r.json()).then(d => console.log(d.response));
```

### 3. Add AI Chat Widget

In any page file (e.g., `app/(shop)/page.tsx`):

```tsx
import { AIChat } from '@/components/ai/AIChat';

export default function HomePage() {
  return (
    <div>
      {/* Your existing content */}
      
      <AIChat /> {/* Adds floating chat button */}
    </div>
  );
}
```

---

## 📁 What Was Added

```
ecommerce/
├── lib/
│   └── openai.ts                    ← Core OpenAI functions
├── app/
│   ├── api/ai/
│   │   ├── test/route.ts           ← Test endpoint
│   │   ├── chat/route.ts           ← Chat assistant
│   │   ├── suggestions/route.ts    ← Product suggestions
│   │   └── generate-description/   ← Auto-descriptions
│   └── test-ai/
│       └── page.tsx                 ← Visual test page
├── components/ai/
│   ├── AIChat.tsx                   ← Floating chat widget
│   └── AIProductSearch.tsx          ← AI search component
└── .env                             ← Add your API key here
```

---

## 🔐 Security Checklist

✅ API key in `.env` (not in code)  
✅ `.env` in `.gitignore`  
✅ All AI calls in backend API routes  
✅ No API key exposed to browser  

❌ Never put API key in frontend JavaScript  
❌ Never commit `.env` to Git  
❌ Never share API keys in chat/screenshots  

---

## 💡 Example Use Cases for Your E-commerce Store

1. **Product Descriptions**: Auto-generate descriptions for new products
2. **Customer Support**: AI chatbot to answer customer questions
3. **Product Search**: "Show me gifts for tech enthusiasts"
4. **Marketing Copy**: Generate email campaigns, ads, etc.
5. **SEO Content**: Generate meta descriptions and tags

---

## 📖 Full Documentation

See `OPENAI_INTEGRATION.md` for complete guide with all functions and examples.

---

## 🐛 Quick Troubleshooting

**"Missing OPENAI_API_KEY"**
→ Add key to `.env` and restart server

**"Invalid API key"**
→ Get new key from https://platform.openai.com/api-keys

**Test page not loading**
→ Make sure dev server is running (`npm run dev`)

---

**You're all set! 🎉**

Start at http://localhost:3000/test-ai
