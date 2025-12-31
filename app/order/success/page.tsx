import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { CheckCircle, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageTransition } from '@/components/animations/page-transition'
import { getOrderForWhatsApp } from '@/app/actions/order-actions'

interface OrderSuccessPageProps {
  searchParams: { orderId?: string }
}

async function OrderSuccessContent({ orderId }: { orderId: string }) {
  const result = await getOrderForWhatsApp(orderId)
  
  if (!result.success) {
    redirect('/order')
  }

  return (
    <div className="text-center">
      <div className="mb-8">
        <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Order Placed Successfully!
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
          Order #{result.order?.orderNumber}
        </p>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Total: ₹{result.order?.finalPrice}
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          What's Next?
        </h2>
        <div className="space-y-4 text-left">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
              1
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Complete Payment
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Click the WhatsApp button below to contact us and complete your payment.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
              2
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Artist Review
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Our artists will review your photos and start working on your portrait.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
              3
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Preview & Delivery
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We'll send you a preview for approval, then deliver your final portrait.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <a 
          href={result.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <Button size="lg" className="w-full sm:w-auto">
            <MessageCircle className="w-5 h-5 mr-2" />
            Continue to WhatsApp
          </Button>
        </a>
        
        <div className="text-sm text-gray-500 dark:text-gray-400">
          You can also contact us directly at WhatsApp for any questions.
        </div>
      </div>
    </div>
  )
}

export default function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const orderId = searchParams.orderId

  if (!orderId) {
    redirect('/order')
  }

  return (
    <PageTransition>
      <div className="min-h-screen py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container-width section-padding">
          <div className="max-w-2xl mx-auto">
            <Suspense fallback={
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading order details...</p>
              </div>
            }>
              <OrderSuccessContent orderId={orderId} />
            </Suspense>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}