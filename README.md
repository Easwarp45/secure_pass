# 🔐 SecurePass – Password Strength & Breach Checker

<div align="center">

![SecurePass](https://img.shields.io/badge/SecurePass-v1.0.0-00f5d4?style=for-the-badge&logo=shield&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-purple?style=for-the-badge)

**A modern, secure, and professional web application for analyzing password strength, checking data breaches, and learning about cryptographic hashing.**

[Live Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Architecture](#-architecture)
- [Security](#-security)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Folder Structure](#-folder-structure)
- [Screenshots](#-screenshots)

---

## 🌟 Overview

SecurePass is a full-stack web application that helps users evaluate their password security through:

1. **Password Strength Analysis** – Multi-metric scoring with entropy calculation
2. **Data Breach Detection** – Uses HaveIBeenPwned API with k-anonymity
3. **Brute Force Simulation** – Educational attack visualization
4. **Hashing Demo** – Interactive bcrypt hashing & salting demonstration
5. **Security Report** – Downloadable PDF security assessment

> ⚠️ **Privacy First**: No passwords are ever stored, logged, or transmitted insecurely.

---

## ✨ Features

### 🔍 Password Strength Analysis
- Score (0–100) based on multiple security metrics
- Entropy calculation (Shannon entropy)
- Character diversity analysis
- Common password dictionary check (200+ passwords)
- Sequential/repeated pattern detection
- Real-time strength meter with visual feedback
- Detailed improvement suggestions

### ⏱️ Crack Time Estimation
- Based on 10 billion guesses/second
- Character set size calculation
- Human-readable time formatting (seconds to centuries)

### 🔓 Data Breach Check (k-Anonymity)
- Uses HaveIBeenPwned Passwords API
- SHA-1 hash with only 5-character prefix sent
- Full password/hash never leaves the device
- Shows breach count if found
- Educational explanation of k-anonymity

### 💻 Brute Force Simulation
- Animated character-by-character guessing
- Adjustable simulation speed
- Visual progress bar
- Attempt counter
- Educational disclaimer

### 🔐 Hashing & Salting Demo
- Generate bcrypt hashes with configurable salt rounds
- Compare passwords against hashes
- Demonstrate salt uniqueness (same password → different hashes)
- Educational explanations

### 📄 Security Report
- Downloadable PDF report
- Includes strength analysis, suggestions, and best practices
- Password is NOT included in the report

### 🎲 Password Generator
- Cryptographically secure random generation
- Guaranteed character variety (upper, lower, digit, special)
- Fisher-Yates shuffle for randomness
- One-click copy to clipboard

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT (React)                     │
│  ┌───────────┐  ┌──────────┐  ┌───────────────────┐ │
│  │ Components │  │ Services │  │     Utilities     │ │
│  │            │  │          │  │                   │ │
│  │ Password   │  │ API      │  │ Strength Colors   │ │
│  │ Strength   │  │ Client   │  │ Quick Score       │ │
│  │ Breach     │  │          │  │ Clipboard         │ │
│  │ BruteForce │  │          │  │ Formatting        │ │
│  │ Hashing    │  │          │  │                   │ │
│  │ Charts     │  │          │  │                   │ │
│  └───────────┘  └──────────┘  └───────────────────┘ │
│                        │                              │
│                   Vite Dev Proxy                      │
└────────────────────────┼──────────────────────────────┘
                         │ HTTP/REST
┌────────────────────────┼──────────────────────────────┐
│                   SERVER (Express)                     │
│  ┌────────────┐  ┌────────────┐  ┌────────────────┐  │
│  │ Middleware  │  │ Controllers│  │    Services    │  │
│  │            │  │            │  │                │  │
│  │ Helmet     │  │ Password   │  │ Strength       │  │
│  │ CORS       │  │ Controller │  │ Breach (HIBP)  │  │
│  │ Rate Limit │  │            │  │ Hash (bcrypt)  │  │
│  │ Joi Valid. │  │            │  │                │  │
│  └────────────┘  └────────────┘  └────────────────┘  │
│                                         │             │
│                                    HIBP API           │
│                                  (k-anonymity)        │
└───────────────────────────────────────────────────────┘
```

---

## 🔒 Security

### Design Principles

| Principle | Implementation |
|-----------|---------------|
| **No storage** | Passwords are analyzed in-memory and discarded |
| **No logging** | Passwords are never logged to console or files |
| **k-Anonymity** | Only 5 chars of SHA-1 hash sent to HIBP API |
| **Rate limiting** | 3-tier rate limiting (general, strict, hash) |
| **Input validation** | Joi schemas with size limits |
| **Security headers** | Helmet.js with CSP, HSTS, etc. |
| **Body size limit** | 1KB max request body |
| **CORS** | Configured for specific origin only |
| **Autocomplete** | Disabled on all password inputs |

### Rate Limiting Tiers

| Endpoint | Limit | Window |
|----------|-------|--------|
| General (all routes) | 100 requests | 15 minutes |
| Breach check | 10 requests | 1 minute |
| Hashing operations | 5 requests | 1 minute |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** – UI library
- **Vite 7** – Build tool
- **Tailwind CSS 4** – Utility-first styling
- **Framer Motion** – Animations
- **Chart.js** – Data visualization
- **Axios** – HTTP client
- **jsPDF** – PDF report generation

### Backend
- **Node.js** – JavaScript runtime
- **Express** – Web framework
- **bcryptjs** – Password hashing
- **Helmet** – Security headers
- **express-rate-limit** – Rate limiting
- **Joi** – Input validation
- **node-fetch** – HIBP API calls

---

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm 9+

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/securepass.git
cd securepass

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install

# Start the development server (in two terminals)

# Terminal 1: Start backend
cd server
npm run dev

# Terminal 2: Start frontend
cd client
npm run dev
```

The app will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000

---

## 🚀 Deployment

### Frontend on Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Set the root directory to `client`
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```

### Backend on Render

1. Go to [render.com](https://render.com) and create a new Web Service
2. Connect your repository
3. Set the root directory to `server`
4. Set build command: `npm install`
5. Set start command: `node index.js`
6. Add environment variables:
   ```
   PORT=5000
   CLIENT_URL=https://your-app.vercel.app
   NODE_ENV=production
   ```

### Environment Variables

| Variable | Location | Description |
|----------|----------|-------------|
| `PORT` | Server | API server port (default: 5000) |
| `CLIENT_URL` | Server | Frontend URL for CORS |
| `NODE_ENV` | Server | Environment (development/production) |
| `VITE_API_URL` | Client | Backend API URL (for production) |

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api/password
```

### Endpoints

#### `POST /analyze`
Analyze password strength.
```json
// Request
{ "password": "MyP@ssw0rd!" }

// Response
{
  "score": 85,
  "label": "Very Strong",
  "entropy": 72.08,
  "charsetSize": 95,
  "crackTime": { "formatted": "2.4 million years" },
  "checks": { "lowercase": true, "uppercase": true, ... },
  "suggestions": ["✅ Great password! Keep it safe."]
}
```

#### `POST /breach`
Check for data breaches.
```json
// Request
{ "password": "password123" }

// Response
{
  "found": true,
  "count": 123456,
  "message": "⚠️ This password has been found in 123,456 data breaches!"
}
```

#### `POST /hash`
Generate bcrypt hash.
```json
// Request
{ "password": "test", "rounds": 10 }

// Response
{
  "hash": "$2a$10$...",
  "salt": "$2a$10$...",
  "rounds": 10,
  "durationMs": 84
}
```

#### `POST /compare`
Compare password against hash.
```json
// Request
{ "password": "test", "hash": "$2a$10$..." }

// Response
{ "isMatch": true, "durationMs": 75 }
```

#### `POST /salt-demo`
Demonstrate salt uniqueness.

#### `POST /generate`
Generate a strong random password.

#### `GET /health`
Health check endpoint.

---

## 📂 Folder Structure

```
securepass/
├── client/                     # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx           # Navigation bar
│   │   │   ├── PasswordInput.jsx    # Password input with controls
│   │   │   ├── StrengthMeter.jsx    # Strength analysis display
│   │   │   ├── EntropyChart.jsx     # Chart.js visualizations
│   │   │   ├── BreachCheck.jsx      # HIBP breach checker
│   │   │   ├── BruteForceSimulation.jsx  # Attack simulator
│   │   │   ├── HashingDemo.jsx      # Bcrypt demo
│   │   │   ├── SecurityReport.jsx   # PDF report generator
│   │   │   ├── Particles.jsx        # Background particles
│   │   │   └── Footer.jsx           # Footer
│   │   ├── services/
│   │   │   └── api.js               # API client (Axios)
│   │   ├── utils/
│   │   │   └── passwordUtils.js     # Client-side utilities
│   │   ├── App.jsx                  # Root component
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Global styles + Tailwind
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Express Backend
│   ├── controllers/
│   │   └── passwordController.js    # Route handlers
│   ├── routes/
│   │   └── passwordRoutes.js        # API routes
│   ├── middleware/
│   │   ├── rateLimiter.js           # Rate limiting (3 tiers)
│   │   └── validator.js             # Joi validation
│   ├── services/
│   │   ├── strengthService.js       # Password analysis engine
│   │   ├── breachService.js         # HIBP k-anonymity client
│   │   └── hashService.js           # Bcrypt hashing demo
│   ├── index.js                     # Server entry point
│   └── package.json
│
└── README.md                   # This file
```

---

## 🖼️ Screenshots

> Screenshots will be added after the first deployment.

| Feature | Screenshot |
|---------|-----------|
| Password Analyzer | *Coming soon* |
| Breach Check | *Coming soon* |
| Brute Force Sim | *Coming soon* |
| Hashing Demo | *Coming soon* |
| Entropy Charts | *Coming soon* |
| PDF Report | *Coming soon* |

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">

**Built with 🛡️ Security First**

SecurePass © 2026

</div>
#   s e c u r e _ p a s s  
 