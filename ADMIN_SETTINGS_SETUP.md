# Admin Settings Setup

To enable the admin settings functionality, you need to create the `admin_settings` table in your Supabase database.

## Step 1: Create the Table

Run this SQL in your Supabase SQL Editor:

```sql
-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "whatsappNumber" TEXT NOT NULL,
  "bannerTitle" TEXT,
  "bannerText" TEXT,
  "bannerActive" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to admin_settings table
DROP TRIGGER IF EXISTS update_admin_settings_updated_at ON admin_settings;
CREATE TRIGGER update_admin_settings_updated_at
    BEFORE UPDATE ON admin_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS (Row Level Security)
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access only
DROP POLICY IF EXISTS "Admin can manage settings" ON admin_settings;
CREATE POLICY "Admin can manage settings" ON admin_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'ADMIN'
        )
    );

-- Grant permissions
GRANT ALL ON admin_settings TO authenticated;
GRANT ALL ON admin_settings TO service_role;
```

## Step 2: Insert Default Settings (Optional)

```sql
-- Insert default settings
INSERT INTO admin_settings (
  "whatsappNumber",
  "bannerTitle", 
  "bannerText",
  "bannerActive"
) VALUES (
  '919876543210',
  'Welcome to PortraitStudio!',
  'Get custom hand-drawn portraits with amazing detail.',
  false
);
```

## Features Enabled

After creating the table, the following features will work:

### Admin Settings Page (`/admin/settings`)
- ✅ WhatsApp number configuration
- ✅ Promotional banner management
- ✅ Data export functionality (Orders, Gallery, Customers)
- ✅ System status monitoring

### Main Website
- ✅ Promotional banner display (when enabled)
- ✅ Banner dismissal with localStorage persistence
- ✅ Responsive banner design

### Export Features
- ✅ Export Orders as CSV
- ✅ Export Gallery Images as CSV  
- ✅ Export Customer Data as CSV

## API Endpoints Created

- `GET/POST /api/admin/settings` - Manage admin settings
- `GET /api/banner` - Fetch active promotional banner
- `GET /api/admin/export/orders` - Export orders data
- `GET /api/admin/export/gallery` - Export gallery data
- `GET /api/admin/export/customers` - Export customer data

All endpoints are protected and require admin authentication.