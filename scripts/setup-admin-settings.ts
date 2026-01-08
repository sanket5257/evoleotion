import { supabaseServer } from '../lib/supabase-server'

async function setupAdminSettings() {
  try {
    console.log('Setting up admin_settings table...')

    if (!supabaseServer) {
      throw new Error('Supabase server connection not available')
    }

    // Check if table exists by trying to query it
    const { error: tableCheckError } = await supabaseServer
      .from('admin_settings')
      .select('id')
      .limit(1)

    if (tableCheckError) {
      console.log('Admin settings table does not exist. Please create it manually in Supabase.')
      console.log('SQL to run in Supabase SQL Editor:')
      console.log(`
CREATE TABLE IF NOT EXISTS admin_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  "whatsappNumber" TEXT NOT NULL,
  "bannerTitle" TEXT,
  "bannerText" TEXT,
  "bannerActive" BOOLEAN DEFAULT false,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Admin can manage settings" ON admin_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'ADMIN'
        )
    );
      `)
      return
    }

    // Check if we need to create initial settings
    const { data: existingSettings, error: fetchError } = await supabaseServer
      .from('admin_settings')
      .select('id')
      .limit(1)
      .single()

    if (fetchError && fetchError.code === 'PGRST116') {
      // No settings exist, create default ones
      console.log('Creating default admin settings...')
      
      const { error: insertError } = await supabaseServer
        .from('admin_settings')
        .insert({
          whatsappNumber: '919876543210', // Default placeholder
          bannerTitle: 'Welcome to PortraitStudio!',
          bannerText: 'Get custom hand-drawn portraits with amazing detail.',
          bannerActive: false
        })

      if (insertError) {
        console.error('Error creating default settings:', insertError)
      } else {
        console.log('✅ Default admin settings created!')
      }
    } else if (!fetchError) {
      console.log('✅ Admin settings already exist')
    }

  } catch (error) {
    console.error('❌ Error setting up admin settings:', error)
    process.exit(1)
  }
}

// Run the setup
setupAdminSettings()