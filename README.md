# ATPL Workflow Dashboard

A full-stack practice management system for CA firms — built with Next.js 14, Supabase (PostgreSQL), and deployed on Vercel.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Project Structure](#2-project-structure)
3. [Supabase Setup](#3-supabase-setup)
4. [Environment Variables](#4-environment-variables)
5. [Install & Run Locally](#5-install--run-locally)
6. [Seed the Database](#6-seed-the-database)
7. [Deploy to Vercel](#7-deploy-to-vercel)
8. [Connect a Custom Domain (Hostinger)](#8-connect-a-custom-domain-hostinger)
9. [Default Login Credentials](#9-default-login-credentials)
10. [Role Permissions Overview](#10-role-permissions-overview)

---

## 1. Prerequisites

### Install Node.js

You need **Node.js v18 or later**.

**Windows:**
1. Go to https://nodejs.org
2. Download the **LTS** installer (`.msi`)
3. Run the installer — keep all defaults, make sure "Add to PATH" is checked
4. Open a new Command Prompt and verify:
   ```
   node -v
   npm -v
   ```
   Both should print version numbers (e.g. `v20.11.0` and `10.x.x`).

**Mac:**
```bash
# Using Homebrew (recommended)
brew install node

# Or download the .pkg from https://nodejs.org
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Install Git (optional but recommended)
Download from https://git-scm.com — needed to push code to GitHub for Vercel deployment.

---

## 2. Project Structure

```
Dashboard/
├── app/
│   ├── (dashboard)/          # All protected pages (layout with sidebar)
│   │   ├── layout.tsx        # Auth guard + sidebar/topbar shell
│   │   ├── page.tsx          # Dashboard KPIs
│   │   ├── tasks/page.tsx    # Task Manager
│   │   ├── clients/page.tsx  # Client Master
│   │   ├── calendar/page.tsx # Compliance Calendar
│   │   ├── team/page.tsx     # Team Management
│   │   ├── audit/page.tsx    # Audit Trail
│   │   └── settings/page.tsx # Settings & Admin
│   ├── login/page.tsx        # Login screen
│   └── api/                  # Backend API routes
├── components/               # React UI components
├── lib/                      # Auth, utils, audit helpers
├── scripts/seed.ts           # Database seed script
├── supabase/schema.sql       # Full database schema
├── types/index.ts            # TypeScript interfaces
├── middleware.ts             # Route protection + RBAC
└── .env.local.example        # Environment variable template
```

---

## 3. Supabase Setup

### Step 1 — Create a Supabase Account

1. Go to https://supabase.com
2. Click **Start your project** → sign up with GitHub or email
3. Confirm your email if prompted

### Step 2 — Create a New Project

1. Click **New Project**
2. Fill in:
   - **Name:** `atpl-dashboard` (or any name you like)
   - **Database Password:** Choose a strong password — **save this somewhere safe**
   - **Region:** Choose the closest to your users (e.g. `South Asia (Mumbai)` for India)
3. Click **Create new project**
4. Wait ~2 minutes for the project to provision

### Step 3 — Run the Database Schema

1. In your Supabase project, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Open the file `supabase/schema.sql` from this project in any text editor
4. Copy the **entire contents** and paste into the SQL Editor
5. Click **Run** (or press `Ctrl+Enter`)
6. You should see "Success. No rows returned" — this means all tables were created

### Step 4 — Get Your API Keys

1. In your Supabase project, click **Project Settings** (gear icon) → **API**
2. You need two values:
   - **Project URL** — looks like `https://abcdefghijkl.supabase.co`
   - **anon public** key — a long JWT string under "Project API keys"
   - **service_role** key — another long JWT string (click the eye icon to reveal)

> ⚠️ **Keep the service_role key secret** — it bypasses Row Level Security. Never expose it in frontend code or commit it to a public repo.

---

## 4. Environment Variables

### Step 1 — Create your `.env.local` file

In the project root folder, create a file named **`.env.local`** (copy from `.env.local.example`):

**Windows (Command Prompt):**
```
copy .env.local.example .env.local
```

**Mac/Linux:**
```bash
cp .env.local.example .env.local
```

### Step 2 — Fill in the values

Open `.env.local` in any text editor (Notepad, VS Code, etc.) and fill in:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# JWT Secret — generate a random 32+ character string
# You can use: https://generate-secret.vercel.app/32
JWT_SECRET=your_random_32_character_secret_here
```

**How to generate a JWT secret:**
- Visit https://generate-secret.vercel.app/32
- Copy the generated string and paste it as your `JWT_SECRET`
- Or in a terminal: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

> Note: `NEXT_PUBLIC_` prefixed variables are safe for browser use. The others are server-only.

---

## 5. Install & Run Locally

### Step 1 — Install dependencies

Open a terminal in the project folder:

```bash
npm install
```

This installs all packages listed in `package.json`. It may take 1–2 minutes.

### Step 2 — Start the development server

```bash
npm run dev
```

Open your browser and go to: **http://localhost:3000**

You should see the login page. (You'll need to seed the database first — see Section 6.)

---

## 6. Seed the Database

The seed script populates the database with sample employees, clients, tasks, and audit logs so you can explore all features immediately.

### Run the seed script

```bash
npm run seed
```

You should see output like:
```
🌱 Seeding database...
✓ Cleared existing data
✓ Inserted 13 employees
✓ Inserted 13 login records
✓ Inserted 10 clients
✓ Inserted 17 compliance types
✓ Inserted 15 tasks
✓ Inserted 12 audit log entries
✅ Database seeded successfully!
```

> ⚠️ **Warning:** Running the seed script clears all existing data first. Only run it on a fresh database or when you want to reset to sample data.

---

## 7. Deploy to Vercel

### Step 1 — Push your code to GitHub

1. Create a free account at https://github.com if you don't have one
2. Create a **new repository** (click the `+` button → New repository)
   - Name it `atpl-dashboard`
   - Set it to **Private**
   - Don't initialize with README (your project already has one)
3. In your project folder, run:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/atpl-dashboard.git
git push -u origin main
```

### Step 2 — Connect to Vercel

1. Go to https://vercel.com and sign up / log in with your GitHub account
2. Click **Add New Project**
3. Click **Import** next to your `atpl-dashboard` repository
4. Vercel will auto-detect it as a Next.js project — keep all default settings
5. **Before clicking Deploy**, expand **Environment Variables** and add all four variables from your `.env.local`:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `JWT_SECRET` | Your random secret string |

6. Click **Deploy**
7. Wait ~2 minutes — Vercel will build and deploy your app
8. You'll get a live URL like: `https://atpl-dashboard-xyz.vercel.app`

### Step 3 — Seed the production database

Your Vercel deployment uses the same Supabase database, so you only need to seed once. If you already ran `npm run seed` locally (Step 6), the data is already in Supabase and your Vercel deployment will work immediately.

If you skipped local seeding, run it now from your local machine with the same `.env.local` values pointing to your production Supabase project.

### Step 4 — Future deployments

Every time you push to the `main` branch on GitHub, Vercel will automatically rebuild and redeploy. No manual steps needed.

---

## 8. Connect a Custom Domain (Hostinger)

### Step 1 — Purchase your domain on Hostinger

1. Go to https://www.hostinger.com
2. Search for your desired domain (e.g. `atplca.com`)
3. Add to cart and complete purchase
4. Your domain will appear in **Hostinger hPanel → Domains**

### Step 2 — Add the domain to Vercel

1. In your Vercel project, go to **Settings → Domains**
2. Type your domain (e.g. `atplca.com`) and click **Add**
3. Also add `www.atplca.com` and set it to redirect to the root domain
4. Vercel will show you the DNS records you need to add

### Step 3 — Configure DNS on Hostinger

1. Log in to **Hostinger hPanel** → **Domains** → click your domain → **DNS / Nameservers**
2. Click **DNS Records**
3. Add the following records as instructed by Vercel:

**For root domain (`atplca.com`):**
- Delete any existing `A` record for `@`
- Add new **A record**:
  - Name/Host: `@`
  - Points to: `76.76.21.21` *(Vercel's IP — confirm in your Vercel dashboard)*
  - TTL: `3600`

**For www subdomain:**
- Add **CNAME record**:
  - Name/Host: `www`
  - Points to: `cname.vercel-dns.com`
  - TTL: `3600`

4. Click **Save**

### Step 4 — Wait for propagation

DNS changes take **10 minutes to 48 hours** to fully propagate worldwide (usually under 1 hour).

You can check propagation status at: https://dnschecker.org

### Step 5 — SSL Certificate (automatic)

Vercel automatically provisions a free **Let's Encrypt SSL certificate** once DNS propagates. Your site will be accessible at `https://atplca.com` with a valid padlock.

> ✅ **Verification:** In Vercel → Settings → Domains, both domains should show a green checkmark once everything is working.

---

## 9. Default Login Credentials

After seeding, use these credentials to log in (all passwords are `password123`):

| Username | Role | Department | Access Level |
|----------|------|------------|--------------|
| `vinayak` | Super Master | — | Full system access |
| `priya.gst` | Admin | GST | Dept-wide access + user management |
| `meera.inc` | Admin | Income Tax | Dept-wide access |
| `arjun.lead` | Team Lead | GST | Team + own task management |
| `kavya.lead` | Team Lead | Income Tax | Team + own task management |
| `rahul.gst` | Employee | GST | Own tasks only |
| `sneha.gst` | Employee | GST | Own tasks only |
| `amit.inc` | Employee | Income Tax | Own tasks only |

> ⚠️ **Change all passwords immediately** before sharing with real users. Go to **Settings → Users** → select a user → Change Password.

---

## 10. Role Permissions Overview

| Feature | Employee | Team Lead | Admin | Super Master |
|---------|----------|-----------|-------|--------------|
| View own tasks | ✅ | ✅ | ✅ | ✅ |
| View team tasks | ❌ | ✅ | ✅ | ✅ |
| View all dept tasks | ❌ | ❌ | ✅ | ✅ |
| View all tasks | ❌ | ❌ | ❌ | ✅ |
| Advance task (T0→T3) | Own only | Team | Dept | All |
| Revert task | ❌ | Others' | Others' | All |
| Assign/Transfer task | ❌ | Team | Dept | All |
| Client Master | Read | Read | Read/Write | Read/Write |
| Onboard Client | ❌ | ❌ | ✅ | ✅ |
| Team Management | ❌ | View | View | Full |
| Audit Trail | ❌ | ❌ | ✅ | ✅ |
| Settings — Users | ❌ | ❌ | ✅ | ✅ |
| Settings — Compliance DB | ❌ | ❌ | ❌ | ✅ |
| Settings — System Config | ❌ | ❌ | ❌ | ✅ |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript |
| Styling | Tailwind CSS, Inter font, lucide-react icons |
| Backend | Next.js API Routes (serverless) |
| Database | Supabase (PostgreSQL) |
| Auth | Custom JWT (jose), bcryptjs, httpOnly cookies |
| Deployment | Vercel |
| DNS/Domain | Hostinger (optional) |

---

## Troubleshooting

**`npm install` fails:**
- Make sure Node.js v18+ is installed: `node -v`
- Try deleting `node_modules` and `package-lock.json`, then run `npm install` again

**Login says "Invalid credentials":**
- Make sure you ran `npm run seed` first
- Check that your `.env.local` has the correct Supabase keys
- Verify the `login_registry` table has rows in Supabase → Table Editor

**`npm run seed` fails with "Invalid API key":**
- Double-check `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`
- Make sure there are no extra spaces around the `=` sign

**Vercel build fails:**
- Check the build logs in Vercel dashboard for the specific error
- Most common: missing environment variables — ensure all 4 are set in Vercel project settings

**DNS not propagating:**
- Wait up to 48 hours (usually much faster)
- Check https://dnschecker.org with your domain name
- Verify the A record points to Vercel's IP shown in your Vercel dashboard

---

*Built for ATPL — CA Practice Management System*
