import { useState } from 'react'

function EmergencyCall() {
  const [showConfirmation, setShowConfirmation] = useState(false)
  
  const handleEmergencyClick = () => {
    setShowConfirmation(true)
  }
  
  const handleCancel = () => {
    setShowConfirmation(false)
  }
  
  const handleConfirm = () => {

    alert('Emergency call would be initiated here')
    setShowConfirmation(false)
  }
  
  return (
    <div>
      <h2 className="text-xl font-semibold text-red-600 mb-2">Emergency Services</h2>
      <p className="text-sm text-gray-600 mb-4">
        If you are experiencing a medical emergency, please call 911 immediately.
      </p>
      
      <button
        onClick={handleEmergencyClick}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition flex items-center justify-center"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        Call 911
      </button>
      
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <div className="flex items-center justify-center mb-4 text-red-600">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h3 className="text-xl font-bold text-center mb-2">Emergency Call Confirmation</h3>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <p className="text-sm text-yellow-700">
                This feature should only be used in true emergencies. Misuse may result in legal consequences.
              </p>
            </div>
            
            <p className="text-gray-600 mb-4 text-sm">
              Are you sure you want to call emergency services (911)? Only proceed if you are experiencing a genuine medical emergency.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={handleCancel}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition"
              >
                Yes, Call 911
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EmergencyCall 