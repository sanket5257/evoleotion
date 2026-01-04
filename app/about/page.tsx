import { PageTransition } from '@/components/animations/page-transition'
import { Footer } from '@/components/layout/footer'
import { Navbar } from '@/components/layout/navbar'

export default function AboutPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white">
        {/* Navigation */}
        <Navbar />

        {/* About Content */}
        <section className="px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-light tracking-wider mb-16">
              About
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div>
                <h2 className="text-2xl font-light tracking-wide mb-6">
                  The Art of Sketching
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Evoleotion celebrates the timeless beauty of pencil and charcoal art. 
                  Each sketch is carefully crafted by hand, capturing the essence and 
                  emotion of every subject with precision and artistry.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  From realistic portraits to expressive character studies, our work 
                  spans traditional drawing techniques that have been perfected over 
                  generations of artists.
                </p>
              </div>
              
              <div>
                <h2 className="text-2xl font-light tracking-wide mb-6">
                  Our Process
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6">
                  Every piece begins with careful observation and planning. Using premium 
                  graphite pencils and charcoal, we build layers of tone and texture to 
                  create depth and life in each drawing.
                </p>
                <p className="text-gray-400 leading-relaxed">
                  Whether it's a cherished family portrait or a beloved pet, we pour 
                  passion and skill into every stroke, creating heirloom-quality artwork 
                  that will be treasured for generations.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <Footer />
      </div>
    </PageTransition>
  )
}