# Bengaluru House Price Predictor

A production-grade, end-to-end Machine Learning property valuation application. This repository contains the complete three-tier architecture: a regression model service, a Node.js Express/Prisma API gateway, and a responsive glassmorphic React/TypeScript user interface.

## Table of Contents
1. System Architecture
2. Repository Structure
3. Model Service
4. Backend API Service
5. Frontend Application
6. Setup and Installation
7. API Reference

---

## System Architecture

The application is structured into three decoupled services:

1. Frontend Client: A high-performance SPA built with React 19, TypeScript, and Vite. It utilizes TanStack Query for caching and server-state synchronization, Axios for handling request interception, and Tailwind CSS v4 for styling.
2. Backend API: A Node.js API server built with Express and Prisma ORM. It implements JWT authentication (with rotating refresh tokens), routes requests, handles database state (PostgreSQL), and communicates with the Python ML service.
3. Model Service: A Python service running Flask that wraps a Ridge Regression model. It receives features (location, BHK, bathrooms, total square footage) and returns real-time house price predictions.

---

## Repository Structure

```text
house-price-predictor-project/
├── backend/                  # Express.js backend API
│   ├── src/                  # TypeScript source files
│   │   ├── controllers/      # Route controllers (Auth, User, Prediction)
│   │   ├── middleware/       # JWT validation, error handling
│   │   ├── routes/           # Express router registrations
│   │   ├── services/         # Business logic layer
│   │   └── index.ts          # Server entry point
│   ├── prisma/               # Database schema definition
│   ├── package.json          # Node dependencies and scripts
│   └── tsconfig.json         # TypeScript configuration
├── frontend/                 # React frontend client
│   ├── src/
│   │   ├── components/       # Component library (layout, shared, UI)
│   │   ├── contexts/         # Authentication context
│   │   ├── lib/              # Axios instance and routing utilities
│   │   ├── pages/            # Application pages (Dashboard, Settings, Auth)
│   │   ├── services/         # API abstraction layer
│   │   └── index.css         # Theme design tokens and base styles
│   ├── index.html            # SPA entry HTML
│   ├── package.json          # Frontend packages and scripts
│   └── vite.config.ts        # Vite configuration with aliases
└── model/                    # Machine Learning pipeline and API
    ├── Bengaluru_House_Data.csv # Raw historical dataset
    ├── Cleaned_data.csv      # Processed data
    ├── RidgeModel.pkl        # Serialized ridge regression model
    ├── app.py                # Flask deployment web server
    ├── clean_data.py         # Data preprocessing pipeline
    ├── train_model.py        # Model training script
    └── requirements.txt      # Python dependencies
```

---

## Model Service

### Tech Stack
- Python
- Scikit-learn (Ridge Regression)
- Pandas and NumPy
- Flask
- Gunicorn

### Machine Learning Details
- Dataset: historical Bengaluru housing dataset.
- Features processed: Location (one-hot encoded), BHK, Bathrooms, Total Square Footage.
- Outlier treatment: records with size/area mismatches or price anomalies removed.
- Pipeline: Scikit-learn Pipeline with ColumnTransformer for categorical mapping and Ridge regression estimator.

### Flask API Endpoint
- POST /predict
  Request body:
  ```json
  {
    "location": "Electronic City",
    "bhk": 2,
    "bath": 2,
    "total_sqft": 1200
  }
  ```
  Response body:
  ```json
  {
    "price_lakhs": 42.50
  }
  ```

---

## Backend API Service

### Tech Stack
- Node.js (Runtime)
- Express (API framework)
- TypeScript (Language)
- Prisma (ORM)
- PostgreSQL (Database)
- Zod (Validation)
- Pino (Logger)

### Security Features
- Secure JWT-based Authentication.
- Sliding-session token rotation: short-lived Access Tokens (15 minutes) and rotating Refresh Tokens (7 days).
- Token version invalidation on password change, forcing logout on all active devices.
- Password hashing using bcrypt.

---

## Frontend Application

### Tech Stack
- React 19
- TypeScript
- Vite 8
- Tailwind CSS v4
- TanStack Query v5
- Radix UI primitives

### UI Highlights
- Responsive glassmorphic layout optimized for desktop and mobile displays.
- Unified dark mode styling utilizing custom HSL color tokens.
- Cross-field form validation matching physical constraints (e.g., bathrooms cannot exceed BHK + 2).
- Automatic dropdown search matching unique geographic locations supported by the ML model.

---

## Setup and Installation

### Prerequisites
- Python 3.10+
- Node.js 20+
- PostgreSQL instance running

### 1. Model Service Setup
```bash
cd model
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```
Flask will start on `http://127.0.0.1:5000/`.

### 2. Backend Setup
Create a `.env` file in `backend/` with database connection and secret configs:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/house_predictor"
JWT_ACCESS_SECRET="your-super-secret-access-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
MODEL_SERVICE_URL="http://127.0.0.1:5000"
PORT=3000
```
Then run:
```bash
cd backend
pnpm install
npx prisma db push
pnpm run dev
```
Express will start on `http://localhost:3000/`.

### 3. Frontend Setup
Create a `.env` file in `frontend/` matching:
```env
VITE_API_URL="http://localhost:3000"
```
Then run:
```bash
cd frontend
npm install
npm run dev
```
Vite will serve the client application on `http://localhost:5173/`.

---

## API Reference

All requests must include a JSON payload with `Content-Type: application/json`. Authenticated routes require an `Authorization: Bearer <access_token>` header.

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Sign in to retrieve tokens (sets HTTP-only cookie)
- POST /api/auth/refresh - Rotate token pair using refresh token
- POST /api/auth/logout - Invalidate active session tokens

### Predictions
- GET /api/predict/locations - Retrieve unique locations supported by the model
- POST /api/predict - Submit property features for price calculation
- GET /api/predict/history - Retrieve user's paginated query logs
- POST /api/predict/favorites - Get or modify favorited property valuations
