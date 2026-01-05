'use client'

import { useState } from 'react'
import { Send, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'

export function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [images, setImages] = useState<File[]>([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    portraitType: '',
    size: '',
    numberOfPeople: '1',
    budget: '',
    timeline: '',
    message: '',
    referencePhotos: true
  })

  const portraitTypes = [
    { value: '', label: 'Select Portrait Type' },
    { value: 'person', label: 'Single Person' },
    { value: 'couple', label: 'Couple' },
    { value: 'family', label: 'Family Group' },
    { value: 'pet', label: 'Pet Portrait' },
    { value: 'memorial', label: 'Memorial Portrait' },
    { value: 'other', label: 'Other (specify in message)' }
  ]

  const sizes = [
    { value: '', label: 'Select Size' },
    { value: '8x10', label: '8" x 10" - $150+' },
    { value: '11x14', label: '11" x 14" - $200+' },
    { value: '16x20', label: '16" x 20" - $300+' },
    { value: '18x24', label: '18" x 24" - $400+' },
    { value: 'custom', label: 'Custom Size' }
  ]

  const timelines = [
    { value: '', label: 'When do you need this?' },
    { value: 'no-rush', label: 'No rush (2-3 weeks)' },
    { value: 'standard', label: 'Standard (1-2 weeks)' },
    { value: 'priority', label: 'Priority (3-5 days) +50%' },
    { value: 'rush', label: 'Rush (1-2 days) +100%' }
  ]

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/')
      const isValidSize = file.size <= 10 * 1024 * 1024 // 10MB
      return isValidType && isValidSize
    })
    
    setImages(prev => [...prev, ...validFiles].slice(0, 5)) // Max 5 images
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataToSend = new FormData()
      
      // Add form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value.toString())
      })
      
      // Add images
      images.forEach((image, index) => {
        formDataToSend.append(`image-${index}`, image)
      })

      const response = await fetch('/api/contact', {
        method: 'POST',
        body: formDataToSend
      })

      if (!response.ok) throw new Error('Failed to send message')

      setSubmitted(true)
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again or email us directly.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center p-8 border border-green-500/20 bg-green-500/10 rounded-lg">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
          <Send className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="text-xl font-light mb-4">Message Sent!</h3>
        <p className="text-gray-400 mb-6">
          Thank you for your interest! We'll review your request and get back to you 
          within 24 hours with a personalized quote and timeline.
        </p>
        <Button
          onClick={() => {
            setSubmitted(false)
            setFormData({
              name: '',
              email: '',
              phone: '',
              portraitType: '',
              size: '',
              numberOfPeople: '1',
              budget: '',
              timeline: '',
              message: '',
              referencePhotos: true
            })
            setImages([])
          }}
          variant="ghost"
        >
          Send Another Message
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Your Name *"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          className="bg-black border-white/20 text-white"
        />
        
        <Input
          label="Email Address *"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          className="bg-black border-white/20 text-white"
        />
      </div>

      <Input
        label="Phone Number (optional)"
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        className="bg-black border-white/20 text-white"
      />

      {/* Portrait Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Portrait Type *"
          value={formData.portraitType}
          onChange={(e) => setFormData({ ...formData, portraitType: e.target.value })}
          options={portraitTypes}
          required
          className="bg-black border-white/20 text-white"
        />
        
        <Select
          label="Preferred Size"
          value={formData.size}
          onChange={(e) => setFormData({ ...formData, size: e.target.value })}
          options={sizes}
          className="bg-black border-white/20 text-white"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Number of People/Pets"
          type="number"
          min="1"
          max="10"
          value={formData.numberOfPeople}
          onChange={(e) => setFormData({ ...formData, numberOfPeople: e.target.value })}
          className="bg-black border-white/20 text-white"
        />
        
        <Select
          label="Timeline"
          value={formData.timeline}
          onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
          options={timelines}
          className="bg-black border-white/20 text-white"
        />
      </div>

      <Input
        label="Budget Range (optional)"
        placeholder="e.g., $200-300"
        value={formData.budget}
        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
        className="bg-black border-white/20 text-white"
      />

      {/* Reference Photos */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-4">
          Reference Photos (optional but helpful)
        </label>
        
        <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">
            Upload photos for your portrait (Max 5 images, 10MB each)
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="photo-upload"
          />
          <label 
            htmlFor="photo-upload" 
            className="inline-flex items-center justify-center px-4 py-2 border border-white/30 text-sm uppercase tracking-widest text-white hover:bg-white hover:text-black transition-colors duration-300 cursor-pointer"
          >
            Choose Photos
          </label>
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(image)}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-20 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Message */}
      <Textarea
        label="Additional Details"
        placeholder="Tell us about your vision, style preferences, special requests, or any questions you have..."
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        rows={4}
        className="bg-black border-white/20 text-white"
      />

      {/* Submit */}
      <Button
        type="submit"
        disabled={loading || !formData.name || !formData.email}
        className="w-full flex items-center justify-center space-x-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            <span>Sending...</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            <span>Send Message & Get Quote</span>
          </>
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        By submitting this form, you agree to receive email communication about your portrait request. 
        We'll never share your information with third parties.
      </p>
    </form>
  )
}