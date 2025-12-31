# Pricing Update - Charcoal & Pencil Only

## Changes Made

### 1. Updated Seed Data (`scripts/seed-admin-data.ts`)
- **Removed**: Watercolor, Oil Painting, Digital Art options
- **Kept**: Only Charcoal and Pencil Sketch styles
- **Added**: More size options (8x10, 11x14, 16x20)
- **Added**: Support for up to 3 people in portraits

### 2. New Pricing Structure

#### Charcoal Portraits
- **8x10**: ₹2,000 (1 person), ₹3,000 (2 people), ₹4,000 (3 people)
- **11x14**: ₹3,000 (1 person), ₹4,000 (2 people), ₹5,000 (3 people)
- **16x20**: ₹4,500 (1 person), ₹5,500 (2 people), ₹6,500 (3 people)

#### Pencil Sketch Portraits
- **8x10**: ₹1,500 (1 person), ₹2,500 (2 people), ₹3,500 (3 people)
- **11x14**: ₹2,500 (1 person), ₹3,500 (2 people), ₹4,500 (3 people)
- **16x20**: ₹3,500 (1 person), ₹4,500 (2 people), ₹5,500 (3 people)

### 3. Updated Gallery Images
- Replaced placeholder images with actual charcoal artwork from `/public/artworks/`
- Updated titles and descriptions to reflect charcoal specialization

### 4. Updated Offers
- **New Customer**: 20% off first order (WELCOME20)
- **Family Discount**: ₹500 off orders with 2+ people (FAMILY500)
- **Large Size**: 15% off 16x20 portraits (LARGE15)

### 5. Updated Page Content
- **Pricing page**: Updated description to emphasize charcoal and pencil specialization
- **Features**: Added style-specific features (Rich Texture & Depth for charcoal, Fine Line Detail for pencil)
- **Info cards**: Updated to highlight charcoal & pencil expertise

## To Apply Changes

### Option 1: Run Seed Script (Recommended)
```bash
npx tsx scripts/seed-admin-data.ts
```

### Option 2: Manual Admin Panel Updates
1. Go to `/admin/pricing`
2. Delete existing pricing entries for Watercolor, Oil Painting, Digital Art
3. Add new pricing entries as listed above
4. Update gallery images in `/admin/gallery`
5. Update offers in `/admin/offers`

## Benefits

1. **Focused Specialization**: Clear focus on charcoal and pencil work
2. **Realistic Pricing**: Pricing reflects the actual services offered
3. **Better User Experience**: Customers see only available options
4. **Authentic Portfolio**: Gallery shows actual work samples
5. **Targeted Offers**: Promotions relevant to your services

## Files Updated

- `scripts/seed-admin-data.ts` - Updated pricing, gallery, and offers
- `app/pricing/page.tsx` - Updated page description
- `components/pricing/pricing-table.tsx` - Updated features list
- `components/sections/gallery-preview.tsx` - Already updated with charcoal images

The pricing page now accurately reflects your charcoal and pencil portrait services with appropriate pricing tiers and realistic options for customers.