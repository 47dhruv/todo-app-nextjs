# TaskFlow

A full-stack todo app with real user accounts, per-user data, a free tier, a yearly subscription paid through Razorpay (test mode), an activity tracker, and an admin dashboard. Built with Next.js, Prisma, PostgreSQL, Clerk and Razorpay.

## Features

- **Custom authentication:** sign up with an email code, sign in with a device verification step, and reset a forgotten password. All built with Clerk hooks instead of the prebuilt components.
- **Tasks:** create, complete, reopen and delete tasks. Each user sees only their own tasks.
- **Free tier:** free users can create up to 3 tasks. Older tasks beyond the limit are hidden, not deleted, and come back when the user subscribes.
- **Yearly subscription:** pay Rs. 100 per year with Razorpay. A subscription has an end date and expires on its own.
- **Activity tracker:** counts of tasks completed today, this week, this month and this year, using the user's own calendar and time zone.
- **Admin dashboard:** admins can list users with their emails and task counts, and switch a user's subscription on or off.
- **Search and filters:** search by title and filter by all, pending or completed.

## Tech stack

Next.js (App Router), React, TypeScript, Tailwind CSS, Prisma, PostgreSQL (Neon), Clerk, Razorpay, Axios.

## How it works

- **Ownership is decided on the server.** Every task route reads the user id from Clerk's `auth()`, never from the request, and filters by owner in the database query. Someone else's task answers 404.
- **The free limit is enforced in the API.** The create route counts the user's tasks and answers 403 past the limit, and the list route cuts the result for free users, so the browser cannot bypass it.
- **A subscription is a date, not a flag.** A user is subscribed while `subscribedUntil` is in the future, and one helper function computes this everywhere, so the stored data can never go out of date.
- **Payments are verified on the server.**
  1. The server creates a Razorpay order with a price taken from a server constant, never from the browser, and saves a payment record.
  2. The browser opens Razorpay's checkout and receives a payment id, an order id and a signature.
  3. The browser sends those three values to the server. The server recomputes the signature with the secret key, compares it safely, finds its own payment record for that order and that user, and only then extends the subscription, in one database transaction.
  4. A verified order can only be fulfilled once, so a repeated request does not add a second year.
- **Admin checks live in the API.** The admin routes load the caller's role from the database and answer 401 or 403 before doing anything. The admin page only hides the table for people who are not allowed, and the API is the real protection.
- **The tracker uses a `completedAt` timestamp**, set by the server when a task is marked done and cleared when it is reopened.

## Getting started

1. Clone the repository and run `npm install`.
2. Create a `.env` file in the project root with these variables (values are your own):
   - `DATABASE_URL`
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `NEXT_PUBLIC_RAZORPAY_KEY_ID`
   - `RAZORPAY_KEY_SECRET`
3. Run `npx prisma migrate dev` to create the tables, then `npx prisma generate` to build the client.
4. Run `npm run dev` and open `http://localhost:3000`.
5. To try the admin page, set your user's `role` to `ADMIN` in the database, for example with `npx prisma studio`.
6. Use Razorpay **Test Mode** keys. Razorpay's docs list test cards and test UPI addresses for successful and failed payments.

## Not built yet

- Razorpay webhooks. A payment is confirmed only when the browser reports it back, so a user who closes the tab right after paying would need support to fix the record.
- Live payments. The app has only been run in Razorpay's test mode.