# 🚀 Vercel Deployment Guide

## ✅ Pre-Deployment Checklist

- [x] Code pushed to GitHub
- [x] Build passes locally
- [x] All environment variables documented
- [x] Security headers configured
- [x] Legal pages created

## 📋 Required Environment Variables for Vercel

Copy these to Vercel Dashboard → Your Project → Settings → Environment Variables

### Database
```
DATABASE_URL=your-production-postgresql-url
```

### NextAuth
```
NEXTAUTH_SECRET=your-strong-secret-min-32-chars
NEXTAUTH_URL=https://your-vercel-url.vercel.app
AUTH_TRUST_HOST=true
```

### Stripe (Start with TEST, switch to LIVE later)
```
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Redis (Upstash)
```
REDIS_URL=your-upstash-redis-url
```

### Algolia Search
```
ALGOLIA_APP_ID=your-app-id
ALGOLIA_ADMIN_API_KEY=your-admin-key
ALGOLIA_SEARCH_API_KEY=your-search-key
```

### Email (Resend)
```
RESEND_API_KEY=re_...
```

### AI (Hugging Face)
```
HUGGINGFACE_API_KEY=hf_...
```

---

## 🎯 Deployment Steps

### 1. Create Vercel Project

1. Go to https://vercel.com/new
2. Click "Import Project"
3. Select your GitHub repository: `kalua101/e-commerce`
4. Click "Import"

### 2. Configure Project Settings

**Framework Preset:** Next.js (auto-detected)  
**Root Directory:** `./` (leave default)  
**Build Command:** `npm run build` (default)  
**Output Directory:** `.next` (default)  
**Install Command:** `npm install` (default)

### 3. Add Environment Variables

1. Click "Environment Variables" section
2. Copy all variables from your `.env` file
3. Set them for **Production**, **Preview**, and **Development**

**IMPORTANT:** Update `NEXTAUTH_URL` after first deployment!

### 4. Deploy

1. Click "Deploy"
2. Wait 2-3 minutes for build
3. Get your deployment URL (e.g., `your-app.vercel.app`)

### 5. Update NEXTAUTH_URL

1. Go to Settings → Environment Variables
2. Edit `NEXTAUTH_URL`
3. Change to your actual Vercel URL
4. Redeploy (Deployments → Redeploy)

### 6. Configure Stripe Webhook

1. Go to https://dashboard.stripe.com/webhooks
2. Add endpoint: `https://your-vercel-url.vercel.app/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
4. Copy webhook secret
5. Add to Vercel as `STRIPE_WEBHOOK_SECRET`
6. Redeploy

---

## ✅ Post-Deployment Verification

### Test These URLs:

```bash
# Homepage
https://your-vercel-url.vercel.app

# Health check
https://your-vercel-url.vercel.app/api/health

# Products API
https://your-vercel-url.vercel.app/api/products

# Legal pages
https://your-vercel-url.vercel.app/privacy
https://your-vercel-url.vercel.app/terms
https://your-vercel-url.vercel.app/refund

# Sitemap
https://your-vercel-url.vercel.app/sitemap.xml

# Robots
https://your-vercel-url.vercel.app/robots.txt
```

### Manual Tests:

- [ ] Browse products
- [ ] Search functionality
- [ ] Add to cart
- [ ] Checkout flow (test mode)
- [ ] Login/Register
- [ ] Admin dashboard (if admin user)

---

## 🔄 Going Live Checklist

When ready for production:

### 1. Switch Stripe to Live Mode

1. Get live keys from Stripe
2. Update environment variables:
   - `STRIPE_SECRET_KEY=sk_live_...`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...`
3. Create live webhook endpoint
4. Update `STRIPE_WEBHOOK_SECRET`
5. Redeploy

### 2. Configure Custom Domain (Optional)

1. Go to Settings → Domains
2. Add your domain
3. Configure DNS records
4. Update `NEXTAUTH_URL` to your domain
5. Update Stripe webhook URL

### 3. Run Database Migrations

```bash
npx prisma migrate deploy
npm run seed
```

### 4. Sync Search Index

```bash
npx tsx sync-algolia.ts
```

---

## 🐛 Troubleshooting

### Build Fails

- Check environment variables are set
- Verify DATABASE_URL is correct
- Check build logs for specific errors

### Auth Not Working

- Verify `NEXTAUTH_URL` matches deployment URL
- Check `NEXTAUTH_SECRET` is set
- Ensure `AUTH_TRUST_HOST=true`

### Payments Failing

- Verify Stripe keys are correct
- Check webhook is configured
- Test with Stripe test cards

### Database Connection Issues

- Verify DATABASE_URL is correct
- Check database allows Vercel IP ranges
- Ensure SSL is enabled

---

## 📊 Monitoring

### Vercel Dashboard

- Monitor build logs
- Check function logs
- Review analytics

### Health Check

Visit `/api/health` to check:
- Database connection
- Redis status
- Overall system health

---

## 🔐 Security Notes

- Never commit `.env` to Git
- Use strong `NEXTAUTH_SECRET` (32+ chars)
- Keep Stripe keys secure
- Enable 2FA on all services
- Regularly update dependencies

---

## 📚 Additional Resources

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Stripe Integration](https://stripe.com/docs)
- [Prisma on Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)

---

**Your e-commerce platform is ready for Vercel! 🎉**
