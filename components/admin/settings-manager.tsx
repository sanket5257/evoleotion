'use client'

import { useState } from 'react'
import { Save, MessageCircle, Megaphone, Globe, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface AdminSettings {
  id: string
  whatsappNumber: string
  bannerTitle?: string | null
  bannerText?: string | null
  bannerActive: boolean
  createdAt: Date
  updatedAt: Date
}

interface SettingsManagerProps {
  settings: AdminSettings | null
}

export function SettingsManager({ settings }: SettingsManagerProps) {
  const [formData, setFormData] = useState({
    whatsappNumber: settings?.whatsappNumber || '',
    bannerTitle: settings?.bannerTitle || '',
    bannerText: settings?.bannerText || '',
    bannerActive: settings?.bannerActive || false,
  })
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save settings')
      }
      
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      alert(`Failed to save settings: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const testWhatsApp = () => {
    if (formData.whatsappNumber) {
      const message = 'Test message from PortraitStudio admin panel'
      const url = `https://wa.me/${formData.whatsappNumber.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`
      window.open(url, '_blank')
    }
  }

  return (
    <div className="max-w-4xl space-y-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* WhatsApp Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-6">
            <MessageCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              WhatsApp Integration
            </h3>
          </div>

          <div className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                label="WhatsApp Business Number"
                value={formData.whatsappNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsappNumber: e.target.value }))}
                placeholder="919876543210"
                required
              />
              
              <div className="flex items-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={testWhatsApp}
                  disabled={!formData.whatsappNumber}
                  className="w-full"
                >
                  Test WhatsApp
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                WhatsApp Number Format
              </h4>
              <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                <li>• Include country code (e.g., 91 for India)</li>
                <li>• No spaces, dashes, or special characters</li>
                <li>• Example: 919876543210 (not +91 98765 43210)</li>
                <li>• This number will receive order notifications</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Banner Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-6">
            <Megaphone className="w-6 h-6 text-orange-600" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Promotional Banner
            </h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                id="bannerActive"
                checked={formData.bannerActive}
                onChange={(e) => setFormData(prev => ({ ...prev, bannerActive: e.target.checked }))}
                className="rounded"
              />
              <label htmlFor="bannerActive" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Show promotional banner on website
              </label>
            </div>

            <Input
              label="Banner Title"
              value={formData.bannerTitle}
              onChange={(e) => setFormData(prev => ({ ...prev, bannerTitle: e.target.value }))}
              placeholder="Limited Time Offer!"
              disabled={!formData.bannerActive}
            />

            <Textarea
              label="Banner Text"
              value={formData.bannerText}
              onChange={(e) => setFormData(prev => ({ ...prev, bannerText: e.target.value }))}
              placeholder="Get 20% off on all portrait orders. Use code SAVE20"
              rows={3}
              disabled={!formData.bannerActive}
            />

            {formData.bannerActive && formData.bannerTitle && (
              <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-4 rounded-lg">
                <div className="text-center">
                  <h4 className="font-semibold mb-1">{formData.bannerTitle}</h4>
                  {formData.bannerText && (
                    <p className="text-sm text-primary-100">{formData.bannerText}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Website Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-6">
            <Globe className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Website Information
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">Business Details</h4>
              <Input
                label="Business Name"
                value="PortraitStudio"
                disabled
                className="bg-gray-50 dark:bg-gray-700"
              />
              <Input
                label="Business Email"
                value="hello@portraitstudio.com"
                disabled
                className="bg-gray-50 dark:bg-gray-700"
              />
              <Input
                label="Support Email"
                value="support@portraitstudio.com"
                disabled
                className="bg-gray-50 dark:bg-gray-700"
              />
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">Service Information</h4>
              <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                  <li>• Delivery Time: 3-5 business days</li>
                  <li>• Revision Policy: Unlimited revisions</li>
                  <li>• Payment Method: WhatsApp checkout</li>
                  <li>• File Formats: High-resolution digital delivery</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Security Settings */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 mb-6">
            <Shield className="w-6 h-6 text-red-600" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Security & Backup
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">Database</h4>
              <div className="space-y-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open('/api/admin/export/orders', '_blank')}
                >
                  Export Orders Data
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open('/api/admin/export/gallery', '_blank')}
                >
                  Export Gallery Data
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full"
                  onClick={() => window.open('/api/admin/export/customers', '_blank')}
                >
                  Export Customer Data
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-900 dark:text-white">System Status</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <span className="text-sm">Database Connection</span>
                  <span className="text-green-600 dark:text-green-400 text-sm font-medium">✓ Connected</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <span className="text-sm">Supabase Storage</span>
                  <span className="text-green-600 dark:text-green-400 text-sm font-medium">✓ Active</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-green-50 dark:bg-green-900/20 rounded">
                  <span className="text-sm">Authentication</span>
                  <span className="text-green-600 dark:text-green-400 text-sm font-medium">✓ Working</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end space-x-4">
          {saved && (
            <div className="flex items-center text-green-600 dark:text-green-400">
              <span className="text-sm">✓ Settings saved successfully!</span>
            </div>
          )}
          <Button type="submit" loading={loading} className="flex items-center space-x-2">
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </Button>
        </div>
      </form>
    </div>
  )
}