import { prisma } from '@/lib/prisma'
import { SettingsManager } from '@/components/admin/settings-manager'

async function getSettings() {
  const settings = await prisma.adminSettings.findFirst()
  return settings
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