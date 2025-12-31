import { prisma } from '@/lib/prisma'
import { SettingsManager } from '@/components/admin/settings-manager'

// Force dynamic rendering - prevents static generation at build time
export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getSettings() {
  try {
    const settings = await prisma.adminSettings.findFirst()
    return settings
  } catch (error) {
    console.error('Error fetching settings:', error)
    return null
  }
}

export default async function AdminSettingsPage() {
  const settings = await getSettings()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Configure your website settings and business information
        </p>
      </div>

      <SettingsManager settings={settings} />
    </div>
  )
}