import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export const dynamic = 'force-dynamic'

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    console.log('🌱 Seeding database with initial data...')

    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 12)
    const testPassword = await bcrypt.hash('password123', 12)

    const seedSQL = `
-- Insert admin user
INSERT INTO users (email, name, password, role) 
VALUES ('admin@test.com', 'Admin User', '${adminPassword}', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- Insert test user
INSERT INTO users (email, name, password, role) 
VALUES ('test@example.com', 'Test User', '${testPassword}', 'USER')
ON CONFLICT (email) DO NOTHING;

-- Insert sample gallery images
INSERT INTO gallery_images (title, description, "imageUrl", "publicId", style, tags, "isActive", "order") VALUES
('Charcoal Portrait', 'Beautiful charcoal style portrait with rich textures', '/api/placeholder/400/500', 'sample-charcoal-1', 'Charcoal', ARRAY['portrait', 'charcoal', 'artistic'], true, 1),
('Pencil Sketch Portrait', 'Detailed pencil sketch with realistic shading', '/api/placeholder/400/500', 'sample-pencil-1', 'Pencil Sketch', ARRAY['portrait', 'pencil', 'sketch'], true, 2),
('Charcoal Family Portrait', 'Family portrait in charcoal style', '/api/placeholder/400/500', 'sample-charcoal-2', 'Charcoal', ARRAY['family', 'charcoal', 'group'], true, 3),
('Pencil Couple Portrait', 'Romantic couple portrait in pencil', '/api/placeholder/400/500', 'sample-pencil-2', 'Pencil Sketch', ARRAY['couple', 'pencil', 'romantic'], true, 4);

-- Insert pricing rules (sample - you can add more)
INSERT INTO pricing (style, size, "numberOfFaces", "basePrice", "isActive") VALUES
('Charcoal', '8x10', 1, 1999, true),
('Charcoal', '8x10', 2, 2999, true),
('Charcoal', '11x14', 1, 2999, true),
('Charcoal', '11x14', 2, 3999, true),
('Pencil Sketch', '8x10', 1, 1999, true),
('Pencil Sketch', '8x10', 2, 2999, true),
('Pencil Sketch', '11x14', 1, 2999, true),
('Pencil Sketch', '11x14', 2, 3999, true)
ON CONFLICT (style, size, "numberOfFaces") DO NOTHING;

-- Insert sample offers
INSERT INTO offers (title, description, type, value, "maxDiscount", "isActive", priority, "applicableStyles", "firstOrderOnly") VALUES
('New Year Special', '20% off all portraits - Limited time offer!', 'PERCENTAGE_DISCOUNT', 20, 2000, true, 10, ARRAY[]::TEXT[], false),
('First Order Discount', 'Get 15% off your first portrait order', 'FIRST_ORDER_DISCOUNT', 15, 1500, true, 5, ARRAY[]::TEXT[], true);

INSERT INTO offers (title, description, type, value, "couponCode", "isActive", priority, "minOrderValue", "applicableStyles", "firstOrderOnly") VALUES
('SAVE500', 'Flat ₹500 off on orders above ₹3000', 'FLAT_DISCOUNT', 500, 'SAVE500', true, 8, 3000, ARRAY[]::TEXT[], false)
ON CONFLICT ("couponCode") DO NOTHING;

-- Insert admin settings
INSERT INTO admin_settings ("whatsappNumber", "bannerTitle", "bannerText", "bannerActive") VALUES
('917083259985', 'Limited Time Offer!', 'Get 20% off on all portrait orders. Use code SAVE20', true);

SELECT 'Database seeded successfully' as result;
`

    return NextResponse.json({
      status: 'manual_seed_required',
      message: 'Please run this SQL in your Supabase SQL Editor to seed the database',
      sql: seedSQL,
      credentials: {
        admin: 'admin@test.com (password: admin123)',
        test: 'test@example.com (password: password123)'
      },
      instructions: [
        '1. First create the tables using the previous SQL',
        '2. Then run this seeding SQL',
        '3. Test signup/signin functionality'
      ],
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('❌ Error preparing seed data:', error)
    return NextResponse.json({
      status: 'error',
      error: 'Seed preparation failed',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}