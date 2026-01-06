import { PageTransition } from '@/components/animations/page-transition'
import { Navbar } from '@/components/layout/navbar'
import { Star, Award, Users, Clock, Palette, Heart, Shield, Globe, User } from 'lucide-react'

export const metadata = {
  title: 'About Leo - Portrait Artist | Evoleotion',
  description: 'Meet Leo, a 22-year-old passionate portrait artist based in India, specializing in hand-drawn portraits that capture the essence of your precious memories.',
}

export default function AboutPage() {
  const stats = [
    { icon: <Users className="w-8 h-8" />, value: '300+', label: 'Happy Customers' },
    { icon: <Palette className="w-8 h-8" />, value: '500+', label: 'Portraits Created' },
    { icon: <Clock className="w-8 h-8" />, value: '3+', label: 'Years Experience' },
    { icon: <Globe className="w-8 h-8" />, value: '15+', label: 'Countries Served' },
  ]

  const values = [
    {
      icon: <Heart className="w-12 h-12" />,
      title: 'Passion for Art',
      description: 'Every stroke is made with love and dedication to create something truly special for you.'
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: 'Quality Guarantee',
      description: 'I stand behind my work with a 100% satisfaction guarantee on every portrait I create.'
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: 'Professional Excellence',
      description: 'Continuous learning and improvement to deliver the highest quality artwork every time.'
    },
    {
      icon: <Star className="w-12 h-12" />,
      title: 'Customer First',
      description: 'Your vision and satisfaction are my top priorities in every project I undertake.'
    },
  ]

  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white">
        {/* Navigation */}
        <Navbar />

        {/* Hero Section */}
        <section className="px-8 py-16">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-6xl md:text-8xl font-light tracking-wider mb-8">
              About Leo
            </h1>
            <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed mb-12">
              Hi, I'm Leo - a 22-year-old passionate artist based in India, dedicated to transforming your cherished memories 
              into timeless hand-drawn portraits that capture the essence of every moment.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="flex justify-center mb-4 text-white">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-light mb-2">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Story */}
        <section className="px-8 py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-light tracking-wider mb-8">
                  My Journey
                </h2>
                <div className="space-y-6 text-gray-400 leading-relaxed">
                  <p>
                    Hi, I'm Leo, a 22-year-old artist from India with a deep passion for creating 
                    beautiful hand-drawn portraits. My journey into art began at a young age, 
                    and over the past few years, I've dedicated myself to mastering the craft 
                    of portrait drawing.
                  </p>
                  <p>
                    What started as a hobby has evolved into my life's work. I believe that 
                    every person, every pet, and every moment deserves to be captured in its 
                    most beautiful form. Using traditional pencil and charcoal techniques, 
                    I create portraits that don't just capture appearance, but soul and emotion.
                  </p>
                  <p>
                    Based in India, I've had the privilege of creating portraits for families 
                    around the world. Each commission is a new story, a new challenge, and 
                    an opportunity to preserve precious memories that will be treasured for 
                    generations to come.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="aspect-square bg-white/5 border border-white/10 rounded-lg overflow-hidden">
                  <img
                    src="/me.jpeg"
                    alt="Leo - Portrait Artist"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="px-8 py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light tracking-wider mb-4">
                What I Stand For
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                My values guide everything I do, from the first sketch to the final delivery
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center p-8 border border-white/10 hover:border-white/20 transition-colors rounded-lg">
                  <div className="flex justify-center mb-6 text-white">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-light mb-4">{value.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Meet the Artist */}
        <section className="px-8 py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light tracking-wider mb-4">
                About the Artist
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Get to know Leo - the passionate artist behind every beautiful portrait
              </p>
            </div>

            <div className="max-w-2xl mx-auto">
              <div className="text-center p-8 border border-white/10 hover:border-white/20 transition-colors rounded-lg">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-2 border-white/20">
                  <img
                    src="/me.jpeg"
                    alt="Leo - Portrait Artist"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-2xl font-light mb-2">Leo</h3>
                <p className="text-gray-400 mb-1">Portrait Artist & Founder</p>
                <p className="text-sm text-gray-500 mb-6">22 years old • Based in India • 3+ years experience</p>
                <div className="text-gray-400 text-sm leading-relaxed space-y-4">
                  <p>
                    "Art has always been my language of expression. At 22, I've dedicated my life to 
                    mastering the art of portrait drawing, specializing in realistic pencil and charcoal work."
                  </p>
                  <p>
                    "Every portrait I create is a labor of love. I believe in capturing not just how someone 
                    looks, but who they are - their personality, their essence, their story."
                  </p>
                  <p>
                    "Based in India, I'm proud to serve customers worldwide, bringing their precious memories 
                    to life through the timeless medium of hand-drawn art."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Excellence */}
        <section className="px-8 py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative">
                <div className="aspect-square bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Award className="w-24 h-24 mx-auto mb-4 text-white" />
                    <p className="text-gray-400">Quality Craftsmanship</p>
                    <p className="text-sm text-gray-500 mt-2">Every detail matters</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-4xl font-light tracking-wider mb-8">
                  My Artistic Process
                </h2>
                <div className="space-y-6 text-gray-400 leading-relaxed">
                  <p>
                    Every portrait begins with careful study of your photograph. I analyze 
                    lighting, composition, and emotional expression to ensure the final 
                    artwork captures not just appearance, but personality and soul.
                  </p>
                  <p>
                    Using premium graphite pencils and professional-grade charcoal, I build 
                    layers of tone and texture. Each stroke is deliberate, each shadow 
                    carefully placed to create depth and bring your portrait to life.
                  </p>
                  <p>
                    The result is museum-quality artwork that preserves your most precious 
                    memories in a timeless medium that will be treasured for generations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-8 py-20 border-t border-white/10">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-light tracking-wider mb-8">
              Ready to Create Your Portrait?
            </h2>
            <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto">
              Join hundreds of satisfied customers who have trusted me to capture 
              their most precious memories in beautiful hand-drawn art.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/order"
                className="inline-block px-12 py-4 bg-white text-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors duration-300"
              >
                Start Your Order
              </a>
              <a
                href="/gallery"
                className="inline-block px-12 py-4 border border-white/30 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
              >
                View Gallery
              </a>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}