import { SignInForm } from '@/components/auth/signin-form'
import { PageTransition } from '@/components/animations/page-transition'
import Link from 'next/link'

export default function SignInPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-black text-white flex items-center justify-center py-12">
        <div className="max-w-md w-full mx-4">
          <div className="border border-white/20 p-8">
            <div className="text-center mb-8">
              <Link href="/" className="text-3xl font-light tracking-wider hover:text-gray-300 transition-colors">
                Evoleotion
              </Link>
              <h1 className="text-2xl font-light tracking-wide mt-8 mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-400">
                Sign in to your account to continue
              </p>
            </div>

            <SignInForm />
            
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                Don't have an account?{' '}
                <Link href="/auth/signup" className="text-white hover:text-gray-300 transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}