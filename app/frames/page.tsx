import { prisma } from '@/lib/prisma'
import { FramesGrid } from '@/components/frames/frames-grid'
import { PageTransition } from '@/components/animations/page-transition'
import { TextReveal } from '@/components/animations/text-reveal'

async function getFrames() {
  return await prisma.frame.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' }
  })
}

export default async function FramesPage() {
  const frames = await getFrames()

  return (
    <PageTransition>
      <div className="py-24">
        <div className="container-width section-padding">
          <div className="text-center mb-16">
            <TextReveal className="text-4xl lg:text-6xl font-bold mb-6">
              Premium
              <span className="gradient-text block">Frames</span>
            </TextReveal>
            <TextReveal 
              className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
              delay={0.2}
            >
              Complete your portrait with our selection of premium frames. 
              Each frame is carefully crafted to enhance and protect your artwork.
            </TextReveal>
          </div>

          <FramesGrid frames={frames} />

          {/* Additional Info */}
          <div className="mt-16 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Why Choose Our Frames?
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl mb-4">🏆</div>
                <h3 className="text-lg font-semibold mb-2">Premium Quality</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Made from high-quality materials that last for generations
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-4">🎨</div>
                <h3 className="text-lg font-semibold mb-2">Perfect Fit</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Custom-sized to perfectly complement your portrait
                </p>
              </div>
              
              <div className="text-center">
                <div className="text-3xl mb-4">🛡️</div>
                <h3 className="text-lg font-semibold mb-2">UV Protection</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  Includes UV-resistant glass to protect your artwork
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}