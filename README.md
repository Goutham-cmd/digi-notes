# 🪺 NoteNest — Academic Digital Notes & Peer Learning Network

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://digi-notes-git-main-code-breach.vercel.app)

> **NoteNest** is an academic digital notes repository and collaborative peer study platform built for modern university students, faculty, and research labs. It unifies lecture notes, syllabus roadmaps, video lecture integrations, peer study discussions, and instant academic resource distribution into a responsive, glassmorphic web application.

🔗 **Live Production Web App:** [https://digi-notes-breach.vercel.app/](https://digi-notes-breach.vercel.app/)

---

## ✨ Features (Full Vision)

<details>
<summary>🌌 <b>Interactive React Bits Galaxy</b> — WebGL Ambient Background</summary>

- Fluid WebGL 2.0 / GLSL particle starfield canvas.
- Real-time mouse repulsion dynamics and interactive click-warp shockwaves.
- Ambient celestial lighting tuned for zero distraction during long study sessions.
</details>

<details>
<summary>💬 <b>Student Study Lounge & Peer Messages</b> — Interactive Collaborative Learning</summary>

- Dedicated academic channels: `#general-campus`, `#data-structures-dsa`, `#operating-systems`, `#web-cloud-devops`, and `#exam-prep-doubts`.
- Interactive message composer with markdown support, direct note attachment sharing, and quick prompt chips.
- Peer emoji reactions and simulated TA peer guidance responses.
- Floating global chat launcher pill accessible from every view.
</details>

<details>
<summary>⚡ <b>1-Click Instant Test Access</b> — Frictionless Evaluation</summary>

- Top-level instant test entry for **Student Tester** and **Curriculum Admin** roles.
- Bypass signup friction during grading, demonstrations, and test runs.
- Persistent session state with immediate access to bookmarks, downloads, and discussion channels.
</details>

<details>
<summary>📖 <b>University Curriculum Engine</b> — Drill Down to Every Subject</summary>

- Multi-semester course exploration covering Semester 1 through Semester 8.
- Filter by academic disciplines: Computer Science, Information Science, Electronics, AI & Data Science.
- Real-time keyword search across titles, course codes (e.g., `CS204`, `CS301`), syllabus tags, and academic departments.
</details>

<details>
<summary>🔍 <b>High-Definition Document Previewer & Instant Download</b></summary>

- Crisp, subpixel antialiased 2D modal viewer with zero blurriness.
- Dual-mode download engine: connects directly to Supabase cloud storage buckets with an automated fallback generator creating comprehensive formatted syllabus study guides.
- Direct **"Discuss in Messages"** shortcut to jump from any note slide directly into course channel discussions.
</details>

<details>
<summary>🎥 <b>Integrated Lecture Video Sessions</b> — Synchronized Video Learning</summary>

- Direct embedded academic YouTube and university lecture streams mapped to specific study chapters.
- Quick link to jump into external high-resolution classroom recordings and tutorials.
</details>

<details>
<summary>🛡 <b>Academic Verification & Institutional Department Badges</b></summary>

- Replaced mock personal accounts with verified academic department authorities (`Dept. of Computer Science`, `Systems & Architecture Lab`, `Database Curriculum Group`).
- Peer-reviewed curriculum badges guaranteeing syllabus accuracy and exam alignment.
</details>

<details>
<summary>⚖️ <b>Production Compliance, Privacy & SEO</b></summary>

- Complete **Privacy Policy**, **Terms of Service**, and expandable **FAQ** accessible via footer triggers.
- GDPR / CCPA compliant cookie consent banner with policy deep-linking.
- Search-engine optimized with auto-generated `robots.txt`, `sitemap.xml`, OpenGraph meta cards, and custom branded 404 handler.
</details>

---

## 🏗 Architecture

```
NoteNest/
├── public/                     # Static assets, sitemap.xml, robots.txt, favicon.svg
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── globals.css         # Tailwind & crisp 2D elevation typography styles
│   │   ├── layout.tsx          # Root layout with OpenGraph SEO & metadata
│   │   ├── not-found.tsx       # Branded custom 404 page
│   │   └── page.tsx            # Main shell orchestrating views & legal modals
│   ├── components/
│   │   ├── auth/               # AuthView with 1-Click Test Access & Galaxy background
│   │   ├── common/             # Galaxy WebGL, CookieConsent, Toast, 3D cards
│   │   ├── layout/             # Sidebar, Header, Mobile navigation
│   │   ├── legal/              # LegalModal (Privacy Policy, Terms, FAQ)
│   │   ├── notes/              # NoteCard, NotePreviewModal, NoteUploadModal
│   │   └── views/              # DashboardView, BrowseView, ChatView, SettingsView
│   ├── context/
│   │   └── AppContext.tsx      # Unified state management, Supabase sync, downloads
│   ├── data/
│   │   ├── chatData.ts         # Study lounge channels & pre-loaded peer discussions
│   │   └── mockData.ts         # Academic curriculum catalog & department resources
│   ├── lib/
│   │   ├── analytics.ts        # Privacy-preserving event tracking
│   │   ├── supabase.ts         # Supabase client configuration
│   │   └── videoUtils.ts       # Video URL parser & embed helpers
│   └── types/
│       └── index.ts            # TypeScript interfaces (Note, ChatMessage, Channel, User)
└── package.json
```

---

## 🛠 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | [Next.js 15](https://nextjs.org/) (App Router, Turbopack, React 19) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/), Glassmorphism, 2D Hardware-Accelerated Keyframes |
| **Shaders & Visuals** | [React Bits](https://reactbits.dev/) WebGL 2.0 / GLSL Galaxy Particle Engine |
| **Icons & UI** | [Lucide React](https://lucide.dev/) |
| **Database & Auth** | [Supabase](https://supabase.com/) (PostgreSQL, Storage, Auth) |
| **Hosting & CDN** | [Vercel](https://vercel.com/) Edge Network |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.18+ or 20+
- npm or pnpm

### 1. Clone the Repository

```bash
git clone https://github.com/Goutham-cmd/digi-notes.git
cd digi-notes
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

### 5. Build for Production

```bash
npm run build
npm start
```

---

## 🌐 Live Deployment

The latest production build is continuously deployed on Vercel:

- **Main Branch Deployment:** [https://digi-notes-git-main-code-breach.vercel.app](https://digi-notes-git-main-code-breach.vercel.app)
- **Primary Domain:** [https://digi-notes-deribwuxp-code-breach.vercel.app](https://digi-notes-deribwuxp-code-breach.vercel.app)

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
