'use client'

import { useState, useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

const inquiryTypes = [
  { value: 'general', label: 'General Inquiry' },
  { value: 'pricing', label: 'Pricing Question' },
  { value: 'custom', label: 'Custom Request' },
  { value: 'support', label: 'Support' },
  { value: 'partnership', label: 'Partnership' },
]

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: '',
    subject: '',
    message: '',
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    gsap.fromTo(
      container,
      {
        x: 50,
        opacity: 0,
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      }
    )
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSubmitted(true)
    setLoading(false)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setSubmitted(false)
      setFormData({
        name: '',
        email: '',
        phone: '',
        inquiryType: '',
        subject: '',
        message: '',
      })
    }, 3000)
  }

  if (submitted) {
    return (
      <div ref={containerRef} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg text-center">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Send className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Message Sent!
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Thank you for reaching out. We'll get back to you within 24 hours.
        </p>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Send us a Message
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            required
          />
          
          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            required
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Input
            label="Phone Number (Optional)"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
          />
          
          <Select
            label="Inquiry Type"
            value={formData.inquiryType}
            onChange={(e) => setFormData(prev => ({ ...prev, inquiryType: e.target.value }))}
            options={[
              { value: '', label: 'Select Type' },
              ...inquiryTypes
            ]}
            required
          />
        </div>

        <Input
          label="Subject"
          value={formData.subject}
          onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
          required
        />

        <Textarea
          label="Message"
          value={formData.message}
          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
          placeholder="Tell us about your project or question..."
          rows={5}
          required
        />

        <Button
          type="submit"
          className="w-full flex items-center justify-center space-x-2"
          loading={loading}
        >
          <Send className="w-4 h-4" />
          <span>Send Message</span>
        </Button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
        <p className="text-sm text-blue-800 dark:text-blue-200">
          <strong>Quick Response:</strong> For urgent inquiries, reach out via WhatsApp 
          for faster response times.
        </p>
      </div>
    </div>
  )
}