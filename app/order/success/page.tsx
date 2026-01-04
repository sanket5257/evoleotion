import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { CheckCircle, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageTransition } from '@/components/animations/page-transition'
import { Navbar } from '@/components/layout/navbar'
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
        <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
        <h1 className="text-4xl md:text-6xl font-light tracking-wider mb-4">
          Order Placed Successfully!
        </h1>
        <p className="text-xl text-gray-400 mb-2">
          Order #{result.order?.orderNumber}
        </p>
        <p className="text-lg text-gray-400">
          Total: ₹{result.order?.finalPrice}
        </p>
      </div>

      <div className="border border-white/20 p-8 mb-8">
        <h2 className="text-2xl font-light tracking-wide mb-6">
          What's Next?
        </h2>
        <div className="space-y-6 text-left">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 border border-white/30 rounded-full flex items-center justify-center text-sm font-light mt-0.5">
              1
            </div>
            <div>
              <h3 className="font-light text-lg mb-2">
                Complete Payment
              </h3>
              <p className="text-gray-400">
                Click the WhatsApp button below to contact us and complete your payment.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 border border-white/30 rounded-full flex items-center justify-center text-sm font-light mt-0.5">
              2
            </div>
            <div>
              <h3 className="font-light text-lg mb-2">
                Artist Review
              </h3>
              <p className="text-gray-400">
                Our artists will review your photos and start working on your portrait.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 border border-white/30 rounded-full flex items-center justify-center text-sm font-light mt-0.5">
              3
            </div>
            <div>
              <h3 className="font-light text-lg mb-2">
                Preview & Delivery
              </h3>
              <p className="text-gray-400">
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
          className="inline-block px-8 py-3 bg-green-600 text-white text-sm uppercase tracking-widest hover:bg-green-700 transition-colors duration-300"
        >
          <MessageCircle className="w-5 h-5 mr-2 inline" />
          Continue to WhatsApp
        </a>
        
        <div className="text-sm text-gray-500 mt-4">
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
      <div className="min-h-screen bg-black text-white">
        <Navbar />
        
        <div className="px-8 py-16">
          <div className="max-w-2xl mx-auto">
            <Suspense fallback={
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                <p className="mt-4 text-gray-400">Loading order details...</p>
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