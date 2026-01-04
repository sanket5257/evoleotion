import { PortfolioGrid } from '@/components/sections/portfolio-grid'
import { HeroVideo } from '@/components/sections/hero-video'
import { ExhibitionsSection } from '@/components/sections/exhibitions-section'
import { Footer } from '@/components/layout/footer'
import { PageTransition } from '@/components/animations/page-transition'

export default function HomePage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white">
        <HeroVideo />
        <PortfolioGrid />
        <ExhibitionsSection />
        <Footer />
      </div>
    </PageTransition>
  )
}