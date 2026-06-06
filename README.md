# Delacruz WebProg – Vercel Deployment Guide

## Pre-built Credentials (seeded into DB)
| Role   | Email                     | Password   |
|--------|---------------------------|------------|
| Admin  | alicia.reyes@robles.dev   | Alicia123! |
| Editor | jeyp@gnail.com            | jeyp123!   |
| Viewer | zere@gmail.com            | zere123!   |

---

## STEP 1 – Set up MongoDB Atlas (free)

1. Go to https://cloud.mongodb.com and sign in / create account.
2. Create a **free** cluster (M0 Sandbox).
3. Under **Database Access** → Add a new user (e.g. `delacruzAdmin` / choose a strong password). Role: **Atlas Admin**.
4. Under **Network Access** → Add IP Address → **Allow access from anywhere** (`0.0.0.0/0`).
5. Click **Connect** on your cluster → **Drivers** → copy the connection string.
   It looks like:
   ```
   mongodb+srv://delacruzAdmin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<password>` with your DB user password and add the DB name:
   ```
   mongodb+srv://delacruzAdmin:YourPassword@cluster0.xxxxx.mongodb.net/delacruz_db?retryWrites=true&w=majority
   ```
   Save this — you'll need it in Steps 2 and 3.

---

## STEP 2 – Deploy the SERVER to Vercel

1. Go to https://vercel.com → **New Project**.
2. Import your GitHub repo **OR** drag-and-drop the `delacruz-server` folder.
   - If using GitHub: push `delacruz-server` as its own repo first.
   - **Root Directory**: set to `delacruz-server` (if monorepo).
3. Under **Environment Variables**, add:
   | Key          | Value                                  |
   |--------------|----------------------------------------|
   | `MONGO_URI`  | your Atlas connection string from Step 1 |
   | `JWT_SECRET` | `delacruzSecretKey2025!`               |
   | `NODE_ENV`   | `production`                           |
4. Click **Deploy**. Wait for it to finish.
5. Copy the deployed URL, e.g. `https://delacruz-server-xyz.vercel.app`

---

## STEP 3 – Seed the database (insert the 3 users)

On your **local machine** (with Node.js installed):

```bash
cd delacruz-server
npm install

# Edit .env – replace MONGO_URI with your Atlas URI from Step 1
# MONGO_URI=mongodb+srv://...

node seed.js
```

You should see:
```
Connected to MongoDB
  ADDED alicia.reyes@robles.dev  [admin]
  ADDED jeyp@gnail.com           [editor]
  ADDED zere@gmail.com           [viewer]

Seed complete!
```

---

## STEP 4 – Deploy the CLIENT to Vercel

1. Open `delacruz-client/.env` and replace `YOUR_SERVER_VERCEL_URL_HERE` with your server URL from Step 2:
   ```
   VITE_API_URL=https://delacruz-server-xyz.vercel.app/api
   ```
2. Go to https://vercel.com → **New Project**.
3. Import `delacruz-client` folder (or its own GitHub repo).
   - **Framework Preset**: Vite
   - **Root Directory**: `delacruz-client` (if monorepo)
4. Under **Environment Variables**, add:
   | Key            | Value                                          |
   |----------------|------------------------------------------------|
   | `VITE_API_URL` | `https://delacruz-server-xyz.vercel.app/api`   |
5. Click **Deploy**.
6. Your app is live! Copy the client URL.

---

## STEP 5 – Update Server CORS with Client URL (optional but recommended)

Once you have the client URL (e.g. `https://delacruz-client-abc.vercel.app`), go back to your **server Vercel project** → Settings → Environment Variables and add:

| Key           | Value                                         |
|---------------|-----------------------------------------------|
| `CLIENT_URL`  | `https://delacruz-client-abc.vercel.app`      |

Then **Redeploy** the server.

---

## Quick Test

After deployment, open your client URL and log in with:
- **Admin**: `alicia.reyes@robles.dev` / `Alicia123!`
- **Editor**: `jeyp@gnail.com` / `jeyp123!`
- **Viewer**: `zere@gmail.com` / `zere123!`

---

## Folder Structure
```
delacruz-fixed/
├── delacruz-client/    ← React + Vite frontend
│   ├── vercel.json     ← SPA rewrite rules (already configured)
│   └── .env            ← set VITE_API_URL
└── delacruz-server/    ← Express + MongoDB backend
    ├── vercel.json     ← Serverless config (already configured)
    ├── seed.js         ← Run once to insert credentials
    └── .env            ← set MONGO_URI, JWT_SECRET
```
