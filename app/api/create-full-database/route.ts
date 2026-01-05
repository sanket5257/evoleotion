import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    console.log('🚀 Creating complete database from scratch...')

    // Step 1: Create all tables via SQL
    const createTablesSQL = `
-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS user_favorites CASCADE;
DROP TABLE IF EXISTS order_images CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS pricing CASCADE;
DROP TABLE IF EXISTS gallery_images CASCADE;
DROP TABLE IF EXISTS admin_settings CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS "Session" CASCADE;
DROP TABLE IF EXISTS "Account" CASCADE;
DROP TABLE IF EXISTS "VerificationToken" CASCADE;

-- Drop existing types
DROP TYPE IF EXISTS "Role" CASCADE;
DROP TYPE IF EXISTS "OfferType" CASCADE;
DROP TYPE IF EXISTS "OrderStatus" CASCADE;
DROP TYPE IF EXISTS "PaymentStatus" CASCADE;

-- Create enums
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
CREATE TYPE "OfferType" AS ENUM ('FLAT_DISCOUNT', 'PERCENTAGE_DISCOUNT', 'FIRST_ORDER_DISCOUNT');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PREVIEW_SENT', 'REVISION', 'APPROVED', 'COMPLETED');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'REFUNDED');

-- Create users table
CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT,
    email TEXT UNIQUE NOT NULL,
    "emailVerified" TIMESTAMPTZ,
    image TEXT,
    password TEXT,
    role "Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create gallery_images table
CREATE TABLE gallery_images (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT,
    "imageUrl" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    style TEXT NOT NULL,
    tags TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create pricing table
CREATE TABLE pricing (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    style TEXT NOT NULL,
    size TEXT NOT NULL,
    "numberOfFaces" INTEGER NOT NULL,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(style, size, "numberOfFaces")
);

-- Create offers table
CREATE TABLE offers (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    title TEXT NOT NULL,
    description TEXT,
    type "OfferType" NOT NULL,
    value DOUBLE PRECISION NOT NULL,
    "maxDiscount" DOUBLE PRECISION,
    "couponCode" TEXT UNIQUE,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    priority INTEGER NOT NULL DEFAULT 0,
    "startDate" TIMESTAMPTZ,
    "endDate" TIMESTAMPTZ,
    "minOrderValue" DOUBLE PRECISION,
    "applicableStyles" TEXT[],
    "firstOrderOnly" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create orders table
CREATE TABLE orders (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "orderNumber" TEXT UNIQUE NOT NULL,
    "userId" TEXT,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    style TEXT NOT NULL,
    size TEXT NOT NULL,
    "numberOfFaces" INTEGER NOT NULL,
    "specialNotes" TEXT,
    "basePrice" DOUBLE PRECISION NOT NULL,
    "discountAmount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "finalPrice" DOUBLE PRECISION NOT NULL,
    status "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "offerId" TEXT,
    "couponCode" TEXT,
    "previewUrl" TEXT,
    "adminNotes" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY ("offerId") REFERENCES offers(id) ON DELETE SET NULL
);

-- Create order_images table
CREATE TABLE order_images (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "orderId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    FOREIGN KEY ("orderId") REFERENCES orders(id) ON DELETE CASCADE
);

-- Create admin_settings table
CREATE TABLE admin_settings (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "whatsappNumber" TEXT NOT NULL,
    "bannerTitle" TEXT,
    "bannerText" TEXT,
    "bannerActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create user_favorites table
CREATE TABLE user_favorites (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "imageId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE("userId", "imageId"),
    FOREIGN KEY ("userId") REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY ("imageId") REFERENCES gallery_images(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders("userId");
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_gallery_images_active ON gallery_images("isActive");
CREATE INDEX idx_pricing_style_size ON pricing(style, size);

SELECT 'All tables created successfully' as result;
`

    // Execute the SQL via direct HTTP request to Supabase
    const sqlResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ sql: createTablesSQL })
    })

    // If RPC doesn't work, return the SQL for manual execution
    if (!sqlResponse.ok) {
      return NextResponse.json({
        status: 'manual_setup_required',
        message: 'Please run this SQL in your Supabase SQL Editor to create all tables',
        sql: createTablesSQL,
        instructions: [
          '1. Go to https://supabase.com/dashboard',
          '2. Select your project (knuorfxjuazrhyhazcis)',
          '3. Go to SQL Editor',
          '4. Paste and run the SQL above',
          '5. Then call this API again to seed the data'
        ],
        timestamp: new Date().toISOString()
      })
    }

    console.log('✅ Tables created successfully')

    // Step 2: Seed the database with initial data
    const seedData = await seedDatabase(supabaseUrl, supabaseServiceKey)

    return NextResponse.json({
      status: 'success',
      message: 'Complete database created and seeded successfully!',
      data: seedData,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error creating database:', error)
    return NextResponse.json({
      status: 'error',
      error: 'Database creation failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

async function seedDatabase(supabaseUrl: string, supabaseServiceKey: string) {
  console.log('🌱 Seeding database with initial data...')

  // Seed data via direct SQL inserts
  const seedSQL = `
-- Insert admin user
INSERT INTO users (email, name, password, role) 
VALUES ('admin@test.com', 'Admin User', '${await bcrypt.hash('admin123', 12)}', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- Insert test user
INSERT INTO users (email, name, password, role) 
VALUES ('test@example.com', 'Test User', '${await bcrypt.hash('password123', 12)}', 'USER')
ON CONFLICT (email) DO NOTHING;

-- Insert sample gallery images
INSERT INTO gallery_images (title, description, "imageUrl", "publicId", style, tags, "isActive", "order") VALUES
('Charcoal Portrait', 'Beautiful charcoal style portrait with rich textures', '/api/placeholder/400/500', 'sample-charcoal-1', 'Charcoal', ARRAY['portrait', 'charcoal', 'artistic'], true, 1),
('Pencil Sketch Portrait', 'Detailed pencil sketch with realistic shading', '/api/placeholder/400/500', 'sample-pencil-1', 'Pencil Sketch', ARRAY['portrait', 'pencil', 'sketch'], true, 2),
('Charcoal Family Portrait', 'Family portrait in charcoal style', '/api/placeholder/400/500', 'sample-charcoal-2', 'Charcoal', ARRAY['family', 'charcoal', 'group'], true, 3),
('Pencil Couple Portrait', 'Romantic couple portrait in pencil', '/api/placeholder/400/500', 'sample-pencil-2', 'Pencil Sketch', ARRAY['couple', 'pencil', 'romantic'], true, 4);

-- Insert pricing rules
INSERT INTO pricing (style, size, "numberOfFaces", "basePrice", "isActive") VALUES
-- Charcoal pricing
('Charcoal', '8x10', 1, 1999, true),
('Charcoal', '8x10', 2, 2999, true),
('Charcoal', '8x10', 3, 3999, true),
('Charcoal', '8x10', 4, 4999, true),
('Charcoal', '8x10', 5, 5999, true),
('Charcoal', '11x14', 1, 2999, true),
('Charcoal', '11x14', 2, 3999, true),
('Charcoal', '11x14', 3, 4999, true),
('Charcoal', '11x14', 4, 5999, true),
('Charcoal', '11x14', 5, 6999, true),
('Charcoal', '16x20', 1, 3999, true),
('Charcoal', '16x20', 2, 4999, true),
('Charcoal', '16x20', 3, 5999, true),
('Charcoal', '16x20', 4, 6999, true),
('Charcoal', '16x20', 5, 7999, true),
('Charcoal', '18x24', 1, 4999, true),
('Charcoal', '18x24', 2, 5999, true),
('Charcoal', '18x24', 3, 6999, true),
('Charcoal', '18x24', 4, 7999, true),
('Charcoal', '18x24', 5, 8999, true),
-- Pencil Sketch pricing
('Pencil Sketch', '8x10', 1, 1999, true),
('Pencil Sketch', '8x10', 2, 2999, true),
('Pencil Sketch', '8x10', 3, 3999, true),
('Pencil Sketch', '8x10', 4, 4999, true),
('Pencil Sketch', '8x10', 5, 5999, true),
('Pencil Sketch', '11x14', 1, 2999, true),
('Pencil Sketch', '11x14', 2, 3999, true),
('Pencil Sketch', '11x14', 3, 4999, true),
('Pencil Sketch', '11x14', 4, 5999, true),
('Pencil Sketch', '11x14', 5, 6999, true),
('Pencil Sketch', '16x20', 1, 3999, true),
('Pencil Sketch', '16x20', 2, 4999, true),
('Pencil Sketch', '16x20', 3, 5999, true),
('Pencil Sketch', '16x20', 4, 6999, true),
('Pencil Sketch', '16x20', 5, 7999, true),
('Pencil Sketch', '18x24', 1, 4999, true),
('Pencil Sketch', '18x24', 2, 5999, true),
('Pencil Sketch', '18x24', 3, 6999, true),
('Pencil Sketch', '18x24', 4, 7999, true),
('Pencil Sketch', '18x24', 5, 8999, true)
ON CONFLICT (style, size, "numberOfFaces") DO NOTHING;

-- Insert sample offers
INSERT INTO offers (title, description, type, value, "maxDiscount", "isActive", priority, "startDate", "endDate", "applicableStyles", "firstOrderOnly") VALUES
('New Year Special', '20% off all portraits - Limited time offer!', 'PERCENTAGE_DISCOUNT', 20, 2000, true, 10, '2024-01-01', '2024-12-31', ARRAY[]::TEXT[], false),
('First Order Discount', 'Get 15% off your first portrait order', 'FIRST_ORDER_DISCOUNT', 15, 1500, true, 5, NULL, NULL, ARRAY[]::TEXT[], true);

INSERT INTO offers (title, description, type, value, "couponCode", "isActive", priority, "minOrderValue", "applicableStyles", "firstOrderOnly") VALUES
('SAVE500', 'Flat ₹500 off on orders above ₹3000', 'FLAT_DISCOUNT', 500, 'SAVE500', true, 8, 3000, ARRAY[]::TEXT[], false)
ON CONFLICT ("couponCode") DO NOTHING;

-- Insert admin settings
INSERT INTO admin_settings ("whatsappNumber", "bannerTitle", "bannerText", "bannerActive") VALUES
('917083259985', 'Limited Time Offer!', 'Get 20% off on all portrait orders. Use code SAVE20', true);

SELECT 'Database seeded successfully' as result;
`

  const seedResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/exec`, {
    method: 'POST',
    headers: {
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify({ sql: seedSQL })
  })

  if (!seedResponse.ok) {
    throw new Error('Failed to seed database')
  }

  console.log('✅ Database seeded successfully')

  return {
    adminUser: 'admin@test.com (password: admin123)',
    testUser: 'test@example.com (password: password123)',
    galleryImages: 4,
    pricingRules: 40,
    offers: 3,
    adminSettings: 1
  }
}