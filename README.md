# Habit Tracker

A modern Next.js 14 application for tracking your daily habits with a clean, intuitive interface.

## Tech Stack

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **Supabase** - Backend database and API
- **Zod** - Schema validation
- **Server Actions** - Server-side data mutations
- **ESLint** - Code linting

## Features

- ✅ Create, update, and delete habits
- ✅ Track daily habit completion
- ✅ Visual 7-day activity tracker
- ✅ Streak tracking
- ✅ Statistics dashboard
- ✅ AI-powered habit tips (OpenAI integration)
- ✅ Dark mode support
- ✅ Responsive design
- ✅ Server-side data persistence
- ✅ Input validation
- ✅ Error handling

## Getting Started

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd habbit-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a Supabase project at [https://app.supabase.com](https://app.supabase.com)
   - Run the SQL schema from `lib/db/schema.sql` in the Supabase SQL Editor
   - Get your project URL and anon key from Settings > API

4. **Configure environment variables**
   Create a `.env.local` file:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

For detailed setup instructions, see [SETUP.md](./SETUP.md).

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the production application
- `npm start` - Start the production server
- `npm run lint` - Run ESLint to check for code issues

## Project Structure

```
.
├── app/                    # App Router directory
│   ├── actions/           # Server actions
│   │   ├── habits.ts     # Habit CRUD operations
│   │   └── entries.ts    # Habit entry operations
│   ├── api/              # REST API routes
│   │   ├── habits/       # Habit API endpoints
│   │   └── entries/      # Entry API endpoints
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Home page
│   └── globals.css       # Global styles
├── components/           # React components
│   ├── HabitCard.tsx    # Individual habit card
│   └── HabitForm.tsx    # Add habit form
├── lib/                  # Utility functions
│   ├── supabase/        # Supabase client setup
│   ├── db/              # Database schema and types
│   └── validations.ts   # Zod validation schemas
├── types/               # TypeScript types
│   └── habit.ts        # Habit-related types
└── public/             # Static assets
```

## Backend Architecture

### Server Actions (Recommended)

Server Actions are used for all data mutations. They provide:
- Type-safe server-side operations
- Automatic revalidation
- Optimistic updates support
- Built-in error handling

### REST API (Alternative)

REST API endpoints are also available for external integrations or if you prefer a traditional API approach.

### Database Schema

- **habits**: Stores habit definitions (id, name, color, icon, timestamps)
- **habit_entries**: Stores daily completion records (id, habit_id, date, completed, timestamps)

Both tables have Row Level Security (RLS) enabled for data protection.

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Zod Documentation](https://zod.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

MIT
