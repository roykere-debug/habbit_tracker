# Habit Tracker - Setup Guide

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)

## Database Setup

### 1. Create a Supabase Project

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details and wait for it to be created

### 2. Run the Database Schema

1. In your Supabase project, go to the SQL Editor
2. Copy the contents of `lib/db/schema.sql`
3. Paste and run it in the SQL Editor
4. This will create the `habits` and `habit_entries` tables with proper indexes and RLS policies

### 3. Get Your Supabase Credentials

1. In your Supabase project, go to Settings > API
2. Copy the following:
   - **Project URL** (under "Project URL")
   - **anon/public key** (under "Project API keys")

### 4. Configure Environment Variables

1. Create a `.env.local` file in the root of your project:

```bash
# Option 1: Using NEXT_PUBLIC_ prefix (recommended)
NEXT_PUBLIC_SUPABASE_URL=https://ohigfvjexcxustminhhc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here

# Option 2: Using shorter names (also supported)
# SUPABASE_URL=https://ohigfvjexcxustminhhc.supabase.co
# SUPABASE_KEY=your_supabase_anon_key_here
```

2. **Get your Supabase anon key:**
   - Go to your Supabase project: https://app.supabase.com
   - Navigate to **Settings > API**
   - Copy the **"anon/public"** key under "Project API keys"
   - Paste it as the value for `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `SUPABASE_KEY`

**Note:** The code supports multiple environment variable naming conventions:
- `NEXT_PUBLIC_SUPABASE_URL` or `SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` or `SUPABASE_KEY` or `SUPABASE_ANON_KEY`

### 5. Install Dependencies

```bash
npm install
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## API Endpoints

The backend provides both Server Actions and REST API endpoints:

### Server Actions (Recommended)

Located in `app/actions/`:
- `createHabit(data)` - Create a new habit
- `getHabits()` - Get all habits with entries
- `updateHabit(id, data)` - Update a habit
- `deleteHabit(id)` - Delete a habit
- `toggleHabitEntry(data)` - Toggle a habit entry for a date
- `getHabitEntries(habitId)` - Get all entries for a habit

### REST API Endpoints

- `GET /api/habits` - Get all habits
- `POST /api/habits` - Create a new habit
- `PUT /api/habits` - Update a habit (requires `id` in body)
- `DELETE /api/habits?id=habit_id` - Delete a habit
- `GET /api/entries?habitId=habit_id` - Get entries for a habit
- `POST /api/entries` - Toggle/create a habit entry

## Validation

All inputs are validated using Zod schemas in `lib/validations.ts`:
- Habit name: 1-100 characters
- Color: Valid hex color format (#RRGGBB)
- Icon: 1-10 characters
- Date: YYYY-MM-DD format

## Error Handling

The application includes comprehensive error handling:
- Server actions return `{ success: boolean, data?: T, error?: string }`
- API routes return appropriate HTTP status codes
- Frontend displays user-friendly error messages

## Security

- Row Level Security (RLS) is enabled on all tables
- Currently set to allow all operations (update policies for production)
- Input validation on all endpoints
- Server-side rendering for sensitive operations

## Production Considerations

1. **Authentication**: Add user authentication and update RLS policies to restrict access
2. **Rate Limiting**: Add rate limiting to API endpoints
3. **Caching**: Implement caching for frequently accessed data
4. **Monitoring**: Set up error tracking and monitoring
5. **Backup**: Configure database backups in Supabase

## Troubleshooting

### "Failed to load habits" error

- Check that your `.env.local` file exists and has correct values
- Verify your Supabase project is active
- Check that the database schema has been run
- Check browser console and server logs for detailed errors

### Database connection issues

- Verify your Supabase project URL and anon key
- Check your internet connection
- Ensure Supabase project hasn't been paused (free tier pauses after inactivity)

