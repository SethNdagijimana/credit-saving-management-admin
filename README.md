# Credit Jambo - Admin Application

Admin interface for managing Credit Jambo users and verifying device IDs.

## Features

- Admin authentication
- View all users
- View unverified users
- Verify/Unverify user devices
- Delete users
- User statistics dashboard

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL (shared with client app)
- **Authentication:** JWT
- **Security:** Helmet, Rate Limiting, bcrypt

## Setup Instructions

### Prerequisites

- Docker & Docker Compose
- Node.js (for generating secrets)
- Running Credit Jambo Client app (for shared database)

### Installation

1. Clone the repository

```bash
   git clone https://github.com/yourusername/credit-jambo-admin.git
   cd credit-jambo-admin
```

2. Set up environment variables

```bash
   cd backend
   cp .env.example .env
```

3. Generate a secure JWT secret

```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

4. Edit `backend/.env` and update:

   - Replace `your_admin_jwt_secret_here` with the generated secret
   - Ensure `DB_URL` points to the same database as the client app

5. **Important:** Make sure the Credit Jambo Client app is running (database must be available)

6. Start the admin application

```bash
   cd ..
   docker compose up --build
```

7. The Admin API will be available at `http://localhost:5001`

## API Endpoints

### Admin Authentication

- `POST /api/admin/login` - Admin login

### User Management

- `GET /api/users` - Get all users
- `GET /api/users/unverified` - Get unverified users
- `PATCH /api/users/:userId/verify` - Verify user device
- `PATCH /api/users/:userId/unverify` - Unverify user device
- `DELETE /api/users/:userId` - Delete user

## Database Setup

This app connects to the same database as the Credit Jambo Client app.

### Create Admin Table

```sql
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Create First Admin User

```sql
-- Password: Admin123! (hashed with bcrypt)
INSERT INTO admins (name, email, password)
VALUES ('Admin User', 'admin@creditjambo.com', '$2a$10$YourHashedPasswordHere');
```

Or use the registration script (to be created).

## Environment Variables

| Variable   | Description                            | Example                               |
| ---------- | -------------------------------------- | ------------------------------------- |
| PORT       | Admin server port                      | 5001                                  |
| JWT_SECRET | Secret for JWT tokens                  | Use crypto.randomBytes(64)            |
| DB_URL     | PostgreSQL connection (same as client) | postgres://user:pass@host:5432/dbname |

## Project Structure

```
credit-jambo-admin/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── adminController.js
│   │   │   └── userController.js
│   │   ├── models/
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   └── index.js
│   │   ├── utils/
│   │   │   └── db.js
│   │   └── server.js
│   ├── .dockerignore
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── frontend/ (to be implemented)
├── .gitignore
├── docker-compose.yml
└── README.md
```

## License

ISC
