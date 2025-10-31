# Credit Jambo - Admin Application

Admin interface for managing Credit Jambo users and verifying device IDs.

## Features

- Admin authentication
- View all users
- View unverified users
- Verify/Unverify user devices
- Delete users
- View all notifications
- View all transactions
- User statistics dashboard

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (shared with client app)
- **Authentication:** JWT
- **Security:** Helmet, Rate Limiting, SHA-512 password hashing

---

## Setup Instructions

### Prerequisites

- Docker & Docker Compose
- Node.js (for generating secrets)
- Running Credit Jambo Client app (for shared database)
- Make sure you use reachable email (you will get a confirmation email upon verification)

### Installation

1. Clone the repository

2. Set up environment variables

```bash
cd backend
cp .env.example .env

Important: Ensure the Credit Jambo database is running and accessible
cd ..
docker compose up --build

Access the services:

Admin API: http://localhost:5000/api

Swagger Docs: http://localhost:5000/api-docs

API Endpoints

Admin Authentication

POST /api/admin/login — Admin login

User Management

GET /api/users — Get all users

GET /api/users/unverified — Get unverified users

PATCH /api/users/:userId/verify — Verify user device

PATCH /api/users/:userId/unverify — Unverify user device

DELETE /api/users/:userId — Delete user

Notifications

GET /api/notifications — Retrieve all notifications

Transactions

GET /api/transactions — Retrieve all transactions (or filter by ?userId=)

Database Setup

The Admin app connects to the same PostgreSQL database as the Credit Jambo Client app.
Below are the SQL schemas required to ensure all referenced tables exist.Please Make Sure That Credit jambo Admin is Running

-- ==========================
-- USERS TABLE
-- ==========================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  salt VARCHAR(255),
  phone_number VARCHAR(20),
  device_id VARCHAR(255),
  verified BOOLEAN NOT NULL DEFAULT false,
  role VARCHAR(10) DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- ADMINS TABLE
-- ==========================
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  salt TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================
-- USERS TABLE
-- =====================================
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  salt VARCHAR(255),
  phone_number VARCHAR(20),
  device_id VARCHAR(255),
  verified BOOLEAN NOT NULL DEFAULT false,
  balance NUMERIC(12,2) DEFAULT 0,
  role VARCHAR(10) DEFAULT 'user',
  account_number VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================
-- ADMINS TABLE
-- =====================================
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  salt TEXT NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================
-- ACCOUNTS TABLE
-- =====================================
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_number BIGINT UNIQUE DEFAULT nextval('account_number_seq'),
  currency VARCHAR(3) NOT NULL DEFAULT 'RWF',
  balance NUMERIC(14,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================
-- TRANSACTIONS TABLE
-- =====================================
CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(10) NOT NULL CHECK (type IN ('deposit', 'withdraw')),
  amount NUMERIC(12,2) NOT NULL,
  description TEXT,
  device_id TEXT,
  old_balance NUMERIC(12,2),
  new_balance NUMERIC(12,2),
  created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================
-- NOTIFICATIONS TABLE
-- =====================================
CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50),
  message TEXT,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================
-- SAVINGS TABLE
-- =====================================
CREATE TABLE IF NOT EXISTS savings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  balance NUMERIC(12,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================
-- DEVICES TABLE
-- =====================================
CREATE TABLE IF NOT EXISTS devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_id VARCHAR(128) NOT NULL,
  device_type VARCHAR(32),
  device_name VARCHAR(128),
  ip_address VARCHAR(45),
  user_agent TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_token VARCHAR(128),
  verified_at TIMESTAMPTZ,
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, device_id)
);

gen_random_uuid() requires the pgcrypto extension:

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

Project Structure

credit-jambo-admin/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── adminController.js
│   │   │   └── userController.js
│   │   ├── services/
│   │   │   ├── adminAuthService.js
│   │   │   ├── adminUserService.js
│   │   │   ├── adminNotificationService.js
│   │   │   └── userService.js
│   │   ├── models/
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   └── index.js
│   │   ├── utils/
│   │   │   └── db.js
│   │   ├── middlewares/
│   │   └── server.js
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
├── frontend/
├── docker-compose.yml
└── README.md

FrontEnd
├── public/          # static files
│   └── index.html   # html template
│
├── src/             # project root
│   ├── assets/      # images, icons, etc.
│   ├── components/  # common components - NavBar, footer, sidebar, etc.
│   ├── layouts/     # layout containers
│   ├── views/       # application views
│   ├── App.js
│   ├── ...
│   ├── index.js
│   ├── routes.js    # routes config
│   └── store.js     # template state example
│
└── package.json
```
