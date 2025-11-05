# PulseFit — AI-generated Fitness Tracker

This repository contains **PulseFit**, a personal fitness tracking web app generated end-to-end by an AI assistant. It ships with a modern Next.js 16 stack, TypeScript, and Tailwind CSS styling.

## Features

- 📊 **Dashboard overview** with training volume, calorie burn, and hydration streaks.
- 📝 **Workout logging** form that captures session details and persists them in local storage.
- 💧 **Wellness tracking** for sleep, hydration, mood, and energy.
- 🎯 **Goal management** with percentage progress indicators and inline updates.
- 📈 **Weekly trends** and **training mix** visualizations (CSS-powered mini charts).
- ⚙️ **Reset option** to clear personal data at any time.

Sample data is seeded on first load so the interface is immediately informative. All subsequent changes stay on the device via `localStorage`—no backend required.

## Tech Stack

- Next.js 16 (App Router)
- React 19 with TypeScript
- Tailwind CSS v4

## Getting Started

```bash
cd web
npm install
npm run dev
```

Visit `http://localhost:3000` to use the app. Build and lint scripts are also available (`npm run build`, `npm run lint`).

## Deployment

This project is ready for one-command deployment on Vercel:

```bash
cd web
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-be8a5e47
```

Once live, verify the production instance with:

```bash
curl https://agentic-be8a5e47.vercel.app
```
