# Bloom PWA — Setup Guide

## What you need
- A free Supabase account (supabase.com)
- A free Vercel account (vercel.com)
- A GitHub account

## Step 1: Create your Supabase project
1. Go to supabase.com and sign up (free)
2. Click "New Project"
3. Name it whatever you want (e.g., "Bloom")
4. Pick a region close to you
5. Set a database password (save it somewhere)
6. Wait for it to finish creating (~2 minutes)

## Step 2: Set up the database
1. In your Supabase dashboard, click "SQL Editor" in the left sidebar
2. Click "New Query"
3. Open the file `supabase/migration.sql` from this project
4. Copy ALL of it and paste it into the SQL Editor
5. Click "Run" — you should see "Success"

## Step 3: Enable sign-ups
1. In the left sidebar, go to "Authentication"
2. Click "Providers" tab
3. Click "Email"
4. Make sure "Enable Email provider" is ON
5. Turn OFF "Confirm email" (so employees can sign up instantly)
6. Click "Save"

## Step 4: Get your API keys
1. Go to "Settings" (gear icon) > "API"
2. Copy the "Project URL" — looks like https://something.supabase.co
3. Copy the "anon public" key — a long string starting with "eyJ..."

## Step 5: Update the code
1. Open the file `.env` in the project root
2. Replace the values with YOUR keys:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
3. Save the file

## Step 6: Deploy to Vercel
1. Push this project to your own GitHub repo
2. Go to vercel.com and sign in with GitHub
3. Click "Add New Project"
4. Import your repo
5. Before deploying, click "Environment Variables" and add:
   - `VITE_SUPABASE_URL` = your project URL
   - `VITE_SUPABASE_ANON_KEY` = your anon key
6. Click "Deploy"
7. You'll get a live URL in about 60 seconds

## Step 7: Install on phones
1. Open the Vercel URL on your phone in Chrome (Android) or Safari (iOS)
2. Android: tap the "Add to Home Screen" banner
3. iOS: tap Share > "Add to Home Screen"
4. The app icon appears on your home screen like a regular app

## Adding employees
Each employee just goes to the URL and taps "Create Account" with their email and a password. Everyone shares the same data automatically.

## Ongoing
- Every time you push code to GitHub, Vercel auto-deploys
- Supabase dashboard lets you manage users and view data
- Both are free at this scale (7 users)
