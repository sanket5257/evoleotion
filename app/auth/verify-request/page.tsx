import Link from 'next/link'
import { PageTransition } from '@/components/animations/page-transition'

export default function VerifyRequestPage() {
  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="border border-white/20 p-8">
            <div className="text-center">
              <Link href="/" className="text-3xl font-light tracking-wider hover:text-gray-300 transition-colors">
                Evoleotion
              </Link>
              
              <div className="mx-auto h-12 w-12 text-green-400 mt-8">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              
              <h2 className="mt-6 text-2xl font-light tracking-wide">
                Check Your Email
              </h2>
              <p className="mt-2 text-gray-400">
                We've sent you a sign-in link. Please check your email and click the link to continue.
              </p>
            </div>
            
            <div className="mt-8">
              <Link
                href="/"
                className="w-full flex justify-center py-3 px-4 text-sm uppercase tracking-widest text-gray-400 hover:text-white transition-colors"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}