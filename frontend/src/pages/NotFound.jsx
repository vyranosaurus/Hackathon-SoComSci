import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-red-600 mb-4">404</h1>
        <h2 className="text-xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <div className="space-x-4">
          <Link 
            to="/" 
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            User Portal
          </Link>
          <Link 
            to="/hospital" 
            className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            Hospital Portal
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFound 