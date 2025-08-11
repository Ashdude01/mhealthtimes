# MHealthTimes Setup Guide

## Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account
- Cloudinary account
- SendGrid account

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Ashdude01/mhealthtimes.git
   cd mhealthtimes
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add the following variables:
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

   **Important**: For production deployment, set `NEXT_PUBLIC_BASE_URL` to your actual domain (e.g., `https://yourdomain.com`)

4. **Set up Supabase Database**
   
   Create the following tables in your Supabase database:

   **Articles Table:**
   ```sql
   CREATE TABLE articles (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title TEXT NOT NULL,
     author_name TEXT NOT NULL,
     agency_contact TEXT NOT NULL,
     kol_name TEXT NOT NULL,
     kol_credentials TEXT,
     body TEXT NOT NULL,
     therapeutic_area TEXT,
     target_audience TEXT,
     article_type TEXT,
     image_url TEXT,
     interview_package TEXT DEFAULT 'basic',
     payment_status TEXT DEFAULT 'pending',
     status TEXT DEFAULT 'pending_review',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

   **Interviews Table:**
   ```sql
   CREATE TABLE interviews (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
     scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
     duration INTEGER NOT NULL,
     payment_status TEXT DEFAULT 'pending',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

   **If you have an existing articles table**, run this SQL to add the missing columns:
   ```sql
   -- Add interview_package column if it doesn't exist
   ALTER TABLE articles ADD COLUMN IF NOT EXISTS interview_package TEXT DEFAULT 'basic';
   
   -- Add payment_status column if it doesn't exist
   ALTER TABLE articles ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
   
   -- Update existing records to have default values
   UPDATE articles SET interview_package = 'basic' WHERE interview_package IS NULL;
   UPDATE articles SET payment_status = 'pending' WHERE payment_status IS NULL;
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## Features

- **Article Submission**: Multi-step form for submitting articles with KoL information
- **Image Upload**: Cloudinary integration for image uploads
- **Interview Booking**: Integrated interview scheduling with payment packages
- **Payment Processing**: Stripe integration for secure payments
- **Admin Panel**: Protected admin interface for managing articles and interviews
- **Email Notifications**: SendGrid integration for email confirmations

## Admin Access

- **URL**: `/admin`
- **Username**: `admin`
- **Password**: `password`

## Troubleshooting

### Common Issues

1. **Build Errors on Vercel**
   - Ensure `autoprefixer` is installed: `npm install autoprefixer --save-dev`
   - Check that all environment variables are set in Vercel dashboard

2. **Database Schema Errors**
   - Run the SQL commands above to add missing columns
   - Check that your Supabase service role key has proper permissions

3. **SendGrid API Key Errors**
   - Ensure your SendGrid API key starts with "SG."
   - Verify the sender email is verified in SendGrid

4. **Payment URL Errors**
   - Set `NEXT_PUBLIC_BASE_URL` to your actual domain in production
   - For local development, use `http://localhost:3000`

5. **JSON Parsing Errors**
   - Check that all form data is properly formatted
   - Ensure Content-Type headers are set to `application/json`

### Environment Variables Checklist

Before running the application, ensure you have:

- [ ] Supabase URL and keys
- [ ] Stripe secret and publishable keys
- [ ] Cloudinary credentials
- [ ] SendGrid API key and verified sender email
- [ ] `NEXT_PUBLIC_BASE_URL` set correctly for your environment

## Deployment

1. **Vercel Deployment**
   - Connect your GitHub repository to Vercel
   - Add all environment variables in Vercel dashboard
   - Deploy

2. **Other Platforms**
   - Ensure all environment variables are set
   - Set `NEXT_PUBLIC_BASE_URL` to your production domain
   - Run `npm run build` to test the build process

## Support

If you encounter any issues, check the console logs for detailed error messages and refer to the troubleshooting section above.
