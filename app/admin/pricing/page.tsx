import { supabaseServer } from '@/lib/supabase-server'
import { PricingManager } from '@/components/admin/pricing-manager'

// Force dynamic rendering - prevents static generation at build time
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getPricingData() {
  try {
    const { data: pricing, error } = await supabaseServer
      .from('pricing')
      .select('*')
      .order('style', { ascending: true })
      .order('numberOfFaces', { ascending: true })
      .order('size', { ascending: true })
    
    if (error) {
      console.error('Error fetching pricing data:', error)
      return []
    }
    
    return pricing || []
  } catch (error) {
    console.error('Error fetching pricing data:', error)
    return []
  }
}

export default async function AdminPricingPage() {
  const pricing = await getPricingData()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Pricing Management</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Configure pricing rules for different sketch styles, sizes, and number of faces
        </p>
      </div>

      <PricingManager pricing={pricing} />
    </div>
  )
}