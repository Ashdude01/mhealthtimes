# 🚀 Quick Setup Guide

## Prerequisites
- Node.js 18+ installed
- Git installed
- Accounts for the following services (free tiers available):
  - [Supabase](https://supabase.com) - Database
  - [Stripe](https://stripe.com) - Payment processing
  - [Cloudinary](https://cloudinary.com) - Image upload
  - [SendGrid](https://sendgrid.com) - Email notifications

## Step 1: Clone and Install
```bash
git clone https://github.com/Ashdude01/mhealthtimes.git
cd mhealthtimes
npm install
```

## Step 2: Environment Setup
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name_here
CLOUDINARY_API_KEY=your_cloudinary_api_key_here
CLOUDINARY_API_SECRET=your_cloudinary_api_secret_here

# SendGrid Configuration
SENDGRID_API_KEY=your_sendgrid_api_key_here
SENDGRID_FROM_EMAIL=your_verified_sender_email_here

# Application Configuration
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Step 3: Database Setup

### Create Supabase Tables
Run these SQL commands in your Supabase SQL editor:

```sql
-- Articles Table
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  author_name TEXT NOT NULL,
  agency_contact TEXT NOT NULL,
  kol_name TEXT NOT NULL,
  kol_credentials TEXT NOT NULL,
  body TEXT NOT NULL,
  therapeutic_area TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  article_type TEXT NOT NULL,
  image_url TEXT,
  interview_package TEXT DEFAULT 'basic',
  payment_status TEXT DEFAULT 'pending',
  status TEXT DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Interviews Table
CREATE TABLE interviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID REFERENCES articles(id),
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### If you have an existing articles table without the new columns:
If you already have an articles table but it's missing the `interview_package` and `payment_status` columns, run this additional SQL:

```sql
-- Add missing columns to existing articles table
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS interview_package TEXT DEFAULT 'basic',
ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';

-- Update existing records to have default values
UPDATE articles 
SET interview_package = 'basic' 
WHERE interview_package IS NULL;

UPDATE articles 
SET payment_status = 'pending' 
WHERE payment_status IS NULL;
```

## Step 4: Run the Application
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Step 5: Test the Application

### Admin Access
- Go to `/login`
- Username: `admin`
- Password: `password`

### Test Article Submission
1. Go to `/submit-article`
2. Fill out the 4-step form
3. Test the payment flow (use Stripe test cards)

## 🔧 Service Setup Guides

### Supabase Setup
1. Create account at [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings > API to get your URL and keys
4. Run the SQL commands above in the SQL editor

### Stripe Setup
1. Create account at [stripe.com](https://stripe.com)
2. Get your API keys from Dashboard > Developers > API keys
3. Use test keys for development

### Cloudinary Setup
1. Create account at [cloudinary.com](https://cloudinary.com)
2. Get your cloud name, API key, and secret from Dashboard

### SendGrid Setup
1. Create account at [sendgrid.com](https://sendgrid.com)
2. Get your API key from Settings > API keys
3. Verify your sender email address

## 🚨 Troubleshooting

### "Failed to submit article" Error
- Check that all environment variables are set correctly
- Verify Supabase connection and table creation
- Check browser console for detailed error messages
- Ensure the articles table has `interview_package` and `payment_status` columns

### Database Schema Errors
- If you see "Could not find the 'interview_package' column" error, run the database update SQL commands above
- Make sure all required columns exist in your Supabase articles table

### SendGrid API Key Errors
- Ensure your SendGrid API key starts with "SG."
- Verify the API key is correct and has proper permissions
- If email functionality is not critical, the app will continue to work without it

### Payment Issues
- Ensure Stripe keys are correct
- Use test mode for development
- Check Stripe dashboard for webhook events

### Image Upload Issues
- Verify Cloudinary credentials
- Check file size limits
- Ensure proper CORS configuration

## 📞 Support
If you encounter issues:
1. Check the browser console for errors
2. Verify all environment variables are set
3. Ensure all services are properly configured
4. Create an issue in the GitHub repository

## 🎉 Success!
Once everything is set up, you should have:
- ✅ Working article submission form
- ✅ Payment processing with Stripe
- ✅ Image upload with Cloudinary
- ✅ Email notifications with SendGrid
- ✅ Protected admin panel
- ✅ Database storage with Supabase
