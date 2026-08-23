# 📅 DayPlanner — Full-Stack Productivity & Reflection Platform

A modern, feature-packed full-stack MERN (MongoDB, Express, React, Node.js) web application designed to help users structure their daily tasks, track time, build habits, reflect on daily progress, and visualize long-term productivity trends.

---

## 🌟 Short GitHub Description

> **DayPlanner** is a feature-packed full-stack MERN application for daily goal tracking, task time management, Pomodoro focus sessions, end-of-day reflections, and visual analytics with Dark Mode & CSV/PDF export.

---

## ✨ Features

- **🔐 Authentication & Security**: Secure user registration, JWT authentication, bcrypt password hashing, password reset flow, and Express rate-limiting.
- **📋 Day Planner & Task Management**:
  - Organize topics with custom categories (*Work, Study, Personal, Fitness, General, Other*) and priority levels (*High, Medium, Low*).
  - Estimated vs. Actual time tracking per task.
  - Quick 1-click routine/habit templates (*Workout, Reading, Meditation, Code Review*).
- **⏱️ Integrated Pomodoro Focus Timer**: Built-in 25m Focus / 5m Short Break / 15m Long Break timer with sound alerts, progress indicators, and task pre-loading.
- **📝 Daily Reflection Summary**: Reflect on wins, key lessons, achievements, mistakes, distractions, tomorrow's goals, mood tracker, and daily 1-10 rating.
- **📊 Visual Analytics**: Interactive **Recharts** graphs visualizing 7-day completion rate trends and mood distribution.
- **📄 History & Exporting**: Searchable reflection timeline with **Export to CSV** and formatted **Print/Save as PDF**.
- **🌓 Dark / Light Theme Toggle**: Persistent theme switcher with custom dark mode glassmorphism UI.
- **🔄 Resilient Database Connection**: Automatic failover between remote MongoDB Atlas and local MongoDB instances.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **UI Components**: Material UI (MUI) v6
- **Styling**: Tailwind CSS v4 + Custom CSS
- **Charts & Data Viz**: Recharts
- **State & Routing**: React Context API + React Router v7
- **Notifications**: React Hot Toast

### Backend
- **Runtime & Framework**: Node.js + Express.js v5
- **Database & ORM**: MongoDB + Mongoose v9
- **Security & Auth**: JSON Web Tokens (JWT), BcryptJS, Helmet, Express-Rate-Limit
- **Email Service**: Nodemailer

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (Local service or MongoDB Atlas cluster)

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/day-planner.git
   cd day-planner
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file inside `backend/`:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/dayplanner
   LOCAL_MONGO_URI=mongodb://127.0.0.1:27017/dayplanner
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:3500
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env` file inside `frontend/`:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

---

## 🏃 Running the Application

1. **Start Backend Server**:
   ```bash
   cd backend
   npm run server
   ```
   The backend API will run on `http://localhost:5000`.

2. **Start Frontend App**:
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend application will run on `http://localhost:3500`.

---

## 🧪 Testing

- **Backend End-to-End API Test**:
  ```bash
  cd backend
  node ../scratch/test_flow.js
  ```

- **Frontend Production Build**:
  ```bash
  cd frontend
  npm run build
  ```

---

## 🔑 Demo Account

For quick testing, you can use the pre-seeded demo credentials:
- **Email**: `demo@example.com`
- **Password**: `Password123!`

---

## 📄 License

This project is open source and available under the [ISC License](LICENSE).