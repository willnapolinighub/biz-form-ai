# GitHub Pages Deployment Guide

## Quick Setup

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under **Source**, select **GitHub Actions**
4. Click Save

### Step 2: Update Repository Name in Config

If your repository name is different from `bizform-ai`, update `basePath` in `frontend/next.config.js`:

```javascript
basePath: '/your-repo-name',
```

### Step 3: Set Repository Secrets (Optional)

For a demo, the app will work with placeholder values. Optionally, add these secrets in GitHub:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add these secrets:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
   - `N8N_WEBHOOK_URL` - Your N8N webhook URL

### Step 4: Push to GitHub

```bash
git add .
git commit -m "Add GitHub Pages deployment"
git push origin main
```

### Step 5: View Deployment

1. Go to your repository's **Actions** tab
2. Watch the workflow run
3. Once complete, visit `https://yourusername.github.io/bizform-ai/`

---

## Important Notes

### Demo Limitations

Since GitHub Pages only serves static files, these features won't work:

- **API Routes**: The N8N webhook calls will fail (no backend)
- **Dynamic Content**: Everything is pre-rendered at build time
- **Real Database**: Supabase connections won't work

### For a Working Demo

To demonstrate the frontend without a backend:

1. The landing page will display correctly
2. The formation wizard will show the UI
3. Form submissions will need to be mocked or will show errors
4. Consider creating a "demo mode" that shows mock data

### Alternative: Vercel (Recommended)

For a fully functional demo with backend support, deploy to **Vercel** instead:

```bash
cd frontend
npx vercel --prod
```

Vercel provides:
- Free tier for Next.js
- Serverless functions (API routes work!)
- Environment variable management
- Automatic HTTPS

---

## Troubleshooting

### 404 Errors on Assets

If CSS/JS files return 404, check:
- `basePath` matches your repository name
- `trailingSlash: true` is set

### White Screen of Death

Check browser console for JavaScript errors. May need to adjust the build configuration.

### Build Fails

Ensure Node.js version in workflow matches local version (use Node 20 in GitHub Actions).
