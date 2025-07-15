# ⚙️ func(Kode) — Developer Collective Platform

Welcome to the official website of [func(Kode)](https://func-kode.netlify.app/) — a community-first initiative built by developers, for developers.  
This project is the central platform for onboarding, collaboration, and real-time contribution tracking within the **func(Kode)** GitHub organization.

<img width="250" height="250" alt="Copilot_20250701_193201" src="https://github.com/user-attachments/assets/8f3c155a-3722-45a7-a86e-3894d83922e4" />

---

## 🌐 Live Site

🔗 https://func-kode.netlify.app/
---

## 🧠 What is func(Kode)?

`func(Kode)` is an open dev community that promotes collaboration, learning, and side-project building — using **GitHub-first workflows**.

Our goal:  
To create a hub where developers can sign in, contribute meaningfully, and grow with like-minded techies through weekly sprints and live project tracking.

---

## 📦 Tech Stack

- [Next.js 14 (App Router)](https://nextjs.org/)
- [Supabase Auth + DB](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [GitHub Webhooks](https://docs.github.com/en/developers/webhooks-and-events/about-webhooks)
- [PostgreSQL via Supabase]

---

## 🚀 Features

- 🔐 GitHub OAuth login
- 🧑 Onboarding flow (`/onboard`) to set user profile
- 📊 Dashboard to view contribution activity from our GitHub org
- 🔔 GitHub webhook integration to track pushes, PRs, issues, and more
- 🔒 Protected routes & role-based views
- 💬 Community Discussions via GitHub

---

## 🛠️ Local Development

```bash
git clone https://github.com/func-kode/site.git
cd site
npm install

NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

npm run dev
