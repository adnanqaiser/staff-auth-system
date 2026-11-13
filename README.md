# DocNow Telehealth Sales CRM

A full-stack staff authentication, lead management, Kanban pipeline, reminders, and email templates CRM built with **Next.js (App Router)**, **TypeScript**, **Prisma**, **PostgreSQL**, **bcrypt**, and **HTTP-only JWT session cookies**.

## Features Implemented
- **Task 1 — Secure Staff Authentication (`/register`, `/login`, `/dashboard`)**: `bcrypt` password hashing, HTTP-only JWT cookie (`staff_session`), and Edge-safe `middleware.ts` route protection.
- **Task 2 — Leads & Contacts CRUD (`/leads`, `/api/leads`, `/api/leads/[id]`)**: Paginated directory, search filtering, server-side input validation, and user-ownership checks.
- **Task 3 — Kanban Pipeline Board, Reminders & Templates (`/pipeline`, `/reminders`, `/templates`)**:
  - Drag-and-drop Kanban board with 4 validated stages (`New`, `Contacted`, `Qualified`, `Closed`).
  - Follow-up reminders scheduler (`/reminders`) validating future date/time in PostgreSQL.
  - Personalized telehealth outreach email templates (`/templates`).

## Local Setup Instructions
1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com
   cd staff-auth-system
   npm install
   ```
2. Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/staff_auth_db?schema=public"
   JWT_SECRET="your-strong-random-secret-key"
   ```
3. Run Prisma migrations and start the development server:
   ```bash
   npx prisma migrate dev
   npm run dev
   ```

## Vercel & Cloud PostgreSQL Deployment Steps
1. Create a free cloud PostgreSQL database (on **Supabase** or **Neon**) and copy its `DATABASE_URL` connection string.
2. Push this repository to GitHub (`main` branch).
3. Import the GitHub repository into **Vercel** (`://vercel.com`).
4. Add `DATABASE_URL` and `JWT_SECRET` in Vercel **Project Settings -> Environment Variables**.
5. Set the Build Command to `npx prisma migrate deploy && npm run build` and click **Deploy**.
