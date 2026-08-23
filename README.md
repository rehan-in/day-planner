# DayPlanner

DayPlanner is a full-stack MERN (MongoDB, Express, React, Node.js) web application designed to help users plan daily goals, manage task time, conduct end-of-day reflections, and track long-term productivity trends.

---

## Project Overview

DayPlanner provides an intuitive dashboard for daily task planning, habit formation, and personal growth reflection. Key capabilities include:

- **Task Planning & Category Tracking**: Organize tasks into categories (*Work, Study, Personal, Fitness, General, Other*) with priority levels and estimated vs. actual time tracking.
- **Focus Pomodoro Timer**: Built-in 25-minute focus session timer with short/long break presets and sound notifications.
- **Habit Templates**: One-click quick-add routines for common habits (Workout, Reading, Meditation, Code Review).
- **Daily Reflection & Summary**: End-of-day review questionnaire tracking achievements, key learnings, setbacks, mood, and daily ratings.
- **Visual Analytics**: Interactive charts visualizing weekly completion rates, task distributions, and mood trends using Recharts.
- **Data Export & History**: Searchable history logs with one-click CSV export and print-to-PDF formatting.
- **Dark / Light Theme**: Built-in dark mode support with automatic user preference persistence.
- **Secure Authentication**: JWT-based authentication, password hashing, and rate-limiting on authentication endpoints.

---

## Technology Stack

| Layer | Technologies Used |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Material UI (MUI), Recharts, React Router v7 |
| **Backend** | Node.js, Express.js, Mongoose, JWT, BcryptJS, Express-Rate-Limit, Helmet |
| **Database** | MongoDB (Atlas or Local MongoDB instance) |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local service or cloud cluster)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/day-planner.git
   cd day-planner
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   LOCAL_MONGO_URI=mongodb://127.0.0.1:27017/dayplanner
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=7d
   FRONTEND_URL=http://localhost:3500
   ```

3. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

### Running the Project

1. **Start the backend server**:
   ```bash
   cd backend
   npm run server
   ```

2. **Start the frontend application**:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open `http://localhost:3500` in your web browser.

---