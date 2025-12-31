export default function TestPage() {
  return (
    <div className="min-h-screen bg-blue-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Tailwind Test
        </h1>
        <p className="text-gray-600 mb-4">
          If you can see this styled properly, Tailwind is working!
        </p>
        <button className="bg-primary-600 text-white px-4 py-2 rounded hover:bg-primary-700 transition-colors">
          Test Button
        </button>
      </div>
    </div>
  )
}