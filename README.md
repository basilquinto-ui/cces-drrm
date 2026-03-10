# CCES DRRM Portal

**Camp Crame Elementary School — Disaster Risk Reduction and Management Portal**

Built with React + Vite + Supabase + Vercel

---

## 🚀 Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Copy `.env` and fill in your keys:
```
VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_GEMINI_API_KEY=your_gemini_key
VITE_WEATHER_API_KEY=your_openweathermap_key
```

### 3. Set up Supabase
- Go to supabase.com → your project → SQL Editor
- Run the contents of `supabase_setup.sql`
- This creates all tables + seeds default data

### 4. Set up Supabase Storage
- Go to Storage → New bucket → name it `incident-photos` → set to **Public**

### 5. Create admin account
- Go to Supabase → Authentication → Users → Invite user
- Use your admin email + password
- This is what you use to log in to the Admin Panel

### 6. Replace the logo
- Replace `src/assets/logo.png` with the actual CCES logo file

### 7. Run locally
```bash
npm run dev
```
Open http://localhost:5173

---

## 📦 Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# Settings → Environment Variables → add all 4 from .env
```

Or connect your GitHub repo to Vercel for automatic deploys on every push.

---

## 🗄️ Database Tables

| Table | Purpose |
|---|---|
| `staff` | School staff list |
| `alerts` | Emergency alerts |
| `incidents` | Incident reports |
| `checkins` | Daily staff check-ins |
| `resources` | Emergency supply inventory |
| `evacuation_routes` | Hazard-specific routes |
| `hazard_areas` | Campus area risk assessments |
| `drills` | Drill history log |

---

## 🔑 API Keys Needed

| Service | URL | Cost |
|---|---|---|
| Supabase | supabase.com | Free |
| Google Gemini | aistudio.google.com | Free |
| OpenWeatherMap | openweathermap.org | Free |
| Vercel | vercel.com | Free |

---

## 📱 Features

- ✅ Real-time weather (OpenWeatherMap)
- ✅ Animated weather header + weather card
- ✅ Daily hazard map with add/edit/delete areas
- ✅ Incident reporting with AI photo description (Gemini)
- ✅ Staff check-in system
- ✅ Emergency alerts
- ✅ Resource inventory management
- ✅ Emergency contacts (one-tap call)
- ✅ Evacuation routes
- ✅ Drill history
- ✅ Admin panel with Supabase Auth
- ✅ Deployable to Vercel

---

## 🏫 School Info

- **Name:** Camp Crame Elementary School
- **Address:** Castañeda St., Camp Crame, Brgy. Bagong Lipunan ng Crame, QC
- **Contact:** (02) 7754-2648
- **District:** QC District XVII · Est. 1952
