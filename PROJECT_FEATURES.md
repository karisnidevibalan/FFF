# 🚀 ResumeAI - Professional Resume Builder

A complete, full-stack resume builder application built for internship demonstration.

## ✨ Features Implemented

### 🎨 Frontend (React + TypeScript + Vite)

#### **9 Beautiful Resume Templates**
- Cosmos, Celestial, Galaxy, Aurora, Lunar, Eclipse, Nebula, Stellar, Orbit
- Each with unique color schemes and layouts
- ATS-optimized formatting

#### **Resume Builder**
- Live preview as you type
- Personal information section
- Work experience with multiple entries
- Education section with multiple entries
- Skills management
- Projects showcase
- Achievements/Certifications
- **Custom sections** - Add any section with custom title
- Real-time form validation

#### **ATS Checker (Dynamic)**
- Two modes: General ATS Check & Job Description Match
- Detailed scoring system (0-100)
- Categories: Contact Info, Structure, Action Verbs, Quantifiable Results, Keywords
- Strengths and improvement suggestions
- Keyword analysis

#### **User Dashboard**
- Resume management (Create, Edit, Delete)
- Stats overview (Total resumes, Avg ATS score, etc.)
- Quick action buttons
- Share resume functionality

#### **Profile Settings**
- Update personal information
- Change password
- Dark/Light mode toggle
- Notification preferences

#### **Resume Tips Page**
- Comprehensive writing guide
- DO's and DON'Ts for each section
- Power action verbs categorized by type
- Common mistakes to avoid

#### **Other Features**
- 🌙 Dark/Light mode
- 📱 Responsive design
- 🔒 Protected routes
- 🔐 User authentication
- 📄 PDF export
- 🔗 Share resume functionality
- 🎭 Framer Motion animations

### 🔧 Backend (Node.js + Express + MongoDB)

- User authentication (JWT)
- Resume CRUD operations
- MongoDB database integration
- RESTful API design

## 📁 Project Structure

```
resume/
├── backend/                 # Node.js Backend
│   ├── server.js           # Express server
│   ├── db/connect.js       # MongoDB connection
│   ├── models/             # Mongoose models
│   │   ├── User.js
│   │   ├── Resume.js
│   │   └── TemplateData.js
│   └── routes/             # API routes
│       ├── authRoutes.js
│       └── resumeRoutes.js
│
└── resumeapp/              # React Frontend
    ├── src/
    │   ├── components/     # React components
    │   │   ├── layout/     # Layout components
    │   │   ├── ui/         # shadcn/ui components
    │   │   └── ai/         # AI Assistant
    │   ├── pages/          # Page components
    │   ├── contexts/       # React contexts
    │   ├── hooks/          # Custom hooks
    │   ├── services/       # API services
    │   └── constants/      # Templates data
    └── public/
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **shadcn/ui** for components
- **Framer Motion** for animations
- **React Router** for navigation
- **React Query** for data fetching
- **jsPDF + html2canvas** for PDF export

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **bcryptjs** for password hashing

## 🚀 Running the Project

### Start Backend
```bash
cd backend
npm install
npm start
# Runs on http://localhost:5000
```

### Start Frontend
```bash
cd resumeapp
npm install
npm run dev
# Runs on http://localhost:8080
```

## 📊 Pages Available

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Landing page with features |
| Templates | `/templates` | Browse resume templates |
| Builder | `/builder` | Create/Edit resume |
| Dashboard | `/dashboard` | Manage your resumes |
| ATS Checker | `/ats-checker` | Check resume ATS score |
| Tips | `/tips` | Resume writing guide |
| Profile | `/profile` | Account settings |
| About | `/about` | About the app |
| Login | `/login` | User login |
| Signup | `/signup` | User registration |

## 🎯 Key Highlights for Internship

1. **Full-Stack Implementation** - Complete frontend and backend
2. **Modern Tech Stack** - React, TypeScript, Node.js, MongoDB
3. **Clean Code Architecture** - Organized components, contexts, services
4. **Real-World Features** - Auth, CRUD, File export, Responsive design
5. **UI/UX Focus** - Animations, dark mode, intuitive design
6. **ATS Compatibility** - Industry-relevant feature
7. **9 Custom Templates** - Original designs with unique color schemes

## 📈 Future Improvements

- [ ] AI-powered content suggestions (OpenAI integration)
- [ ] LinkedIn import
- [ ] Multiple file export formats (DOCX, HTML)
- [ ] Resume version history
- [ ] Analytics dashboard
- [ ] Team collaboration features

---

Built with ❤️ for internship demonstration
