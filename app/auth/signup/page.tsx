import { SignUpForm } from '@/components/auth/signup-form'
import { PageTransition } from '@/components/animations/page-transition'
import Link from 'next/link'

export default function SignUpPage() {
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
                Create Your Account
              </h1>
              <p className="text-gray-400">
                Join us to start creating beautiful custom portraits
              </p>
            </div>

            <SignUpForm />
            
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm">
                Already have an account?{' '}
                <Link href="/auth/signin" className="text-white hover:text-gray-300 transition-colors">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}