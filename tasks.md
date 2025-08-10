# Project: Article Submission & KoL Interview Booking Application
**Tech Stack**:  
- **Frontend**: Next.js 14 (App Router), Tailwind CSS, React Hook Form  
- **Backend**: Node.js + Express OR Next.js API Routes  
- **Database**: PostgreSQL (Supabase) OR Firebase Firestore  
- **File Storage**: Cloudinary (for image uploads)  
- **Payments**: Stripe API  
- **Scheduling**: Google Calendar API or Calendly API  
- **Hosting**: Vercel

---

## PHASE 1 – Project Setup
1. Initialize a new Next.js 14 project with TypeScript:
   ```bash
   npx create-next-app@latest mhealthtimes --typescript --app
   ```
2. Install dependencies:
   ```bash
   npm install tailwindcss postcss autoprefixer @headlessui/react @heroicons/react react-hook-form axios date-fns
   npm install stripe @stripe/stripe-js react-stripe-checkout
   npm install @supabase/supabase-js
   npm install multer cloudinary
   ```
3. Configure Tailwind CSS:
   ```bash
   npx tailwindcss init -p
   ```
4. Set up `.env.local` for API keys:
   - SUPABASE_URL, SUPABASE_ANON_KEY
   - STRIPE_SECRET_KEY
   - GOOGLE_CALENDAR_API_KEY / CALENDLY_TOKEN
   - CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET

---

## PHASE 2 – Database & Models
If using Supabase:
1. Create tables:
   - `articles` → id, title, author_name, agency_contact, kol_name, kol_credentials, body, therapeutic_area, target_audience, article_type, image_url, status, created_at
   - `interviews` → id, article_id, kol_id, scheduled_time, duration, payment_status
   - `users` → id, name, email, role (admin/agency)
2. Enable RLS (Row Level Security) for secure data access.

---

## PHASE 3 – UI/UX Setup
1. Create a `layouts/MainLayout.tsx` with a responsive header/footer.
2. Add global styles in `globals.css` and Tailwind typography plugin for article content.
3. Create pages:
   - `/submit-article`
   - `/admin/review`
   - `/booking`
   - `/thank-you`

---

## PHASE 4 – Article Submission Form
**File**: `app/submit-article/page.tsx`
1. Use **React Hook Form** for multi-step form:
   - Step 1: Title, Author Name, Agency Contact, KoL Name, Credentials
   - Step 2: Dropdowns (Therapeutic Area, Target Audience, Article Type)
   - Step 3: Rich Text Editor (e.g., `react-quill`)
   - Step 4: Image Upload (Cloudinary via API route)
   - Step 5: Preview & Submit
2. Validate fields before moving to the next step.
3. On submit, store article in Supabase with `status = pending_review`.

---

## PHASE 5 – Image Upload API
**File**: `app/api/upload/route.ts`
1. Use `multer` for handling uploads.
2. Upload to Cloudinary via `cloudinary.uploader.upload`.
3. Return the uploaded image URL to the frontend.

---

## PHASE 6 – Interview Scheduling
1. Add scheduling prompt after article submission:
   - If “Yes”, redirect to `/booking?articleId=xyz`.
2. **File**: `app/booking/page.tsx`
   - Integrate Google Calendar API or Calendly API to display available slots.
   - Allow user to pick a slot.
   - Store booking in Supabase table `interviews`.

---

## PHASE 7 – Payment Integration
**File**: `app/api/payment/route.ts`
1. Integrate **Stripe Checkout** for secure payments.
2. Create products:
   - 15-min Highlight Interview
   - 30-min Deep Dive
3. On successful payment:
   - Mark `payment_status = paid` in Supabase.
   - Send confirmation email (using SendGrid or Resend API).

---

## PHASE 8 – Admin Panel
**File**: `app/admin/page.tsx`
1. Secure with basic auth or role-based Supabase auth.
2. Features:
   - View submitted articles (status: pending_review, approved, rejected)
   - Approve/Reject articles
   - Manage bookings & payments

---

## PHASE 9 – Notifications
1. Use **Resend API** or **SendGrid** to send:
   - Submission confirmation email
   - Interview booking confirmation
   - Payment receipt
   - Admin review notifications

---

## PHASE 10 – Testing
1. Unit test forms & API routes with Jest.
2. Integration test for:
   - Full article submission flow
   - Payment + booking flow

---

## PHASE 11 – Deployment
1. Push to GitHub.
2. Connect Vercel for automatic deployment.
3. Add env variables in Vercel dashboard.
4. Test production version.

---

## PHASE 12 – Post-Launch
1. Monitor with Vercel Analytics.
2. Set up error tracking via Sentry.
3. Gather feedback from first users.
4. Schedule maintenance & feature upgrades.

---

**Notes for AI (Cursor) Execution**:
- Always generate code in modular form (components in `/components`, API routes in `/app/api`).
- Use TypeScript interfaces for props and DB schemas.
- Prioritize responsive design with Tailwind.
- Follow Next.js 14 App Router conventions.
