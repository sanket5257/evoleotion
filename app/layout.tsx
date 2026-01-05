import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { GSAPProvider } from '@/components/animations/gsap-provider'
import { Header } from '@/components/layout/header'
import { Footer } from '@/components/layout/footer'
import { Providers } from '@/components/providers'
import { ConditionalLayout } from '@/components/layout/conditional-layout'
import { ErrorBoundary } from '@/components/error-boundary'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Evoleotion - Pencil & Charcoal Portrait Studio',
  description: 'Custom pencil and charcoal portraits. Transform your cherished memories into timeless hand-drawn art with stunning detail and emotion.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ErrorBoundary>
          <Providers>
            <GSAPProvider>
              <ConditionalLayout>
                {children}
              </ConditionalLayout>
            </GSAPProvider>
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  )
}