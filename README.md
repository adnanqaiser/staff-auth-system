# Staff Authentication System

A secure staff registration and login system built with **Next.js (App Router)**, **Prisma**, **PostgreSQL**, **bcrypt**, and **HTTP-only session cookies**.

## Features

- **Staff Registration (`/register`)**: Validates input, checks for duplicate emails, hashes passwords with `bcrypt`, and stores staff accounts in PostgreSQL.
- **Staff Login (`/login`)**: Verifies credentials against hashed passwords and issues an HTTP-only JWT session cookie (`staff_session`).
- **Protected Dashboard (`/dashboard`)**: Middleware and server-side session verification prevent unauthenticated access and redirect to `/login`.
- **Logout (`/api/logout`)**: Clears the HTTP-only session cookie securely.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/staff_auth_db?schema=public"
   JWT_SECRET="your-secret-key"
   ```
3. Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   "# staff-auth-system"
