# DocNow Telehealth Sales CRM

A full-stack staff authentication and lead management CRM built with **Next.js (App Router)**, **Prisma**, **PostgreSQL**, **bcrypt**, and **HTTP-only JWT session cookies**.

## Completed Features

### Task 1: Secure Staff Authentication
- **Staff Registration (`/register`)**: Validates email and password, hashes passwords with `bcrypt`, and stores staff accounts in PostgreSQL.
- **Staff Login (`/login`)**: Authenticates credentials and sets an HTTP-only JWT session cookie (`staff_session`).
- **Route Protection (`middleware.ts`)**: Redirects unauthenticated visitors from `/dashboard` and `/leads` to `/login`.

### Task 2: Leads & Contacts CRUD API and UI
- **Leads API (`/api/leads` & `/api/leads/[id]`)**: Supports paginated listing (`GET`), validated lead creation (`POST`), updates (`PUT`), and deletion (`DELETE`) with server-side session verification (`401`), ownership checks (`403`), input validation (`400`), and not-found handling (`404`).
- **Leads Management UI (`/leads`)**: Displays a paginated and searchable leads directory connected to PostgreSQL, alongside Create, Edit, and Delete forms.

## Setup Instructions
1. Install dependencies: `npm install`
2. Configure `.env` with `DATABASE_URL` and `JWT_SECRET`
3. Run database migrations: `npx prisma migrate dev`
4. Start development server: `npm run dev`
