# Paraysco Consulting Inc. Corporate Website

A modern, enterprise-grade corporate website for Paraysco Consulting Inc. (PCI), built with Next.js 15+, TypeScript, Tailwind CSS, Shadcn UI, Framer Motion, and Supabase.

## 🚀 Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Shadcn UI
- **Animations**: Framer Motion
- **Internationalization**: next-intl (English & French)
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel / Hostinger Ready

## 📋 Features

### Public Website
- [x] Modern Landing Page with Hero Section
- [x] Statistics Section
- [x] About Section with Vision & Mission
- [x] Services Section
- [x] Founder's Speech Section
- [x] Subsidiary Companies Section
- [x] Testimonials Section
- [x] FAQs Section
- [x] Newsletter Subscription
- [x] Contact Form
- [x] Properties Listing with Filters
- [x] Blog Section
- [x] Multi-language Support (English/French)
- [x] Dark/Light Theme Toggle
- [x] SEO Optimization (Schema.org, OpenGraph, etc.)
- [x] Accessibility (WCAG AA Compliant)
- [x] Responsive Design

### Admin Dashboard
- [x] Dashboard Analytics
- [x] Properties Management (CRUD)
- [x] Blog Management (CRUD)
- [x] Services Management
- [x] Team Members Management
- [x] Consultants Management
- [x] Subcompanies Management
- [x] Testimonials Management
- [x] FAQs Management
- [x] Careers Management
- [x] Contact Messages Management
- [x] Newsletter Subscribers
- [x] Media Library
- [x] Site Settings
- [x] Audit Logs

### Security Features
- [x] CSP Headers
- [x] XSS Protection
- [x] CSRF Protection
- [x] SQL Injection Protection (via Supabase RLS)
- [x] Rate Limiting
- [x] Input Validation (Zod)
- [x] Server-side Authentication
- [x] Supabase Row Level Security (RLS)
- [x] Secure Cookies
- [x] Helmet Headers
- [x] File Upload Validation
- [x] Password Hashing
- [x] Brute Force Protection

## 📁 Project Structure

```
paraysco/
├── src/
│   ├── app/
│   │   ├── [locale]/              # Locale-based routing
│   │   │   ├── (auth)/           # Authentication pages
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   └── forgot-password/
│   │   │   ├── page.tsx          # Home page
│   │   │   ├── about/
│   │   │   ├── services/
│   │   │   ├── properties/
│   │   │   ├── blog/
│   │   │   └── contact/
│   │   └── (admin)/              # Admin dashboard
│   │       └── admin/
│   │           ├── page.tsx      # Dashboard
│   │           ├── properties/
│   │           ├── blog/
│   │           ├── services/
│   │           ├── team/
│   │           ├── consultants/
│   │           ├── subcompanies/
│   │           ├── testimonials/
│   │           ├── faqs/
│   │           ├── careers/
│   │           ├── contacts/
│   │           ├── newsletter/
│   │           ├── media/
│   │           ├── settings/
│   │           └── audit/
│   ├── components/
│   │   ├── ui/                   # Shadcn UI components
│   │   ├── layout/               # Header, Footer
│   │   └── home/                 # Home page sections
│   ├── lib/
│   │   ├── supabase/             # Supabase clients
│   │   └── utils.ts              # Utility functions
│   ├── types/                    # TypeScript types
│   ├── hooks/                    # Custom hooks
│   ├── actions/                  # Server actions
│   ├── i18n.ts                   # i18n configuration
│   └── middleware.ts             # Security middleware
├── supabase/
│   └── schema.sql                # Database schema
├── public/                       # Static files
├── tailwind.config.ts
├── next.config.js
└── package.json
```

## 🛠️ Installation

1. Clone the repository:
```bash
git clone https://github.com/your-org/paraysco.git
cd paraysco
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env.local
```

4. Set up Supabase:
   - Create a new Supabase project
   - Run the SQL schema from `supabase/schema.sql`
   - Update `.env.local` with your Supabase credentials

5. Run the development server:
```bash
npm run dev
```

## 🔐 Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# AWS SES (Email Verification)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_SES_FROM_EMAIL=noreply@paraysco.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
AUTH_SECRET=your_auth_secret_min_32_characters
```

## 🔒 Security Configuration

The application implements multiple security layers:

### Headers (middleware.ts)
- Content-Security-Policy
- Strict-Transport-Security
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

### Database (Supabase RLS)
- Row Level Security on all tables
- Policy-based access control
- Role-based permissions

### Application
- Zod validation on all forms
- Server-side authentication
- Secure session management
- Rate limiting
- Input sanitization

## 🌐 SEO Configuration

The application includes comprehensive SEO optimization:

- Dynamic Metadata API
- JSON-LD Schema.org markup
- Open Graph meta tags
- Twitter Card meta tags
- Canonical URLs
- XML Sitemap generation
- Robots.txt
- Structured data for:
  - Organization
  - Local Business
  - Service
  - FAQ
  - Breadcrumb

## 📊 Database Schema

See `supabase/schema.sql` for the complete database schema including:

- Users & Admin tables
- Properties & Property Images
- Blog Posts & Categories
- Consultants & Team Members
- Services & Subcompanies
- Testimonials, FAQs, Careers
- Contact Messages & Newsletter
- Media Library
- Audit & Activity Logs

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Hostinger

1. Build the project: `npm run build`
2. Upload the `.next` folder and required files
3. Configure environment variables
4. Set up Node.js application

## 📝 License

Private - All rights reserved by Paraysco Consulting Inc.

## 👥 Company Information

**Paraysco Consulting Inc. (PCI)**
- Location: Bota Middle Farms, Limbe, South West Region, Cameroon
- Phone: +237 676 914 581
- Email: paraysco@gmail.com
- Registration: RC.BDA.2012B.271

---

Built with ❤️ for Paraysco Consulting Inc.
