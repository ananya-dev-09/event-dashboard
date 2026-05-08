# Eventos (event-dashboard)

A Next.js 16 App Router implementation for a B2B2C platform combining:
- Social feed engagement
- Organization and event management
- Quizzes and virtual meeting workflows

## Tech Stack
- Next.js 16.2.1 (App Router + API Routes)
- React 19.2.4 + TypeScript 5.7.3
- Tailwind CSS 4.2.0
- NextAuth.js 4.24.13 (JWT sessions)
- MongoDB + Mongoose

## Getting Started
1. Install dependencies:
   ```bash
   pnpm install
   ```
2. Configure environment variables in `.env.local`:
   - `MONGODB_URI`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`
   - `JITSI_BASE_URL` (optional)
3. Run development server:
   ```bash
   pnpm dev
   ```

## Scripts
- `pnpm dev`
- `pnpm lint`
- `pnpm build`
- `pnpm start`

## Implemented Backend Setup
- MongoDB models: User, Organization, Event, Post, Quiz + supporting collections
- NextAuth credentials auth with JWT role propagation
- Route groups and pages for public/auth/dashboard
- API routes for auth, users, organizations, posts, uploads, events, quizzes, meetings
- Middleware skeleton for route protection
