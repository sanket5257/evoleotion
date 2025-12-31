export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Returns Policy</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Return Guidelines</h2>
              <p className="text-gray-600 mb-4">
                Due to the custom nature of our portrait artwork, returns are handled differently than standard products.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">When Returns Are Accepted</h2>
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-medium text-green-800 mb-2">✓ Quality Defects</h3>
                  <p className="text-green-700 text-sm">
                    Physical damage during shipping, printing errors, or material defects
                  </p>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-medium text-green-800 mb-2">✓ Incorrect Order</h3>
                  <p className="text-green-700 text-sm">
                    Wrong size, style, or if we made an error in production
                  </p>
                </div>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h3 className="font-medium text-red-800 mb-2">✗ Change of Mind</h3>
                  <p className="text-red-700 text-sm">
                    Custom artwork cannot be returned due to personal preference changes after approval
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Return Process</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Contact Us</h3>
                    <p className="text-gray-600 text-sm">Email us within 7 days with photos and order details</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Review & Approval</h3>
                    <p className="text-gray-600 text-sm">We'll review your case and approve eligible returns</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Return Shipping</h3>
                    <p className="text-gray-600 text-sm">We'll provide a prepaid return label for approved returns</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Resolution</h3>
                    <p className="text-gray-600 text-sm">Replacement or refund processed within 5-7 business days</p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Return Conditions</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Artwork must be in original condition</li>
                <li>Original packaging required</li>
                <li>Return must be initiated within 7 days of delivery</li>
                <li>Photos of any defects must be provided</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Alternative Solutions</h2>
              <p className="text-gray-600 mb-4">
                Before returning, we may offer:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Partial refund for minor issues</li>
                <li>Replacement artwork at no charge</li>
                <li>Store credit for future orders</li>
                <li>Professional restoration if applicable</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 mb-2">
                  <strong>Email:</strong>{' '}
                  <a href="mailto:returns@portraitstudio.com" className="text-blue-600 hover:underline">
                    returns@portraitstudio.com
                  </a>
                </p>
                <p className="text-gray-600">
                  <strong>Response Time:</strong> Within 24 hours
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}