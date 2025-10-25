# Vercel Deployment Setup

## Environment Variables for Vercel

To complete the deployment, you need to add the environment variables to Vercel:

1. **Go to your Vercel Dashboard**: https://vercel.com/cradnan-bots-projects/memory-weaver

2. **Navigate to Settings**:
   - Click on your `memory-weaver` project
   - Go to "Settings" tab
   - Click "Environment Variables" in the left sidebar

3. **Add Environment Variables**:
   
   **Variable 1:**
   - Name: `VITE_SUPABASE_URL`
   - Value: `https://lpqvnthejbrmwqyjiskn.supabase.co`
   - Environment: Production ✅

   **Variable 2:**
   - Name: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwcXZ2bmhlamJybnd3eWppc2tuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MTAyMjQsImV4cCI6MjA3NjQ4NjIyNH0.v7p3XPLhFQbnz9Tq3hU74wChuZ8THYxjfJTBoPJw9ns`
   - Environment: Production ✅

4. **Redeploy**:
   - Go to "Deployments" tab
   - Click "Redeploy" on the latest deployment
   - Or trigger a new deployment by pushing code changes

## Expected Result

After adding environment variables and redeploying:
- ✅ Build should succeed
- ✅ App should load with authentication
- ✅ Users can sign up/sign in
- ✅ Photo upload will work (once Supabase storage is configured)

## Your App URLs

- **Production**: https://memory-weaver-git-main-cradnan-bots-projects.vercel.app
- **Local Dev**: http://localhost:5174/