# Vercel Deployment Guide

## Setting Up Environment Variables on Vercel

The `.env.local` file is not deployed to Vercel. You need to configure environment variables in Vercel's dashboard.

## Step-by-Step Instructions

### 1. Go to Your Vercel Project

1. Log in to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your project (habbit-tracker)

### 2. Navigate to Settings

1. Click on your project
2. Go to **Settings** tab
3. Click on **Environment Variables** in the left sidebar

### 3. Add Environment Variables

Add the following environment variables:

#### Required Variables:

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Value: `https://ohigfvjexcxustminhhc.supabase.co`
   - Environment: Select all (Production, Preview, Development)

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oaWdmdmpleGN4dXN0bWluaGhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MTQwMzUsImV4cCI6MjA3ODA5MDAzNX0.VKEaQjdTvGa5zsKKG-vjeWMtUiWraSf6n-wtSETDFxk`
   - Environment: Select all (Production, Preview, Development)

#### Optional Variables:

3. **OPENAI_API_KEY** (if you want AI Tip feature)
   - Value: Your OpenAI API key (starts with `sk-`)
   - Environment: Select all (Production, Preview, Development)

### 4. Save and Redeploy

1. Click **Save** after adding each variable
2. Go to the **Deployments** tab
3. Click the **⋯** (three dots) menu on your latest deployment
4. Click **Redeploy**
5. Or push a new commit to trigger automatic redeployment

## Quick Add via Vercel CLI (Alternative)

If you have Vercel CLI installed:

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Add environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production
vercel env add OPENAI_API_KEY production  # Optional

# Redeploy
vercel --prod
```

## Verify Environment Variables

After redeploying, you can verify the environment variables are set:

1. Go to your deployment in Vercel
2. Check the build logs - they should not show environment variable errors
3. Visit your deployed app - it should work without the Supabase URL error

## Important Notes

### Environment Variable Prefixes

- Variables starting with `NEXT_PUBLIC_` are exposed to the browser
- Variables without `NEXT_PUBLIC_` are only available on the server
- Both `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_URL` are supported (but `NEXT_PUBLIC_` is recommended)

### Security

- ✅ Your Supabase anon key is safe to expose (it's designed for client-side use)
- ✅ The OpenAI API key is server-only (not prefixed with `NEXT_PUBLIC_`)
- ❌ Never commit `.env.local` files to git
- ✅ Vercel environment variables are encrypted at rest

### Troubleshooting

**Error: "Supabase URL is not set"**
- Make sure you added `NEXT_PUBLIC_SUPABASE_URL` in Vercel
- Make sure you selected all environments (Production, Preview, Development)
- Make sure you redeployed after adding the variables

**Error: "Supabase key is not set"**
- Make sure you added `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel
- Make sure you selected all environments
- Make sure you redeployed after adding the variables

**Changes not reflecting**
- Environment variables require a redeployment to take effect
- Push a new commit or manually redeploy from Vercel dashboard

## Testing

After setting up environment variables and redeploying:

1. Visit your deployed app URL
2. Try adding a habit - it should save to Supabase
3. Try the AI Tip button - it should work (if OPENAI_API_KEY is set)

## Additional Resources

- [Vercel Environment Variables Documentation](https://vercel.com/docs/concepts/projects/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)


