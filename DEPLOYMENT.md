# Deployment Guide

## 🚀 Quick Deployment Steps

### 1. Database Setup (Neon)
✅ **Already Done** - Your Neon database is configured in `.env.local`

### 2. Cloudinary Setup
✅ **Already Done** - Your Cloudinary credentials are in `.env.local`

### 3. Email Configuration (for NextAuth)
You'll need to configure email settings for authentication:

**Gmail Setup:**
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: Google Account → Security → App passwords
3. Update `.env.local` with your email settings:

```env
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-16-character-app-password"
EMAIL_FROM="noreply@yourdomain.com"
```

### 4. Deploy to Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables from your `.env.local`
   - Deploy!

3. **Environment Variables for Vercel:**
   ```env
   DATABASE_URL="your-neon-connection-string"
   NEXTAUTH_URL="https://your-domain.vercel.app"
   NEXTAUTH_SECRET="your-production-secret-key"
   EMAIL_SERVER_HOST="smtp.gmail.com"
   EMAIL_SERVER_PORT="587"
   EMAIL_SERVER_USER="your-email@gmail.com"
   EMAIL_SERVER_PASSWORD="your-app-password"
   EMAIL_FROM="noreply@yourdomain.com"
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   ```

### 5. Post-Deployment Setup

1. **Create Admin User:**
   - Visit your deployed site
   - Sign up with your email
   - Check your email and click the sign-in link
   - Go to your Neon database console
   - Update your user role to 'ADMIN':
     ```sql
     UPDATE users SET role = 'ADMIN' WHERE email = 'your-email@gmail.com';
     ```

2. **Configure Admin Settings:**
   - Login to `/admin`
   - Go to Settings
   - Update WhatsApp number
   - Configure banner messages

3. **Add Content:**
   - Upload gallery images
   - Set up pricing rules
   - Add frame options
   - Create offers and discounts

## 🔧 Local Development

Your local setup is complete! The server is running at `http://localhost:3000`

**Available Routes:**
- `/` - Homepage
- `/gallery` - Portfolio gallery
- `/pricing` - Pricing page
- `/frames` - Frame options
- `/how-it-works` - Process explanation
- `/order` - Order form
- `/contact` - Contact page
- `/admin` - Admin panel (requires admin role)

**Admin Access:**
1. Sign up with email authentication
2. Update your role to 'ADMIN' in the database
3. Access admin panel at `/admin`

## 📱 WhatsApp Integration

The WhatsApp number is configured in Admin Settings. Update it to your business WhatsApp number:

**Format:** Country code + number (e.g., 919876543210 for India)

## 🎨 Customization

**Colors & Branding:**
- Update `tailwind.config.ts` for color scheme
- Modify logo and branding in header component
- Customize email templates in NextAuth configuration

**Content:**
- All content is managed through the admin panel
- No hardcoded data - everything is dynamic
- Easy to update pricing, offers, and gallery

## 🔒 Security

- Role-based access control
- Server-side authentication
- Protected admin routes
- Secure file uploads to Cloudinary
- Environment variable protection

## 📊 Features Included

✅ Modern GSAP animations
✅ Dynamic pricing with offers
✅ Image upload to Cloudinary
✅ WhatsApp checkout integration
✅ Complete admin panel
✅ Email authentication
✅ Responsive design
✅ Dark/light mode
✅ SEO optimized

Your portrait studio website is ready for production! 🎉