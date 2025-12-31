export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shipping Information</h1>
          
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Delivery Process</h2>
              <p className="text-gray-600 mb-4">
                Our portrait delivery process is designed to ensure your artwork arrives safely and on time.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Digital preview sent within 5-7 business days</li>
                <li>Physical artwork shipped after approval</li>
                <li>Secure packaging to protect your portrait</li>
                <li>Tracking information provided</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Shipping Options</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Standard Shipping</h3>
                  <p className="text-gray-600 text-sm mb-2">7-10 business days</p>
                  <p className="text-gray-600 text-sm">Free for orders over ₹3,000</p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Express Shipping</h3>
                  <p className="text-gray-600 text-sm mb-2">3-5 business days</p>
                  <p className="text-gray-600 text-sm">Additional ₹200</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Packaging</h2>
              <p className="text-gray-600">
                All portraits are carefully packaged with protective materials to ensure they arrive in perfect condition. 
                We use acid-free backing boards and protective sleeves for all artwork.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}