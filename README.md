# CivicLens — AI-powered Civic Engagement Platform

An innovative React + TypeScript web application designed to transform how communities report, analyze, and resolve civic issues using real-time maps, AI-assisted analysis, and interactive dashboards.

---

## 🎯 Overview

**CivicLens** is a smart civic engagement platform that empowers citizens to report civic issues efficiently while providing administrators with AI-powered insights and real-time analytics. The app combines interactive mapping, AI chatbot assistance, and intuitive mobile-first design to bridge the gap between communities and city services.

### Key Tech Stack
- **Frontend**: React + TypeScript (Vite)
- **Styling**: Tailwind CSS with Spider‑Man inspired red/blue theme
- **Maps**: react-leaflet + OpenStreetMap
- **Backend**: Convex (serverless backend with real-time queries)
- **UI Components**: lucide-react icons, Framer Motion animations, Sonner toasts
- **Auth**: Convex Auth (anonymous + email/password support)

---

## ✨ Core Features

![Landing Page](assets/a.png)

![Dashboard Overview](assets/b.png)



![AI Chatbot](assets/c.png)



![Report Form](assets/d.png)


![Reports Map](assets/e.png)



![Mobile Interface](assets/f.png)


![Design Theme](assets/g.png)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- A modern web browser

### Installation & Running

1. **Clone the repository** (once pushed to GitHub):
```bash
git clone https://github.com/NamanGaonkar/civiclens_-_ai-powered_civic_platform.git
cd civiclens_-_ai-powered_civic_platform
```

2. **Install dependencies**:
```powershell
npm install
```

3. **Start the dev server**:
```powershell
npm run dev
```

4. **Open in browser**:
   Navigate to `http://localhost:5173` (or the URL shown in terminal)

### Notes
- Tailwind CSS directives (`@tailwind`, `@apply`) are build-time processed — static analyzers may flag them as warnings, but the dev server handles them correctly.
- Leaflet maps require the CSS import in `main.tsx` — this is already configured.
- Auth uses Convex Auth with anonymous sign-in support.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── LandingPage.tsx          # Hero page with video & CTAs
│   ├── Dashboard.tsx            # Analytics & stats dashboard
│   ├── ReportForm.tsx           # Report submission with map picker
│   ├── ReportsMap.tsx           # Interactive map of all reports
│   ├── AIChatbot.tsx            # AI assistant UI (responsive)
│   ├── StatsCard.tsx            # Dashboard stat cards
│   ├── TrendsChart.tsx          # Analytics trends
│   └── RecentReports.tsx        # Activity feed
├── App.tsx                       # Main routing & layout
├── main.tsx                      # Entry point (Leaflet CSS imported here)
├── index.css                     # Tailwind directives & custom classes
└── vite-env.d.ts

convex/
├── schema.ts                     # Database schema
├── reports.ts                    # Report mutations/queries
├── analytics.ts                  # Analytics queries
├── auth.ts                       # Auth configuration
└── _generated/                   # Auto-generated Convex API

assets/
├── a.png - g.png               # Screenshots & UI images
```

---

## 🎮 How to Use

### For Citizens
1. **Sign Up/Sign In**: Use the authentication form (anonymous or email/password)
2. **Report an Issue**: 
   - Click the floating report button (mobile) or "Report Issue" nav link (desktop)
   - Fill in title, description, and category
   - Click on the map to pinpoint the exact location
   - Optionally upload a photo
   - Add relevant tags
   - Submit the report
3. **Chat with AI**: Open the chatbot on the dashboard for assistance
4. **View Analytics**: Check the dashboard to see community-wide issue trends

### For Administrators
- Monitor real-time report metrics and trends
- Use the interactive map to identify issue hotspots
- Review AI-powered analysis of submitted reports (coming soon)
- Track resolution rates and community engagement

---

## 🔐 Security & Privacy

- Authentication powered by Convex Auth
- Anonymous posting supported for civic participation
- User sessions managed securely
- Image uploads handled via secure Convex storage with signed URLs
- No API keys exposed in client code

---

## 🚀 Upcoming Features

- **Real AI Integration**: Google Gemini for intelligent report classification and analysis
- **Image Recognition**: Automatic categorization of civic issues from photos
- **Advanced Analytics**: Machine learning insights for city planners
- **Community Voting**: Upvote/downvote reports to prioritize action
- **Notification System**: Real-time alerts for report updates
- **Export & Reporting**: City admin dashboards with data export capabilities

---

## 🛠️ Development

### Tech Details
- **State Management**: React hooks + Convex queries/mutations
- **Styling**: Tailwind CSS utility classes
- **Animations**: Framer Motion
- **Maps**: react-leaflet with OpenStreetMap (free, no API key required)
- **Build Tool**: Vite (fast HMR and optimized builds)
- **Icons**: lucide-react (beautiful SVG icons)

### Build for Production
```powershell
npm run build
npm run preview
```

### Environment Variables
Create a `.env.local` file if needed (Convex handles most config):
```
VITE_CONVEX_URL=your_convex_deployment_url
```

---

## 📊 Performance & Scalability

- Convex handles real-time queries and automatic caching
- React's virtual DOM ensures smooth UI even with large datasets
- Leaflet provides optimized map rendering
- Mobile-first design minimizes data transfer
- Lazy loading for images and heavy components

---

## 🤝 Contributing

We welcome contributions! Areas where we'd love help:
- UI/UX improvements
- Mobile responsiveness enhancements
- Additional map features
- Translation support (i18n)
- Documentation

---

## 📝 License

This project is open-source and available for educational and community use.

---

## 👨‍💻 Created By

**Naman Gaonkar**

Passionate about civic tech, community engagement, and building solutions that create real-world impact.

- GitHub: [NamanGaonkar](https://github.com/NamanGaonkar)
- LinkedIn: [Naman Gaonkar](https://linkedin.com/in/naman-gaonkar)

---

## 🙏 Acknowledgments

- Built with **React**, **TypeScript**, and **Tailwind CSS**
- Maps powered by **OpenStreetMap** and **Leaflet**
- Backend infrastructure by **Convex**
- Icons from **lucide-react**
- Animations by **Framer Motion**

---

## 📞 Support & Feedback

Have questions or feedback? Feel free to open an issue on GitHub or reach out directly.

**Let's build better communities together! 🌍**
  
