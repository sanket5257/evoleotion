import { HeroSection } from '@/components/sections/hero-section'
import { FeaturesSection } from '@/components/sections/features-section'
import { GalleryPreview } from '@/components/sections/gallery-preview'
import { PricingPreview } from '@/components/sections/pricing-preview'
import { CTASection } from '@/components/sections/cta-section'
import { PageTransition } from '@/components/animations/page-transition'

export default function HomePage() {
  return (
    <PageTransition>
      <HeroSection />
      <FeaturesSection />
      <GalleryPreview />
      <PricingPreview />
      <CTASection />
    </PageTransition>
  )
}