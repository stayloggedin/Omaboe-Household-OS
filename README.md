# 🏠 Household OS

A live, shareable household management dashboard. Monitor utilities, vehicles, finances, maintenance, and home health — all synced in real time across your household.

**Stack:** Next.js 14 · TypeScript · Tailwind CSS · Supabase (database + realtime)  
**Deploy:** Vercel (free tier) — live in under 10 minutes

---

## 🚀 Deploy in 10 minutes

### Step 1 — Create your Supabase project (3 min)

1. Go to **[supabase.com](https://supabase.com)** → Sign up (free)
2. Click **New project** → give it a name (e.g. `household-os`) → pick a region closest to Ghana (choose `eu-west-2` London or similar)
3. Wait ~2 minutes for the project to spin up
4. Go to **SQL Editor** (left sidebar) → paste the entire contents of `supabase-schema.sql` → click **Run**
5. Go to **Settings → API** → copy:
   - **Project URL** (looks like `https://abcxyz.supabase.co`)
   - **anon / public key** (long string starting with `eyJ...`)

### Step 2 — Deploy to Vercel (4 min)

**Option A: GitHub (recommended)**
1. Push this folder to a GitHub repo (public or private)
2. Go to **[vercel.com](https://vercel.com)** → New Project → Import from GitHub
3. Select your repo → click **Deploy**
4. Before final deploy, click **Environment Variables** and add:
   ```
   NEXT_PUBLIC_SUPABASE_URL     = https://YOUR_PROJECT_ID.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY = YOUR_ANON_KEY
   NEXT_PUBLIC_HOUSEHOLD_NAME   = Adepa Family Home
   ```
5. Click **Deploy** → done!

**Option B: Vercel CLI**
```bash
npm i -g vercel
cp .env.local.example .env.local
# Edit .env.local with your Supabase keys
vercel --prod
# Follow prompts, add env vars when asked
```

### Step 3 — Share with your household (1 min)

1. Copy your Vercel URL (e.g. `https://household-os-xyz.vercel.app`)
2. Share with all household members — they can open it on any device
3. Everyone sees the same data, updated live

### Optional — Auto-deploy with GitHub Actions

If you want every push to `main` to deploy automatically, this repo includes:

- `.github/workflows/vercel-deploy.yml`
- `.github/workflows/pr-build.yml` (runs lint, typecheck, and build checks on PRs)

Add these GitHub repository secrets in **Settings → Secrets and variables → Actions**:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

How to get them:

1. `VERCEL_TOKEN`: Vercel dashboard → **Settings → Tokens** → create token.
2. `VERCEL_ORG_ID` and `VERCEL_PROJECT_ID`:
   - Run `vercel link` once locally in this project.
   - Open `.vercel/project.json` and copy the two values.

Once secrets are set, push to `main` (or run the workflow manually from the Actions tab) and Vercel deployment will run automatically.

PRs to `main` also run `npm ci`, `npm run lint`, `npm run typecheck`, and `npm run build` automatically, so issues are caught before merge.

### Railway

Deploy uses a **Dockerfile** at the repo root (single-stage `npm run build` + `next start`). Railway auto-detects it. The Dockerfile forces **`NODE_ENV=development`** during install/build so **devDependencies** (TypeScript, Tailwind, etc.) are not skipped — Railway often sets `NODE_ENV=production` during image build, which breaks `next build` if you do not override it.

1. In [Railway](https://railway.app), **New Project** → deploy from GitHub. **Root Directory** must be empty (or `.`) so `Dockerfile` and `package.json` are found.
2. **Variables** → add:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_HOUSEHOLD_NAME` (optional)
3. Redeploy. The start command uses Railway’s **`PORT`**.

If a build still fails, open the deployment → **Build** → **View logs** and copy the **first error** (not the summary card). The card only says “Failed to build an image”.

---

## 🗂 Project structure

```
household-os/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Main dashboard (realtime logic)
│   │   └── globals.css      # Design system CSS
│   ├── components/
│   │   ├── Sidebar.tsx      # Navigation + member presence
│   │   ├── Pages.tsx        # All 7 page components
│   │   ├── AddEntryModal.tsx # Add entry form
│   │   ├── ShareModal.tsx   # Share link modal
│   │   └── ui.tsx           # Reusable UI primitives
│   └── lib/
│       └── supabase.ts      # Supabase client + types
├── supabase-schema.sql      # ← Run this in Supabase SQL editor
├── .env.local.example       # ← Copy to .env.local, fill in keys
├── Dockerfile               # Railway / Docker production image
├── railway.toml             # Railway: use Dockerfile + healthcheck
├── public/                  # Static assets (may be empty)
└── vercel.json              # Vercel config
```

---

## ✨ Features

| Feature | Description |
|---|---|
| **5 modules** | Utilities, Vehicles, Finances, Maintenance, Home health |
| **Realtime sync** | Supabase realtime — changes appear instantly for all members |
| **Live activity log** | Every entry tracked with who added it and when |
| **Member presence** | Shows who's online in the sidebar |
| **Alert system** | Overdue and due-soon items flagged with priority |
| **Add entries** | Any member can log bills, services, tasks, notes |
| **Share link** | One URL — open on phone, tablet, or desktop |
| **Fully responsive** | Works on mobile browsers |

---

## 🔧 Customise

**Change household name:**  
Set `NEXT_PUBLIC_HOUSEHOLD_NAME` in your Vercel env vars.

**Change member names/colors:**  
Edit the seed data in `supabase-schema.sql` before running, or update directly in Supabase Table Editor → `members` table.

**Add a password / access control:**  
Add Supabase Auth or use Vercel's [Password Protection](https://vercel.com/docs/security/deployment-protection) (Pro plan) for a quick password gate.

**Add more modules:**  
1. Add the new module name to the `check` constraint in `supabase-schema.sql`
2. Add it to the `Module` type in `src/lib/supabase.ts`
3. Create a new page component in `Pages.tsx`
4. Add it to the nav in `Sidebar.tsx`

---

## 📱 Mobile use

The app is accessible on mobile browsers. For the best experience, household members can **Add to Home Screen** (iOS Safari / Android Chrome) for an app-like shortcut.

---

## 💰 Cost

| Service | Free tier |
|---|---|
| Supabase | 500 MB database, 50,000 monthly active users |
| Vercel | Unlimited deployments, custom domain |

**Total cost: $0/month** for a household.

---

Built with ❤️ — ready to own your home.
