import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { CheckCircle, MessageCircle, AlertCircle, RefreshCw } from 'lucide-react'
import { PageTransition } from '@/components/animations/page-transition'
import { Navbar } from '@/components/layout/navbar'
import { getOrderForWhatsApp } from '@/app/actions/order-actions'
import { ErrorBoundary } from '@/components/error-boundary'

interface OrderSuccessPageProps {
  searchParams: { orderId?: string }
}

async function OrderSuccessContent({ orderId }: { orderId: string }) {
  try {
    if (!orderId || typeof orderId !== 'string') {
      redirect('/order')
    }

    const result = await getOrderForWhatsApp(orderId)
    
    if (!result?.success) {
      return (
        <div className="text-center">
          <AlertCircle className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-light tracking-wider mb-4">
            Order Processing
          </h1>
          <p className="text-xl text-gray-400 mb-8">
            We're having trouble loading your order details, but your order was received successfully.
          </p>
          
          <div className="border border-yellow-500/20 bg-yellow-500/10 p-8 mb-8">
            <h2 className="text-2xl font-light tracking-wide mb-4">
              What to do next:
            </h2>
            <div className="space-y-4 text-left">
              <p className="text-gray-300">
                • Your order has been submitted successfully
              </p>
              <p className="text-gray-300">
                • We will contact you shortly via email or phone
              </p>
              <p className="text-gray-300">
                • You can also contact us directly for immediate assistance
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  if (typeof window !== 'undefined') {
                    window.location.reload()
                  }
                }
              }}
              onMouseDown={() => {
                if (typeof window !== 'undefined') {
                  window.location.reload()
                }
              }}
              className="inline-block px-8 py-3 border border-white/30 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300 mr-4 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 mr-2 inline" />
              Try Again
            </div>
            
            <a 
              href="/contact"
              className="inline-block px-8 py-3 bg-white text-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors duration-300"
            >
              Contact Us
            </a>
          </div>
        </div>
      )
    }

    const order = result.order || { orderNumber: null, finalPrice: null }
    const whatsappUrl = result.whatsappUrl || '/contact'

    return (
      <div className="text-center">
        <div className="mb-8">
          <CheckCircle className="w-20 h-20 text-green-400 mx-auto mb-6" />
          <h1 className="text-4xl md:text-6xl font-light tracking-wider mb-4">
            Order Placed Successfully!
          </h1>
          {order.orderNumber && (
            <p className="text-xl text-gray-400 mb-2">
              Order #{order.orderNumber}
            </p>
          )}
          {typeof order.finalPrice === 'number' && order.finalPrice > 0 && (
            <p className="text-lg text-gray-400">
              Total: ₹{order.finalPrice.toLocaleString()}
            </p>
          )}
        </div>

        <div className="border border-white/20 p-8 mb-8">
          <h2 className="text-2xl font-light tracking-wide mb-6">
            What's Next?
          </h2>
          <div className="space-y-6 text-left">
            <div className="flex items-start space-x-4">
              <div className="w-8 h-8 border border-white/30 rounded-full flex items-center justify-center text-sm font-light mt-0.5 flex-shrink-0">
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
              <div className="w-8 h-8 border border-white/30 rounded-full flex items-center justify-center text-sm font-light mt-0.5 flex-shrink-0">
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
              <div className="w-8 h-8 border border-white/30 rounded-full flex items-center justify-center text-sm font-light mt-0.5 flex-shrink-0">
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
          {whatsappUrl.startsWith('https://wa.me/') ? (
            <a 
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 bg-green-600 text-white text-sm uppercase tracking-widest hover:bg-green-700 transition-colors duration-300"
            >
              <MessageCircle className="w-5 h-5 mr-2 inline" />
              Continue to WhatsApp
            </a>
          ) : (
            <a 
              href="/contact"
              className="inline-block px-8 py-3 bg-white text-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors duration-300"
            >
              Contact Us
            </a>
          )}
          
          <div className="text-sm text-gray-500 mt-4">
            You can also contact us directly for any questions about your order.
          </div>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Order success page error:', error)
    
    return (
      <div className="text-center">
        <AlertCircle className="w-20 h-20 text-red-400 mx-auto mb-6" />
        <h1 className="text-4xl md:text-6xl font-light tracking-wider mb-4">
          Order Received
        </h1>
        <p className="text-xl text-gray-400 mb-8">
          Your order was submitted successfully, but we're having trouble loading the details.
        </p>
        
        <div className="border border-red-500/20 bg-red-500/10 p-8 mb-8">
          <h2 className="text-2xl font-light tracking-wide mb-4">
            Don't worry!
          </h2>
          <div className="space-y-4 text-left">
            <p className="text-gray-300">
              • Your order has been received and saved
            </p>
            <p className="text-gray-300">
              • We will contact you within 24 hours
            </p>
            <p className="text-gray-300">
              • You can contact us directly if you have any concerns
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <a 
            href="/contact"
            className="inline-block px-8 py-3 bg-white text-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors duration-300"
          >
            Contact Us
          </a>
          
          <br />
          
          <a 
            href="/dashboard"
            className="inline-block px-8 py-3 border border-white/30 text-sm uppercase tracking-widest hover:bg-white hover:text-black transition-colors duration-300"
          >
            View My Orders
          </a>
        </div>
      </div>
    )
  }
}

export default function OrderSuccessPage({ searchParams }: OrderSuccessPageProps) {
  const orderId = searchParams?.orderId

  if (!orderId || typeof orderId !== 'string') {
    redirect('/order')
  }

  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen bg-black text-white">
          <Navbar />
          <div className="px-8 py-16">
            <div className="max-w-2xl mx-auto text-center">
              <AlertCircle className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
              <h1 className="text-4xl md:text-6xl font-light tracking-wider mb-4">
                Order Submitted
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                Your order was received successfully. We'll contact you soon!
              </p>
              <a 
                href="/contact"
                className="inline-block px-8 py-3 bg-white text-black text-sm uppercase tracking-widest hover:bg-gray-200 transition-colors duration-300"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      }
    >
      <PageTransition>
        <div className="min-h-screen bg-black text-white">
          <Navbar />
          
          <div className="px-8 py-16">
            <div className="max-w-2xl mx-auto">
              <Suspense fallback={
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                  <p className="text-gray-400">Loading order details...</p>
                </div>
              }>
                <OrderSuccessContent orderId={orderId} />
              </Suspense>
            </div>
          </div>
        </div>
      </PageTransition>
    </ErrorBoundary>
  )
}