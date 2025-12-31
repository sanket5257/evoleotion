# Admin Panel Setup Guide

## Overview
The admin panel is now fully functional with complete CRUD operations for all sections. Here's what's been implemented:

## Features Implemented

### 1. Gallery Management (`/admin/gallery`)
- ✅ Add new gallery images with file upload
- ✅ Edit image details (title, description, style, tags)
- ✅ Delete images (removes from both database and Cloudinary)
- ✅ Toggle active/inactive status
- ✅ Automatic image optimization via Cloudinary

### 2. Pricing Management (`/admin/pricing`)
- ✅ Create pricing rules for different combinations of style, size, and number of faces
- ✅ Edit existing pricing rules
- ✅ Delete pricing rules
- ✅ Toggle active/inactive status
- ✅ Organized display by style with validation for unique combinations

### 3. Frame Management (`/admin/frames`)
- ✅ Add new frame options with image upload
- ✅ Edit frame details (name, description, price)
- ✅ Delete frames (removes from both database and Cloudinary)
- ✅ Toggle active/inactive status
- ✅ Reorder frames (move up/down)
- ✅ Frame statistics display

### 4. Offers & Discounts (`/admin/offers`)
- ✅ Create various offer types (flat discount, percentage, free frame, first order)
- ✅ Set coupon codes with uniqueness validation
- ✅ Configure offer conditions (min order value, applicable styles, date ranges)
- ✅ Edit and delete offers
- ✅ Toggle active/inactive status
- ✅ Priority-based ordering

### 5. Order Management (`/admin/orders`)
- ✅ View all orders with filtering by status and payment status
- ✅ Update order status (Pending → Preview Sent → Revision → Approved → Completed)
- ✅ Update payment status (Pending → Paid → Refunded)
- ✅ Add and edit admin notes
- ✅ View customer images and order details
- ✅ WhatsApp integration for customer communication

### 6. Settings (`/admin/settings`)
- ✅ Configure WhatsApp business number
- ✅ Manage promotional banner (title, text, active/inactive)
- ✅ Test WhatsApp integration
- ✅ System status monitoring
- ✅ Data export options (placeholder)

### 7. Dashboard (`/admin`)
- ✅ Real-time statistics (total orders, pending orders, revenue, active offers)
- ✅ Recent orders display
- ✅ Revenue chart visualization
- ✅ Animated statistics cards

## API Routes Created

All admin functionality is backed by secure API routes that:
- Require admin authentication
- Include proper error handling
- Support file uploads via Cloudinary
- Maintain data integrity with validation

### Gallery APIs
- `GET/POST /api/admin/gallery` - List/Create images
- `PUT/DELETE /api/admin/gallery/[id]` - Update/Delete image
- `PATCH /api/admin/gallery/[id]/toggle` - Toggle active status

### Pricing APIs
- `GET/POST /api/admin/pricing` - List/Create pricing rules
- `PUT/DELETE /api/admin/pricing/[id]` - Update/Delete pricing
- `PATCH /api/admin/pricing/[id]/toggle` - Toggle active status

### Frame APIs
- `GET/POST /api/admin/frames` - List/Create frames
- `PUT/DELETE /api/admin/frames/[id]` - Update/Delete frame
- `PATCH /api/admin/frames/[id]/toggle` - Toggle active status
- `PATCH /api/admin/frames/[id]/reorder` - Reorder frames

### Offer APIs
- `GET/POST /api/admin/offers` - List/Create offers
- `PUT/DELETE /api/admin/offers/[id]` - Update/Delete offer
- `PATCH /api/admin/offers/[id]/toggle` - Toggle active status

### Order APIs
- `GET /api/admin/orders` - List all orders
- `PATCH /api/admin/orders/[id]/status` - Update order status
- `PATCH /api/admin/orders/[id]/payment` - Update payment status
- `PATCH /api/admin/orders/[id]/notes` - Update admin notes

### Settings APIs
- `GET/POST /api/admin/settings` - Get/Update settings

## Security Features

- All API routes require admin authentication
- File uploads are validated and processed through Cloudinary
- Input validation and sanitization
- Proper error handling and user feedback
- CSRF protection via NextAuth

## Environment Variables Required

Make sure these are set in your `.env` file:

```env
# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Database
DATABASE_URL="your-database-url"

# NextAuth
NEXTAUTH_URL="your-app-url"
NEXTAUTH_SECRET="your-secret-key"
```

## Usage Instructions

1. **Access Admin Panel**: Navigate to `/admin` (requires admin role)
2. **Gallery**: Upload and manage portfolio images
3. **Pricing**: Set up pricing rules for different combinations
4. **Frames**: Add frame options with pricing
5. **Offers**: Create promotional offers and discount codes
6. **Orders**: Track and manage customer orders
7. **Settings**: Configure WhatsApp and promotional banners

## Technical Notes

- All forms include proper validation and error handling
- File uploads are automatically optimized via Cloudinary
- Real-time updates with page refresh (can be enhanced with real-time updates)
- Responsive design works on all device sizes
- Dark mode support throughout the admin panel

## Next Steps

The admin panel is fully functional. You may want to consider:
- Adding real-time updates using WebSockets or Server-Sent Events
- Implementing bulk operations for better efficiency
- Adding more detailed analytics and reporting
- Setting up automated backups for uploaded images
- Adding email notifications for order status changes