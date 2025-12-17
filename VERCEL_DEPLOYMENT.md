# Vercel Deployment Guide for Deskriptr

This guide will walk you through deploying your Next.js application to Vercel.

## Prerequisites

Before deploying, make sure you have:

1. ✅ A [Vercel account](https://vercel.com/signup) (free tier works)
2. ✅ A [GitHub](https://github.com), [GitLab](https://gitlab.com), or [Bitbucket](https://bitbucket.org) account
3. ✅ Your code pushed to a Git repository
4. ✅ A PostgreSQL database (Vercel Postgres, Supabase, Neon, or any PostgreSQL provider)
5. ✅ API keys ready:
   - Clerk authentication keys
   - Hugging Face API key
   - (Optional) OpenAI API key
   - (Optional) Stripe keys if using payments

---

## Step 1: Prepare Your Repository

1. **Commit all your changes:**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   ```

2. **Push to your Git provider:**
   ```bash
   git push origin main
   ```
   (Replace `main` with your branch name if different)

---

## Step 2: Set Up PostgreSQL Database

You have several options for PostgreSQL:

### Option A: Vercel Postgres (Recommended - Easiest)

1. Go to your Vercel dashboard
2. Navigate to **Storage** → **Create Database** → **Postgres**
3. Choose a name and region
4. Click **Create**
5. Copy the connection string (you'll use this in Step 3)

### Option B: Supabase (Free Tier Available)

1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Go to **Settings** → **Database**
4. Copy the connection string (use the URI format)

### Option C: Neon (Free Tier Available)

1. Go to [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string from the dashboard

### Option D: Any PostgreSQL Provider

Use any PostgreSQL database provider and get your connection string in the format:
```
postgresql://username:password@host:port/database?sslmode=require
```

---

## Step 3: Run Database Migrations

Before deploying, set up your database schema:

1. **Set your DATABASE_URL temporarily:**
   ```bash
   export DATABASE_URL="your_postgres_connection_string"
   ```

2. **Run Prisma migrations:**
   ```bash
   npx prisma migrate deploy
   ```
   
   Or if you haven't created migrations yet:
   ```bash
   npx prisma db push
   ```

---

## Step 4: Deploy to Vercel

### Method 1: Deploy via Vercel Dashboard (Recommended)

1. **Go to [Vercel Dashboard](https://vercel.com/dashboard)**

2. **Click "Add New..." → "Project"**

3. **Import your Git repository:**
   - Connect your Git provider (GitHub/GitLab/Bitbucket) if not already connected
   - Select your repository
   - Click **Import**

4. **Configure your project:**
   - **Framework Preset:** Next.js (should auto-detect)
   - **Root Directory:** `./` (leave as default)
   - **Build Command:** `npm run build` (should auto-detect)
   - **Output Directory:** `.next` (should auto-detect)
   - **Install Command:** `npm install` (should auto-detect)

5. **Add Environment Variables:**
   Click **Environment Variables** and add the following:

   ```
   DATABASE_URL=your_postgres_connection_string
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   HUGGINGFACE_API_KEY=your_huggingface_api_key
   ```

   Optional (if using):
   ```
   OPENAI_API_KEY=your_openai_api_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   ```

   ⚠️ **Important:** Make sure to add these for all environments (Production, Preview, Development)

6. **Deploy:**
   - Click **Deploy**
   - Wait for the build to complete (usually 2-3 minutes)

### Method 2: Deploy via Vercel CLI

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   vercel
   ```
   
   Follow the prompts:
   - Link to existing project or create new
   - Set up environment variables when prompted

4. **For production deployment:**
   ```bash
   vercel --prod
   ```

---

## Step 5: Configure Environment Variables in Vercel

After initial deployment, you can manage environment variables:

1. Go to your project in Vercel dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add/update variables as needed
4. Redeploy after adding new variables

---

## Step 6: Set Up Clerk for Production

1. **Go to [Clerk Dashboard](https://dashboard.clerk.com)**

2. **Configure your application:**
   - Go to **API Keys**
   - Copy your **Publishable Key** and **Secret Key**
   - Add them to Vercel environment variables

3. **Add Vercel URLs to Clerk:**
   - Go to **Domains** in Clerk dashboard
   - Add your Vercel domain (e.g., `your-app.vercel.app`)
   - Add your custom domain if you have one

---

## Step 7: Run Database Migrations on Production

After deployment, run migrations on your production database:

1. **Using Vercel CLI:**
   ```bash
   vercel env pull .env.production
   npx prisma migrate deploy
   ```

2. **Or manually:**
   - Get your production DATABASE_URL from Vercel dashboard
   - Set it locally: `export DATABASE_URL="your_production_db_url"`
   - Run: `npx prisma migrate deploy`

---

## Step 8: Configure Custom Domain (Optional)

1. Go to your project in Vercel dashboard
2. Navigate to **Settings** → **Domains**
3. Add your custom domain
4. Follow DNS configuration instructions
5. Update Clerk with your custom domain

---

## Step 9: Set Up Stripe Webhook (If Using Payments)

1. **Go to [Stripe Dashboard](https://dashboard.stripe.com)**

2. **Create a webhook endpoint:**
   - Go to **Developers** → **Webhooks**
   - Click **Add endpoint**
   - URL: `https://your-domain.vercel.app/api/stripe-webhook`
   - Select events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
   - Copy the **Signing secret**

3. **Add to Vercel environment variables:**
   ```
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

---

## Troubleshooting

### Build Fails with Prisma Errors

**Problem:** `Cannot find module '../app/generated/prisma'`

**Solution:** The `postinstall` script in `package.json` should handle this. Make sure:
- `prisma` is in `dependencies` (not `devDependencies`)
- The build command includes `prisma generate`

### Database Connection Errors

**Problem:** `Can't reach database server`

**Solutions:**
- Check your `DATABASE_URL` is correct
- Ensure your database allows connections from Vercel's IPs
- For Vercel Postgres, this is automatic
- For other providers, you may need to whitelist Vercel IPs or use SSL

### Environment Variables Not Working

**Problem:** Variables not accessible in production

**Solutions:**
- Make sure variables are added for **Production** environment
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)
- For `NEXT_PUBLIC_*` variables, they're exposed to the browser

### Clerk Authentication Not Working

**Problem:** Sign-in redirects fail

**Solutions:**
- Add your Vercel domain to Clerk dashboard
- Check `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set correctly
- Verify `CLERK_SECRET_KEY` matches your Clerk app

### API Routes Return 500 Errors

**Problem:** Serverless functions failing

**Solutions:**
- Check Vercel function logs in dashboard
- Ensure all environment variables are set
- Check database connection
- Verify API keys are valid

---

## Post-Deployment Checklist

- [ ] Database migrations run successfully
- [ ] Environment variables configured
- [ ] Clerk domain configured
- [ ] Test user authentication
- [ ] Test description generation
- [ ] Check Vercel function logs for errors
- [ ] Set up monitoring/alerts (optional)
- [ ] Configure custom domain (optional)
- [ ] Set up Stripe webhook (if using payments)

---

## Useful Vercel Features

### Preview Deployments
Every pull request automatically gets a preview deployment URL. Perfect for testing!

### Analytics
Enable Vercel Analytics in your project settings to track performance.

### Edge Functions
Consider using Edge Functions for better performance in specific regions.

### Environment Variables by Branch
You can set different environment variables for different branches (e.g., staging vs production).

---

## Monitoring Your Deployment

1. **View Logs:**
   - Go to your project → **Deployments** → Click on a deployment → **Functions** tab

2. **Check Build Logs:**
   - Click on a deployment → View build logs

3. **Monitor Performance:**
   - Use Vercel Analytics (enable in project settings)

---

## Need Help?

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [Prisma Deployment Guide](https://www.prisma.io/docs/guides/deployment)
- [Clerk Deployment Guide](https://clerk.com/docs/deployments/overview)

---

## Quick Reference: Environment Variables

```bash
# Required
DATABASE_URL=postgresql://...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
HUGGINGFACE_API_KEY=hf_...

# Optional
OPENAI_API_KEY=sk-...
STRIPE_SECRET_KEY=sk_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

**Happy Deploying! 🚀**

