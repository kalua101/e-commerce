# OpenAI Integration Guide

## ✅ What's Been Added

Your Next.js e-commerce project now has OpenAI integration using the **Responses API** with the `gpt-6-luna` model.

### Files Created:

1. **`lib/openai.ts`** - Core OpenAI integration with helper functions
2. **`app/api/ai/test/route.ts`** - Test endpoint (like your Python example)
3. **`app/api/ai/chat/route.ts`** - Chat assistant endpoint
4. **`app/api/ai/suggestions/route.ts`** - Product suggestions endpoint
5. **`app/api/ai/generate-description/route.ts`** - Product description generator
6. **`app/test-ai/page.tsx`** - Visual test page
7. **`components/ai/AIChat.tsx`** - AI chat widget component
8. **`components/ai/AIProductSearch.tsx`** - AI-powered product search

---

## 🔐 Setup Instructions

### Step 1: Get Your API Key (CRITICAL)

⚠️ **You MUST revoke the API key you shared in chat immediately!**

1. Go to: https://platform.openai.com/api-keys
2. **Revoke** the old key (the one that starts with `sk-proj-tkyxn...`)
3. Click **"Create new secret key"**
4. Copy the new key (you'll only see it once)

### Step 2: Add API Key to .env

Open `.env` file and replace `your_new_openai_api_key_here` with your actual key:

```env
OPENAI_API_KEY="sk-proj-YOUR_ACTUAL_NEW_KEY_HERE"
```

**NEVER commit this file to Git!** (It's already in `.gitignore`)

### Step 3: Restart Your Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

---

## 🧪 Test It

### Option 1: Visual Test Page

Visit: http://localhost:3000/test-ai

This page lets you test the OpenAI integration with a simple UI.

### Option 2: API Test (Command Line)

```powershell
# Test with PowerShell
$body = @{
    prompt = "write a haiku about ai"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/ai/test" -Method POST -Body $body -ContentType "application/json"
```

### Option 3: Browser Console

```javascript
fetch('/api/ai/test', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: 'write a haiku about ai' })
})
.then(r => r.json())
.then(d => console.log(d.output_text));
```

---

## 💻 Usage Examples

### 1. Generate Text (Like Your Python Example)

**Python equivalent:**
```python
response = client.responses.create(
  model="gpt-6-luna",
  input="write a haiku about ai",
  store=True,
)
print(response.output_text)
```

**TypeScript version:**
```typescript
import { generateText } from '@/lib/openai';

const result = await generateText('write a haiku about ai');
console.log(result);
```

### 2. Product Description Generator

```typescript
const description = await fetch('/api/ai/generate-description', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productName: 'Wireless Headphones',
    category: 'Electronics'
  })
});

const data = await description.json();
console.log(data.description);
```

### 3. AI Product Suggestions

```typescript
const suggestions = await fetch('/api/ai/suggestions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'gifts for mom',
    limit: 5
  })
});

const data = await suggestions.json();
console.log(data.suggestions);
```

### 4. Chat Assistant

```typescript
const chat = await fetch('/api/ai/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    message: 'I need a laptop for gaming',
    history: [] // Optional conversation history
  })
});

const data = await chat.json();
console.log(data.response);
```

---

## 🎨 Add AI Features to Your Pages

### Add Chat Widget to Any Page

```tsx
import { AIChat } from '@/components/ai/AIChat';

export default function MyPage() {
  return (
    <div>
      {/* Your page content */}
      <AIChat /> {/* Floating chat button */}
    </div>
  );
}
```

### Add AI Product Search

```tsx
import { AIProductSearch } from '@/components/ai/AIProductSearch';

export default function SearchPage() {
  return (
    <div>
      <h1>Find Products</h1>
      <AIProductSearch />
    </div>
  );
}
```

---

## 📊 API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/ai/test` | POST | General text generation (testing) |
| `/api/ai/chat` | POST | Customer service chatbot |
| `/api/ai/suggestions` | POST | Product search suggestions |
| `/api/ai/generate-description` | POST | Auto-generate product descriptions |

---

## 🔒 Security Notes

✅ **Good practices (already implemented):**
- API key stored in `.env` (server-side only)
- `.env` is in `.gitignore`
- All AI calls happen in API routes (backend)
- Never expose API key to frontend/browser

❌ **Never do this:**
```typescript
// ❌ NEVER put API key in frontend code
const apiKey = "sk-proj-..."; // NEVER!
```

---

## 💰 Cost Management

The `gpt-6-luna` model is cost-sensitive. Monitor usage at:
https://platform.openai.com/usage

To reduce costs:
- Use shorter prompts
- Cache common responses
- Add rate limiting to your API routes

---

## 🐛 Troubleshooting

### Error: "Missing OPENAI_API_KEY"
- Make sure `.env` file has `OPENAI_API_KEY="sk-proj-..."`
- Restart your dev server after changing `.env`

### Error: "Invalid API key"
- Your key may be revoked
- Generate a new key at https://platform.openai.com/api-keys

### Error: "Model not found: gpt-6-luna"
- Check if model name is correct in OpenAI docs
- Try `gpt-4o-mini` or `gpt-3.5-turbo` as alternatives

### TypeScript errors about `.responses.create()`
- Update `openai` package: `npm install openai@latest`
- The Responses API is newer, ensure you have a compatible version

---

## 📚 Resources

- [OpenAI Platform](https://platform.openai.com/)
- [OpenAI API Docs](https://platform.openai.com/docs/)
- [Responses API Guide](https://platform.openai.com/docs/api-reference/responses)

---

## 🚀 Next Steps

1. Test the integration at `/test-ai`
2. Add `<AIChat />` to your shop layout
3. Use AI product descriptions in admin panel
4. Build custom AI features for your store

**Need help?** Check the code in `lib/openai.ts` for all available functions.
