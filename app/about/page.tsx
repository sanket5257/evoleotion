import { PageTransition } from '@/components/animations/page-transition'
import { Navbar } from '@/components/layout/navbar'
import { Star, Award, Users, Clock, Palette, Heart, Shield, Globe, User } from 'lucide-react'

export default function AboutPage() {
  const stats = [
    { icon: <Users className="w-8 h-8" />, value: '500+', label: 'Happy Customers' },
    { icon: <Palette className="w-8 h-8" />, value: '1000+', label: 'Portraits Created' },
    { icon: <Clock className="w-8 h-8" />, value: '5+', label: 'Years Experience' },
    { icon: <Globe className="w-8 h-8" />, value: '25+', label: 'Countries Served' },
  ]

  const values = [
    {
      icon: <Heart className="w-12 h-12" />,
      title: 'Passion for Art',
      description: 'Every stroke is made with love and dedication to create something truly special.'
    },
    {
      icon: <Shield className="w-12 h-12" />,
      title: 'Quality Guarantee',
      description: 'We stand behind our work with a 100% satisfaction guarantee on every portrait.'
    },
    {
      icon: <Award className="w-12 h-12" />,
      title: 'Professional Excellence',
      description: 'Our artists are trained professionals with years of experience in portrait art.'
    },
    {
      icon: <Star className="w-12 h-12" />,
      title: 'Customer First',
      description: 'Your vision and satisfaction are our top priorities in every project.'
    },
  ]

  const team = [
    {
      name: 'Sarah Chen',
      role: 'Lead Portrait Artist',
      experience: '8+ years',
      specialty: 'Realistic Portraits',
      description: 'Specializes in capturing the subtle emotions and expressions that make each portrait unique.'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Charcoal Specialist',
      experience: '6+ years',
      specialty: 'Dramatic Lighting',
      description: 'Expert in creating stunning contrast and depth using traditional charcoal techniques.'
    },
    {
      name: 'Emma Thompson',
      role: 'Pet Portrait Artist',
      experience: '5+ years',
      specialty: 'Animal Portraits',
      description: 'Passionate about capturing the personality and spirit of beloved pets and animals.'
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
              About Evoleotion
            </h1>
            <p className="text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed mb-12">
              We are passionate artists dedicated to transforming your cherished memories 
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
                  Our Story
                </h2>
                <div className="space-y-6 text-gray-400 leading-relaxed">
                  <p>
                    Evoleotion was born from a simple belief: that every person, every pet, 
                    and every moment deserves to be captured in its most beautiful form. 
                    What started as a passion project has grown into a trusted name in 
                    custom portrait art.
                  </p>
                  <p>
                    Our journey began with traditional pencil and charcoal techniques, 
                    passed down through generations of artists. We've combined these 
                    time-honored methods with modern technology to create a seamless 
                    experience for our customers worldwide.
                  </p>
                  <p>
                    Today, we're proud to have created over 1,000 portraits for families 
                    across 25 countries, each one telling a unique story and preserving 
                    precious memories for generations to come.
                  </p>
                </div>
              </div>
              
              <div className="relative">
                <div className="aspect-square bg-white/5 border border-white/10 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Palette className="w-24 h-24 mx-auto mb-4 text-white" />
                    <p className="text-gray-400">Artist at Work</p>
                    <p className="text-sm text-gray-500 mt-2">Creating your masterpiece</p>
                  </div>
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
                What We Stand For
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Our values guide everything we do, from the first sketch to the final delivery
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

        {/* Meet Our Team */}
        <section className="px-8 py-20 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light tracking-wider mb-4">
                Meet Our Artists
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Talented professionals who bring your vision to life with skill and passion
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <div key={index} className="text-center p-8 border border-white/10 hover:border-white/20 transition-colors rounded-lg">
                  <div className="w-24 h-24 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center">
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <h3 className="text-xl font-light mb-2">{member.name}</h3>
                  <p className="text-gray-400 mb-1">{member.role}</p>
                  <p className="text-sm text-gray-500 mb-4">{member.experience} • {member.specialty}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{member.description}</p>
                </div>
              ))}
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
                  The Art of Excellence
                </h2>
                <div className="space-y-6 text-gray-400 leading-relaxed">
                  <p>
                    Every portrait begins with careful study of your photograph. Our artists 
                    analyze lighting, composition, and emotional expression to ensure the 
                    final artwork captures not just appearance, but personality.
                  </p>
                  <p>
                    Using premium graphite pencils and professional-grade charcoal, we build 
                    layers of tone and texture. Each stroke is deliberate, each shadow 
                    carefully placed to create depth and bring your portrait to life.
                  </p>
                  <p>
                    The result is museum-quality artwork that preserves your most precious 
                    memories in a timeless medium that will be treasured for generations.
                  </p>
                </div>
                
                <div className="mt-8">
                  <a
                    href="/how-it-works"
                    className="inline-block px-8 py-3 border border-white/30 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
                  >
                    See Our Process
                  </a>
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
              Join thousands of satisfied customers who have trusted us to capture 
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