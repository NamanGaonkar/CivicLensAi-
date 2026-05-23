# Project Title
LocalityAI

AI-powered civic reporting platform

## Team Members
- Naman Gaonkar

## Domain
Environment & Public Safety

## Problem Statement
Many civic issues are reported inconsistently, lack clear categorization, and are hard for city teams to triage and act on quickly. Citizens often face friction when reporting (unclear location, long forms, or missing follow-up), which reduces engagement and leads to unresolved or duplicated reports.

## Solution
LocalityAI makes civic reporting simple and fast with a map-first interface, succinct report forms, and an AI assistant that classifies and summarizes incoming reports. The system automatically routes priorities to the right teams, surfaces trends on a dashboard, and provides transparent status tracking for citizens and officials.

## Tech Stack Used
- HTML, CSS, JavaScript
- React / Node.js / Python
- Gemini / Google AI Studio / GitHub

## Features
- Map-based issue reporting with precise pin selection
- Photo upload and optional image analysis to aid triage
- AI assistant for clarifying reports, suggesting categories, and drafting summaries
- Real-time dashboard with trends, heatmaps, and status tracking
- Role-based views for citizens, admins, and officials with secure authentication
- Upvotes, comments, and community feed for prioritization
- Notification center for updates and status changes

## How to Run the Project
1. Download the project
2. Open the folder
3. Run the required command
4. Open the project in browser

Example:
```bash
npm install
npm run dev
```

## Demo / Screenshots
Screenshots from the app:

![Landing screen](assets/Screenshot%202026-05-23%20100452.png)

![Dashboard view](assets/Screenshot%202026-05-23%20100717.png)

![Report flow](assets/Screenshot%202026-05-23%20100726.png)

![Map and analytics](assets/Screenshot%202026-05-23%20100807.png)


## Future Scope
Possible improvements and next steps for LocalityAI:

- Move sensitive AI keys and service-role credentials to secure server/edge functions and never expose them in client bundles.
- Implement full production authentication and role management (SSO, OAuth, and service accounts) with strict RBAC and audit logs.
- Add automated tests (unit, integration, E2E) and a CI pipeline to run linting, builds, and tests on PRs.
- Build a mobile-responsive native wrapper (React Native / Expo) for better field reporting and offline support.
- Improve AI models: fine-tune classification models on local datasets, add model evaluation, and implement fallback heuristics.
- Data privacy and anonymization: add options for anonymous reporting, PII redaction, and data retention policies.
- Monitoring and observability: add performance monitoring, error reporting (Sentry), and analytics dashboards for usage metrics.
- Accessibility and localization: WCAG compliance and translation support for multiple languages.
- Advanced analytics & export: scheduled reports, CSV exports, and integration with city management systems.
- Moderation and trust: add human-in-the-loop moderation, spam detection, and abuse prevention for community content.
