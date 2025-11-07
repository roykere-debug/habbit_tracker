# Quick Start Guide

## Your Supabase Project

Your Supabase URL: `https://ohigfvjexcxustminhhc.supabase.co`

## Step 1: Set Up Database Schema

1. Go to your Supabase project: https://app.supabase.com/project/_/sql
2. Open the SQL Editor
3. Copy and paste the entire contents of `lib/db/schema.sql`
4. Click "Run" to execute the SQL

This will create:
- `habits` table
- `habit_entries` table
- Indexes for performance
- Row Level Security (RLS) policies

## Step 2: Get Your Anon Key

1. Go to: https://app.supabase.com/project/_/settings/api
2. Find the **"anon/public"** key under "Project API keys"
3. Copy it (you'll need it for the next step)

## Step 3: Create Environment File

Create a `.env.local` file in the root directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ohigfvjexcxustminhhc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oaWdmdmpleGN4dXN0bWluaGhjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MTQwMzUsImV4cCI6MjA3ODA5MDAzNX0.VKEaQjdTvGa5zsKKG-vjeWMtUiWraSf6n-wtSETDFxk

# OpenAI Configuration (for AI Tip feature)
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here
```

**Note:** The AI Tip feature is optional. If you don't set `OPENAI_API_KEY`, the button will show an error message when clicked.

## Step 4: Install and Run

```bash
# Install dependencies (if not already done)
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Verification

Once running, you should be able to:
1. Add a new habit
2. Mark habits as complete
3. See your habit statistics
4. View your 7-day activity history
5. Get AI-powered habit tips (if OpenAI API key is configured)

If you see errors, check:
- ✅ Database schema has been run
- ✅ `.env.local` file exists with correct values
- ✅ Supabase project is active (not paused)

## Troubleshooting

**Error: "Supabase URL and key must be set"**
- Make sure `.env.local` exists in the root directory
- Verify the variable names match exactly (case-sensitive)
- Restart the dev server after creating/modifying `.env.local`

**Error: "Failed to load habits"**
- Check that the database schema has been run
- Verify your anon key is correct
- Check the browser console for detailed error messages

**Error: "OpenAI API key is not configured" (when clicking AI Tip)**
- Add `OPENAI_API_KEY` to your `.env.local` file
- Get your API key from: https://platform.openai.com/api-keys
- Restart the dev server after adding the key

