import { SignUpForm } from '@/components/auth/signup-form'
import { PageTransition } from '@/components/animations/page-transition'

export default function SignUpPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center py-12">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Create Your Account
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Join us to start creating beautiful custom portraits
              </p>
            </div>

            <SignUpForm />
          </div>
        </div>
      </div>
    </PageTransition>
  )
}