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
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name_here
   CLOUDINARY_API_KEY=your_cloudinary_api_key_here
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret_here
   CLOUDINARY_NOTIFICATION_URL=your_webhook_url_here

   # SendGrid Configuration
   SENDGRID_API_KEY=your_sendgrid_api_key_here
   SENDGRID_FROM_EMAIL=your_verified_sender_email_here

   # Application Configuration
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Set up the database**
   Run the following SQL in your Supabase SQL editor:
   ```sql
   -- Create articles table
   CREATE TABLE IF NOT EXISTS articles (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     title TEXT NOT NULL,
     author TEXT NOT NULL,
     email TEXT NOT NULL,
     kol_name TEXT,
     kol_credentials TEXT,
     content TEXT NOT NULL,
     image_url TEXT,
     classification TEXT,
     payment_status TEXT DEFAULT 'pending',
     interview_package TEXT DEFAULT 'basic',
     status TEXT DEFAULT 'pending',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create interviews table
   CREATE TABLE IF NOT EXISTS interviews (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     article_id UUID REFERENCES articles(id),
     scheduled_date DATE,
     scheduled_time TIME,
     package_name TEXT,
     payment_status TEXT DEFAULT 'pending',
     status TEXT DEFAULT 'pending',
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );
   ```

5. **Set up Stripe Webhooks**
   
   **For Development:**
   - Install Stripe CLI: https://stripe.com/docs/stripe-cli
   - Run: `stripe listen --forward-to localhost:3000/api/webhook/stripe`
   - Copy the webhook signing secret and add it to your `.env.local` as `STRIPE_WEBHOOK_SECRET`

   **For Production:**
   - Go to your Stripe Dashboard → Developers → Webhooks
   - Add endpoint: `https://your-domain.com/api/webhook/stripe`
   - Select events: `checkout.session.completed`, `payment_intent.succeeded`, `payment_intent.payment_failed`
   - Copy the webhook signing secret and add it to your production environment variables

6. **Run the application**
   ```bash
   npm run dev
   ```

7. **Test the application**
   ```bash
   npm test
   ```

## Features

### ✅ **Payment Status Updates**
- Automatic payment status updates via Stripe webhooks
- Real-time payment verification on thank you page
- Database synchronization for payment status

### ✅ **Image Upload**
- Cloudinary integration with automatic image optimization
- File type validation (JPEG, PNG, WebP)
- File size limits (max 10MB)
- Multiple image sizes for responsive design
- Graceful error handling for missing configuration

### ✅ **Production Ready**
- Environment variable validation
- Comprehensive error handling
- Webhook signature verification
- Secure payment processing
- Responsive design

## Troubleshooting

### Payment Issues
- **Webhook not working**: Ensure `STRIPE_WEBHOOK_SECRET` is set correctly
- **Payment status not updating**: Check webhook endpoint is accessible and Stripe events are being received
- **Invalid signature**: Verify webhook secret matches Stripe dashboard

### Image Upload Issues
- **Upload failing**: Check Cloudinary credentials in environment variables
- **File too large**: Ensure image is under 10MB
- **Invalid file type**: Only JPEG, PNG, and WebP are supported

### Environment Variables
- **Missing variables**: Copy from `env.example` and fill in your values
- **Base URL issues**: Set `NEXT_PUBLIC_BASE_URL` to your domain (e.g., `https://yourdomain.com`)
- **Stripe keys**: Ensure you're using the correct keys for your environment (test/live)

### Database Issues
- **Column not found**: Run the database setup SQL in your Supabase dashboard
- **Connection errors**: Verify Supabase URL and keys are correct

## Deployment

### Vercel
1. Connect your GitHub repository to Vercel
2. Add all environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- Ensure all environment variables are set
- Set `NEXT_PUBLIC_BASE_URL` to your production domain
- Configure Stripe webhook endpoint to your production URL

## Support

If you encounter any issues, check the console logs for detailed error messages and refer to the troubleshooting section above.
