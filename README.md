# Andi Alifsyah Dyasham — Portfolio

Personal portfolio website of **Andi Alifsyah Dyasham**, a Software Engineer & AI Researcher specializing in high-scale banking systems and Sovereign AI.

🔗 **Live site:** [andialifs.github.io](https://andialifs.github.io/)

---

## About

> _"Slashed development cycles by 70% through AI automation and engineered core migrations of 114+ transaction types in high-scale banking infrastructure."_

An engineer primarily focused on backend development and artificial intelligence, with 3+ years of experience in high-scale banking systems — managing core migrations of 114+ transaction types and pioneering Sovereign AI solutions. Contributed to scientific publications in NLP at international conferences, and in 2023 was named **Best Graduate** of the Faculty of Computer Science at Universitas Brawijaya (GPA 3.95), with 15+ national and international awards.

| | |
|---|---|
| **Experience** | 3+ years |
| **Awards** | 15+ |
| **GPA** | 3.95 · Summa Cum Laude |
| **Projects** | 20+ |

---

## What's on the site

The site is a single-page application (`index.html`) divided into the following sections, with separate detailed case-study pages under `case-study/`:

- **Home / Hero** — intro, social links, and CV download
- **About** — background, expertise, and key stats
- **Experience** — professional journey (Bank Mandiri, Ihsan Solusi Informatika, SiMi Kita Selesaikan, and more)
- **Education** — M.Kom & S.Kom from Universitas Brawijaya
- **Skills** — languages & tools (Python, Golang, PyTorch, LangGraph, Docker, Kubernetes, gRPC…) and expertise areas
- **Portfolio** — tabbed view of case studies, AI & data science work, and full-stack/AI apps
- **Research** — NLP publications and scientific work
- **Awards** — national and international recognition

### Featured case studies

- **AI-Powered Intelligent Operational Monitoring** — lifted SLA from 23% → 99% across 678 monitored transactions
- **Prefix-Tuned Encoder-Decoder Model** — improved BLEU 0.653 → 0.782 while updating only 0.85% of parameters (PEFT)
- **SNAP-BI Compliant Open API Gateway** — migrated 114+ legacy endpoints to 10+ Go microservices
- **NYAMPE** — GPS-verified electronic attendance (Go, Angular, Haversine)
- **Aura** — agentic AI swing-trade co-pilot (Angular, Go, Gemini Pro)

---

## Features

- **Bilingual (i18n)** — instant toggle between English and Indonesian, persisted in `localStorage`
- **Light / dark theme** — toggle persisted in `localStorage`
- **Responsive** — mobile menu and adaptive layout
- **Scroll animations** — powered by [AOS](https://michalsnik.github.io/aos/)
- **Animated counters** — stats count up on scroll via `IntersectionObserver`
- **Installable PWA** — `manifest.json` enables standalone install
- **SEO-ready** — Open Graph, Twitter cards, and meta description

---

## Tech stack

| Layer | Technology |
|---|---|
| Markup | Static HTML |
| Styling | [Tailwind CSS](https://tailwindcss.com/) (CDN) + custom `css/main.css` |
| Scripting | Vanilla JavaScript (no framework / build step) |
| Fonts | Bricolage Grotesque, DM Sans, JetBrains Mono (Google Fonts) |
| Icons | Font Awesome 6 |
| Animation | AOS 2.3.1 |
| Analytics | Google Analytics (gtag) |
| Hosting | GitHub Pages |

No bundler, package manager, or compile step — everything runs directly in the browser.

---

## Project structure

```
.
├── index.html              # Single-page portfolio (all sections)
├── manifest.json           # PWA manifest
├── css/
│   └── main.css            # Custom styles (on top of Tailwind CDN)
├── js/
│   ├── app.js              # Theme, i18n, tabs, counters, AOS, mobile menu
│   └── scripts.js          # Legacy/auxiliary script
├── locales/
│   ├── en.json             # English copy
│   └── id.json             # Indonesian copy
├── case-study/             # Detailed case-study pages
│   ├── case-study-auratrading.html
│   ├── case-study-branchx.html
│   ├── case-study-jisebi.html
│   ├── case-study-nyampe.html
│   ├── case-study-openapi.html
│   └── case-study-shiladashboard.html
├── assets/
│   ├── img/                # Profile image, favicon, etc.
│   ├── archive/            # Archived assets
│   └── CV_AndiAlifsyahEnglish_V2.pdf
├── tools/                  # Benchmark scripts (PowerShell/batch)
└── personal_notes/         # Standalone mini-apps & knowledgebases
```

> **Note on localization:** translations are inlined in `js/app.js` (the `TRANSLATIONS` object) so the page works over `file://` without fetch/CORS issues. The `locales/*.json` files mirror that copy and are the canonical source — keep both in sync when editing text.

---

## Running locally

No build step is required. Because the translations are inlined in `app.js`, you can open the file directly:

```bash
# Simplest: open index.html in your browser
```

Or serve it locally to mirror production (recommended for testing assets and the manifest):

```bash
# Python 3
python -m http.server 8000

# or Node
npx serve .
```

Then visit `http://localhost:8000`.

---

## Editing content

- **Text / copy** — edit the matching keys in `locales/en.json` **and** `locales/id.json`, and mirror the change in the `TRANSLATIONS` object in `js/app.js`. Sections in `index.html` reference these via `data-i18n="<key>"` attributes.
- **Sections** (experience, education, skills, awards) — edit the corresponding block directly in `index.html`.
- **Case studies** — edit the relevant file in `case-study/`.
- **Styling** — utility classes via Tailwind; custom rules in `css/main.css`.

---

## Deployment

Hosted on **GitHub Pages** at [andialifs.github.io](https://andialifs.github.io/). Pushing to the default branch automatically publishes the site — no CI or build pipeline involved.

---

## Contact

- 📧 Email: [andyalyfsyah4@gmail.com](mailto:andyalyfsyah4@gmail.com)
- 💼 LinkedIn: [andyalyf](https://www.linkedin.com/in/andyalyf)
- 💻 GitHub: [AndiAlifs](https://github.com/AndiAlifs)
- 🎓 Google Scholar: [Andi Alifsyah](https://scholar.google.com/citations?user=kedZTroAAAAJ)

---

© 2026 Andi Alifsyah. All rights reserved.
