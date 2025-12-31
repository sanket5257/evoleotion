import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { GSAPProvider } from '@/components/animations/gsap-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Providers } from '@/components/providers'
import { ConditionalLayout } from '@/components/layout/conditional-layout'
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
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
          </GSAPProvider>
        </Providers>
      </body>
    </html>
  )
}