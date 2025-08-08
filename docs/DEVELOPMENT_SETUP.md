# Development Setup for Contributors

This guide will help you set up your local development environment with your own GitHub OAuth app and Supabase project.

## Why Separate Development Setup?

For security and isolation, contributors should use their own:
- GitHub OAuth App (for authentication)
- Supabase project (for database and auth)

This prevents interference with production systems and gives you full control over your development environment.

## Prerequisites

- Node.js 18+ installed
- GitHub account
- Supabase account (free tier is sufficient)

## Step 1: Create Your GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in the details:
   - **Application name**: `func-Kode Local Dev` (or any name you prefer)
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/auth/callback`
4. Click **"Register application"**
5. Note down your **Client ID** and **Client Secret**

## Step 2: Create Your Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Click **"New Project"**
3. Choose your organization and fill in:
   - **Name**: `func-kode-dev` (or any name you prefer)
   - **Database Password**: Choose a secure password
   - **Region**: Choose closest to your location
4. Wait for the project to be created (takes ~2 minutes)

## Step 3: Configure Supabase Authentication

1. In your Supabase dashboard, go to **Authentication** → **Providers**
2. Click on **GitHub** provider
3. Enable GitHub and fill in:
   - **Client ID**: Your GitHub OAuth App Client ID
   - **Client Secret**: Your GitHub OAuth App Client Secret
4. Click **"Save"**

### Set URL Configuration

1. Go to **Authentication** → **URL Configuration**
2. Set **Site URL** to: `http://localhost:3000`
3. Add to **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `http://localhost:3000/dashboard`
4. Click **"Save"**

## Step 4: Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Copy the contents from `/database/schema.sql` in this repository
3. Paste and run the SQL to create all necessary tables

## Step 5: Configure Environment Variables

1. In your local project root, create a `.env.local` file:

\`\`\`bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: Override site URL for development
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

### Finding Your Supabase Credentials

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API keys** → **anon/public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 6: Install and Run

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

## Step 7: Test Authentication

1. Open `http://localhost:3000`
2. Navigate to the login page
3. Click "Sign in with GitHub"
4. You should be redirected to your GitHub OAuth app for authorization
5. After authorization, you'll be redirected back to your local dashboard

## Environment File Example

Your `.env.local` should look like this:

\`\`\`bash
# Example - Replace with your actual values
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.example...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
\`\`\`

## Troubleshooting

### OAuth Redirect Issues
- Ensure your GitHub OAuth app callback URL is exactly `http://localhost:3000/auth/callback`
- Check that Supabase Site URL is set to `http://localhost:3000`
- Verify redirect URLs in Supabase include the callback URL

### Database Issues
- Make sure you've run the schema.sql in your Supabase SQL editor
- Check that Row Level Security (RLS) policies are properly set up

### Environment Variables
- Restart your dev server after changing `.env.local`
- Ensure no trailing spaces in environment variable values
- Double-check your Supabase project URL and keys

## Need Help?

1. Check the [main README.md](../README.md) for general project information
2. Open an issue on GitHub if you encounter problems
3. Join our community discussions

## Production vs Development

- **Production**: Uses the main project's Supabase and GitHub OAuth
- **Development**: Uses your personal Supabase project and GitHub OAuth app
- This isolation ensures contributors can't accidentally affect production data or authentication

---

Happy coding! 🚀
