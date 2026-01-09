# Quiz Application - CausalFunnel Assignment

A full-stack MERN quiz application featuring a modern UI, timed sessions, and detailed results.

---

## 📝 1. Overview & Approach to the Problem

### Overview
This application is a comprehensive quiz platform developed for the CausalFunnel Software Engineer Intern assignment. It allows users to register via email, take a 15-question quiz (fetched dynamically from the OpenTDB API) within a 30-minute time limit, and receive a detailed performance report.

### My Approach
My approach was to build a **production-ready, cloud-first application** that prioritizes both developer experience and user satisfaction.
- **Resilience**: I removed all local storage fallbacks and hardcoded localhost URIs to ensure the app is secure and ready for cloud deployment.
- **User Experience (UX)**: I focused on a "Premium" aesthetic using dark mode, glassmorphism, and smooth CSS animations to differentiate it from basic quiz apps.
- **Data Integrity**: I implemented defensive programming in the results calculation to ensure users see accurate percentages and scores even if data fields are missing due to network interruptions.
- **Scalability**: By using environment variables for all critical connections (MongoDB, API URLs), the app can be easily moved between staging and production environments.

---

## 🏗️ 2. Components Built

### Backend (Node.js & Express)
- **API Server (`server.js`)**: Configures the environment, establishes a Mongoose connection to your MongoDB Atlas cluster, and manages the API lifecycle.
- **User Model (`models/User.js`)**: Handles user persistence and email uniqueness.
- **QuizResponse Model (`models/QuizResponse.js`)**: Stores complex quiz data, including question details, user choices, and performance metrics.
- **API Routes (`routes/api.js`)**: Provides endpoints for email registration, quiz submission, and result retrieval.

### Frontend (React & Vite)
- **EmailPage**: A landing page with input validation and a premium "glass" aesthetic.
- **QuizPage**: The engine of the app. It manages the quiz state, the 30-minute countdown timer, choice shuffling, and navigation logic.
- **ReportPage**: A dynamic dashboard that visualizes scores and provide a side-by-side comparison of correct vs. user answers.
- **Timer Component**: A reusable countdown helper that integrates with the quiz submission logic.
- **Question Navigation**: An interactive grid that provides visual feedback on which questions have been visited or attempted.

---

## 🚀 3. Setup & Installation Instructions

### Prerequisites
- Node.js (v16+)
- A MongoDB Atlas Cluster (or local MongoDB)

### Backend Installation
1. `cd backend`
2. `npm install`
3. Create a `.env` file with:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```
4. `npm run dev`

### Frontend Installation
1. `cd frontend`
2. `npm install`
3. Create a `.env` file with:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
4. `npm run dev` (Runs on `http://localhost:3000`)

---

## 📝 4. Assumptions Made
1. **API Availability**: Assumes the OpenTDB API is reachable for fetching trivia questions.
2. **Email as ID**: Assumes the email provided is sufficient for identifying a user session without traditional passwords.
3. **Session Consistency**: Assumes `sessionStorage` is adequate for holding temporary email/result data during a single browser session.
4. **Cloud-First Requirement**: Assumes that hardcoded defaults (like `localhost`) are undesirable and that configuration should be strictly environment-driven.

---

## 🚧 5. Challenges Faced & Solutions

### A. HTML Entity Decoding
**Challenge**: Questions from the external API contained encoded characters (e.g., `&quot;`).
**Solution**: Built a `decodeHTML` utility that uses a hidden browser element to swap entities for readable text.

### B. Percentage Precision (NaN Fix)
**Challenge**: Missing data during a refresh could cause a `NaN%` display on the results screen.
**Solution**: Added robust defensive checks (`Number(score) || 0`) and ensured `totalQuestions` is explicitly passed in every payload.

### C. Hardcoded "Local" Fallbacks
**Challenge**: The original code defaulted to `localhost` if `.env` was missing, which caused connectivity errors.
**Solution**: Removed all local instances from the code and enforced explicit configuration through environment files and validation checks.

### D. Timer Integrity
**Challenge**: Ensuring the quiz auto-submits accurately across page interactions.
**Solution**: Leveraged the `useEffect` cleanup pattern to manage the countdown interval and prevent memory leaks or duplicate submissions.

---

## 📊 Technologies Used
- **Backend**: Node.js, Express, MongoDB, Mongoose, dotenv, CORS.
- **Frontend**: React 18, Vite, React Router, Axios, CSS3 (Custom Design System).
- **APIs**: Open Trivia Database (OpenTDB).