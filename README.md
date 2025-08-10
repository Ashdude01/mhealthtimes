# MHealthTimes - Article Submission & KoL Interview Booking Platform

A comprehensive Next.js 14 application for healthcare content submission and Key Opinion Leader (KoL) interview bookings.

## 🚀 Features

### Article Submission
- Multi-step form with React Hook Form
- Image upload with Cloudinary
- Rich text editor for article content
- Form validation and error handling
- Email notifications via SendGrid

### Interview Booking
- Interactive scheduling interface
- Payment processing with Stripe
- 15-minute and 30-minute interview options
- Calendar integration
- Booking confirmation emails

### Admin Panel
- Article review and approval system
- Interview management
- Dashboard with statistics
- Status tracking and updates

### Technical Features
- Next.js 14 with App Router
- TypeScript for type safety
- Tailwind CSS for styling
- Supabase for database
- Responsive design
- Email automation

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Supabase)
- **File Storage**: Cloudinary
- **Payments**: Stripe
- **Email**: SendGrid
- **UI Components**: Headless UI, Heroicons

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- Stripe account
- Cloudinary account
- SendGrid account

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd mhealthtimes
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Set up environment variables
Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key_here
STRIPE_PRICE_15_MIN=your_stripe_price_id_15min_here
STRIPE_PRICE_30_MIN=your_stripe_price_id_30min_here

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

**Important**: You need to set up these services and get the actual values:
- [Supabase](https://supabase.com) - Database
- [Stripe](https://stripe.com) - Payment processing
- [Cloudinary](https://cloudinary.com) - Image upload
- [SendGrid](https://sendgrid.com) - Email notifications

### 4. Set up Supabase Database

Create the following tables in your Supabase database:

#### Articles Table
```sql
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
  status TEXT DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Interviews Table
```sql
CREATE TABLE interviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  article_id UUID REFERENCES articles(id),
  kol_id TEXT NOT NULL,
  scheduled_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL,
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Users Table (Optional)
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'agency' CHECK (role IN ('admin', 'agency')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. Set up Stripe Products

Create two products in your Stripe dashboard:
- 15-Minute Highlight Interview ($150)
- 30-Minute Deep Dive Interview ($250)

Copy the price IDs to your environment variables.

### 6. Run the development server
```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
mhealthtimes/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   │   ├── articles/      # Article management
│   │   ├── interviews/    # Interview management
│   │   ├── payment/       # Stripe payment processing
│   │   └── upload/        # Image upload
│   ├── admin/             # Admin dashboard
│   ├── booking/           # Interview booking
│   ├── submit-article/    # Article submission
│   ├── thank-you/         # Success pages
│   ├── components/        # Reusable components
│   ├── lib/               # Utility libraries
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── public/                # Static assets
├── .env.local             # Environment variables
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json           # Dependencies
```

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Get your project URL and anon key
3. Create the database tables (see above)
4. Enable Row Level Security (RLS) if needed

### Stripe Setup
1. Create a Stripe account
2. Get your secret key from the dashboard
3. Create products for interview types
4. Copy price IDs to environment variables

### Cloudinary Setup
1. Create a Cloudinary account
2. Get your cloud name, API key, and secret
3. Configure upload presets if needed

### SendGrid Setup
1. Create a SendGrid account
2. Get your API key
3. Verify your sender email address

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📧 Email Templates

The application includes pre-built email templates for:
- Article submission confirmation
- Interview booking confirmation
- Payment confirmation

Templates are located in `app/lib/email.ts` and can be customized as needed.

## 🔒 Security

- Environment variables for sensitive data
- Input validation on all forms
- CSRF protection
- Secure file uploads
- Database row-level security (RLS)

## 🧪 Testing

Run tests with:
```bash
npm test
# or
yarn test
```

## 📝 API Documentation

### Articles API
- `GET /api/articles` - Get all articles
- `POST /api/articles` - Submit new article
- `GET /api/articles/[id]` - Get specific article
- `PUT /api/articles/[id]` - Update article

### Interviews API
- `GET /api/interviews` - Get all interviews
- `POST /api/interviews` - Create interview booking
- `PUT /api/interviews` - Update interview status

### Payment API
- `POST /api/payment` - Create Stripe checkout session

### Upload API
- `POST /api/upload` - Upload image to Cloudinary

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@mhealthtimes.com or create an issue in the repository.

## 🔄 Updates

Stay updated with the latest changes by following the repository and checking the changelog.
