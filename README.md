# TaskFlow

A full-stack todo app with real user accounts, per-user data, a free tier with a task limit, an activity tracker, and an admin dashboard. Built with Next.js, Prisma, PostgreSQL and Clerk.

## Features

- **Custom authentication:** sign up with an email code, sign in, and password reset, all built with Clerk hooks instead of the prebuilt components.
- **Tasks:** create, complete, reopen and delete tasks. Each user sees only their own tasks.
- **Free tier:** free users can create up to 3 tasks. Older tasks beyond the limit are hidden, not deleted, and a subscribed user sees everything.
- **Activity tracker:** counts of tasks completed today, this week, this month and this year, using the user's own calendar and time zone.
- **Admin dashboard:** admins can list all users with their emails and task counts, and switch a user's subscription on or off.
- **Search and filters:** search by title, and filter by all, pending or completed.

## Tech stack

Next.js (App Router), React, TypeScript, Tailwind CSS, Prisma, PostgreSQL (Neon), Clerk, Axios.

## How it works

- **Ownership is decided on the server.** Every task route reads the user id from Clerk's `auth()`, never from the request, and filters or checks ownership in the database query. Another user's task answers 404.
- **The free limit is enforced in the API.** The create route counts the user's tasks and refuses with 403 past the limit, and the list route cuts the result for free users. The browser cannot bypass it.
- **Admin checks live in the API.** The admin routes load the caller's role from the database and answer 401 or 403 before doing anything. The admin page only hides the table for people who are not allowed, and the API is the real protection.
- **The tracker stores a `completedAt` timestamp**, set by the server when a task is marked done and cleared when it is reopened.

## Getting started

1. Clone the repository and run `npm install`.
2. Create a `.env` file in the project root with these variables (values are your own):
   - `DATABASE_URL`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
3. Run `npx prisma migrate dev` to create the tables, then `npx prisma generate` to build the client.
4. Run `npm run dev` and open `http://localhost:3000`.
5. To try the admin page, set your user's `role` to `ADMIN` in the database (for example with `npx prisma studio`).

## Not built yet

Payments. A subscription is currently switched on or off by an admin.