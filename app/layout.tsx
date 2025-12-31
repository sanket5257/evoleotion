import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { GSAPProvider } from '@/components/animations/gsap-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Providers } from '@/components/providers'
import { SessionDebug } from '@/components/debug/session-debug'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PortraitStudio - Custom Portrait Art',
  description: 'Transform your photos into stunning custom portraits with our professional artists.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <GSAPProvider>
            <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
              <Header />
              <main className="pt-16">
                {children}
              </main>
              <Footer />
              <SessionDebug />
            </div>
          </GSAPProvider>
        </Providers>
      </body>
    </html>
  )
}