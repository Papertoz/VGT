<div align="center">
  
# 🏋️‍♂️ VGTAI - Virtual Gym Trainer AI

**Your personal AI-powered fitness and nutrition coach.**

[![React](https://img.shields.io/badge/React-18.x-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=for-the-badge&logo=nodedotjs)](https://nodejs.org/)
[![LangChain](https://img.shields.io/badge/LangChain-AI-orange?style=for-the-badge)](https://js.langchain.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

</div>

---

## 📖 Overview

**VGTAI** (Virtual Gym Trainer AI) is an intelligent, full-stack web application designed to act as your ultimate personal trainer. By leveraging cutting-edge LLMs and specialized AI agents, VGTAI creates dynamic workout routines, tracks your active training sessions, offers personalized nutrition advice, and provides real-time coaching. 

With a beautifully designed, responsive, and glassmorphic UI, staying fit has never looked or felt this good.

---

## ✨ Key Features

- 🤖 **Multi-Agent AI Coaching:** Specialized AI agents handle different aspects of your fitness journey (Workouts, Nutrition, Recovery, Progress, Goals, Habits, and Safety).
- 📅 **Smart Weekly Plans:** Automatically generate personalized workout routines tailored to your goals, experience level, and available equipment.
- ⏱️ **Active Workout Tracker:** A live training mode with rest timers, exercise descriptions, and set/rep tracking.
- 💬 **Global AI Chat:** Access your AI coach from anywhere in the app to ask for advice on form, alternatives, or diet.
- 🎨 **Premium UI/UX:** Stunning glassmorphism design with fluid micro-animations, customizable dark/light themes, and a modern aesthetic.
- 🔐 **Secure Authentication:** User accounts and progress data secured via Firebase.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** & **Vite**
- **Framer Motion** (for buttery smooth animations)
- **Lucide React** (beautiful icons)
- **Vanilla CSS** (custom design system with CSS variables)

### Backend
- **Node.js** & **Express**
- **LangChain.js** & **@langchain/langgraph** (AI workflow orchestration)
- **Google Generative AI (Gemini)** (Core LLM for agent interactions)
- **Firebase Admin SDK** (Authentication and database)

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- A Firebase Project (with Auth and Firestore enabled)
- A Google Gemini API Key

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Papertoz/VGT.git
   cd VGT
   ```

2. **Setup the Backend:**
   ```bash
   cd backend
   npm install
   ```
   *Create a `.env` file in the `backend` directory and add your credentials:*
   ```env
   PORT=3000
   GEMINI_API_KEY=your_gemini_api_key
   # Add your Firebase service account JSON file to the backend folder
   ```

3. **Setup the Frontend:**
   ```bash
   cd ../frontend
   npm install
   ```
   *Create a `.env` file in the `frontend` directory and add your Firebase config:*
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

### Running the App

1. **Start the Backend Server:**
   ```bash
   cd backend
   npm start
   ```

2. **Start the Frontend Development Server:**
   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

---

## 🎨 Design System

VGTAI uses a highly customized CSS variable system (found in `index.css`) that automatically handles the transition between Light and Dark modes. It utilizes **Outfit** for bold, impactful headings and **Inter** for clean, readable body text.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check [issues page](https://github.com/Papertoz/VGT/issues).

---

<div align="center">
  <p>Built with ❤️ by Sahitya Singh</p>
</div>