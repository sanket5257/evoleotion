'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { PageTransition } from '@/components/animations/page-transition'

const errorMessages = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'The verification token has expired or has already been used.',
  Default: 'An error occurred during authentication.',
}

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error') as keyof typeof errorMessages

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="border border-white/20 p-8">
            <div className="text-center">
              <Link href="/" className="text-3xl font-light tracking-wider hover:text-gray-300 transition-colors">
                Evoleotion
              </Link>
              
              <div className="mx-auto h-12 w-12 text-red-400 mt-8">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h2 className="mt-6 text-2xl font-light tracking-wide">
                Authentication Error
              </h2>
              <p className="mt-2 text-gray-400">
                {errorMessages[error] || errorMessages.Default}
              </p>
            </div>
            
            <div className="mt-8 space-y-4">
              <Link
                href="/auth/signin"
                className="w-full flex justify-center py-3 px-4 border border-white/30 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
              >
                Try Again
              </Link>
              
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