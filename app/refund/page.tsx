export default function RefundPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Refund Policy</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Our Commitment</h2>
              <p className="text-gray-600 mb-4">
                We stand behind the quality of our work and want you to be completely satisfied with your portrait.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Refund Conditions</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-medium text-gray-900 mb-2">Before Physical Production</h3>
                  <p className="text-gray-600 text-sm">
                    Full refund available if you're not satisfied with the digital preview. 
                    We offer unlimited revisions until you're happy with the result.
                  </p>
                </div>
                
                <div className="border-l-4 border-yellow-500 pl-4">
                  <h3 className="font-medium text-gray-900 mb-2">After Physical Production</h3>
                  <p className="text-gray-600 text-sm">
                    Refunds are considered on a case-by-case basis for quality issues. 
                    We may offer to redo the artwork or provide a partial refund.
                  </p>
                </div>
                
                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-medium text-gray-900 mb-2">No Refund Conditions</h3>
                  <p className="text-gray-600 text-sm">
                    Custom artwork that has been approved and completed cannot be refunded 
                    unless there are quality defects in the physical product.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">How to Request a Refund</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-600">
                <li>Contact us within 7 days of receiving your order</li>
                <li>Provide your order number and reason for refund</li>
                <li>Include photos if there are quality issues</li>
                <li>We'll review and respond within 2 business days</li>
              </ol>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Processing Time</h2>
              <p className="text-gray-600">
                Approved refunds are processed within 5-7 business days and will appear on your original payment method.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Us</h2>
              <p className="text-gray-600">
                For refund requests or questions, please contact us at{' '}
                <a href="mailto:support@portraitstudio.com" className="text-blue-600 hover:underline">
                  support@portraitstudio.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}