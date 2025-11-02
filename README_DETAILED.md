# CivicLens — AI-powered Civic Platform

This companion README (README_DETAILED.md) documents the current CivicLens front-end, features, screenshots placeholders, and run instructions. It is safe to use alongside the existing README. If you prefer, I can replace the root `README.md` with this content.

## Quick overview

- Framework: React + TypeScript (Vite)
- Styling: Tailwind CSS
- Maps: react-leaflet + Leaflet (OpenStreetMap tiles)
- Backend/client: Convex (queries/mutations in `convex/_generated/api`)
- Toasts: Sonner
- Icons: lucide-react

The UI uses a Spider‑Man inspired red → blue palette for primary gradients and CTA accents.

## Features

- Landing page with hero video and conditional CTAs (Get started / Go to Dashboard depending on auth state).
- Dashboard with quick stats, interactive maps that show reports, and a trends chart.
- AI Chatbot (client-side UI) available on the Dashboard to help users with questions. On mobile it opens as a bottom-sheet.
- Report form with image upload, tags, categories, and a react-leaflet map where users can click to set the exact report location.
- Mobile-friendly UX: report FAB on small screens, mobile back button on the report form, sticky report CTA on the landing page.

## Screenshots 


- `assets/screenshots/landing-page.png` — Landing page (hero + video)
- `assets/screenshots/dashboard-mobile.png` — Dashboard on mobile (stats + chatbot button)
- `assets/screenshots/report-form-mobile.png` — Report form on mobile (back button visible)
- `assets/screenshots/reports-map.png` — Reports map on dashboard (CircleMarkers + popups)

Markdown example to show images in a README:

```
![Landing page](assets/screenshots/landing-page.png)
```

If you want, I can add the images you uploaded in this chat into `assets/screenshots/` for you — tell me which attachments to place and I will copy them into the repo.

## How to run (dev)

Open PowerShell in the project root and run:

```powershell
cd "c:\Users\Naman Gaonkar\Desktop\AITD\Projects\civiclens_-_ai-powered_civic_platform"
npm install
npm run dev
```

Notes:
- Tailwind directives (`@tailwind`, `@apply`) are processed at build time by PostCSS/Tailwind; some static analyzers may show "unknown at-rule" warnings in `src/index.css`. The dev server will handle them.
- Leaflet CSS is imported in `src/main.tsx` so the react-leaflet maps render correctly.

## Files of interest

- `src/components/LandingPage.tsx` — landing hero, CTAs, embedded video.
- `src/components/Dashboard.tsx` — dashboard layout, stats, and the map section.
- `src/components/ReportsMap.tsx` — interactive map on the dashboard.
- `src/components/ReportForm.tsx` — report submission form (map picker + upload).
- `src/components/AIChatbot.tsx` — responsive chatbot UI (dashboard-only).
- `src/App.tsx` — simple view-state routing (dashboard / report / landing) and top-level layout.

## UX notes

- Chatbot: by user request the chatbot is dashboard-only. It opens as a bottom-sheet on mobile. The chatbot FAB has been nudged upward on small viewports to avoid overlapping with the report FAB.
- Report flow: the report form includes a mobile-only fixed back button (top-left inside the viewport) and a mobile FAB for opening the report flow. The map in the report form supports clicking to set coordinates.

## Next steps I can help with

- Add the actual screenshots into `assets/screenshots/` using the images you provided in this session.
- Replace the root `README.md` with this content if you want a single canonical README.
- Run through a guided smoke test and fix any runtime issues you encounter locally.

---

If you'd like me to copy the screenshots from this chat into the repo, tell me which attachments to use (e.g., "use attachment: dashboard-mobile.png and report-form-mobile.png") and I'll add them under `assets/screenshots/` and update the root `README.md` to show them inline.
