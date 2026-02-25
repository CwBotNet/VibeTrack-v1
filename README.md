# VibeTrack ⚡️

VibeTrack is a modern, high-performance personal tracker designed specifically for developers. It enables you to seamlessly inventory your technical skills, plot complex roadmap milestones, track portfolio projects, and collect achievements through a visually stunning, gamer-style interface. 

Built from the ground up to be extremely fast, responsive, and beautiful, VibeTrack bridges the gap between task management and gamified progression.

## ✨ Features

- **Skill Inventory**: Map out your tech stack, define granular sub-units of learning, and measure your exact proficiency matrix.
- **Roadmap Architecture**: Construct long-term goals phase-by-phase with active/locked dependencies.
- **Portfolio Tracking**: Aggregate all your shipped projects, task lists, and Github links in a sleek gallery. 
- **Achievement Engine**: Earn Studio Ghibli-themed achievement banners and dynamic trophies as you complete skill challenges.
- **Progress Logs**: Keep a daily log of what you learned. All entries are persisted to the cloud and contribute to your overall activity stats.
- **Real-Time Data**: Seamless backend synchronization, data wipes, and true data persistence powered by Supabase.
- **Dark/Light Themes**: Beautiful, glassmorphism-inspired UI with completely customized styling for both themes.

## 🛠️ Technology Stack

1. **Frontend**: React 19, TypeScript, Vite
2. **Backend/Database**: Supabase (PostgreSQL, Auth)
3. **Animations**: Framer Motion
4. **Icons**: Lucide React
5. **Charts**: Recharts

## 🚀 Getting Started

### Prerequisites

- Node.js environment (v18+)
- Active Supabase account and project

### Installation

1. Clone the repository
```bash
git clone https://github.com/CwBotNet/VibeTrack.git
cd VibeTrack
```

2. Install dependencies
```bash
npm install
```

3. Configure Environment Variables
Create a `.env` file in the root of the project with your Supabase credentials. Do not commit this file to version control.
```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server
```bash
npm run dev
```

Navigate to `http://localhost:5173` to view the application.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check [issues page](https://github.com/CwBotNet/VibeTrack/issues). if you want to contribute, please keep the UI sleek and adhere to the project's glassmorphism and modern aesthetic standard.

## 📝 License

This project is [MIT](https://opensource.org/licenses/MIT) licensed.
