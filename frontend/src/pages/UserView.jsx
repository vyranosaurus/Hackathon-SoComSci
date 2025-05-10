import { useState } from 'react'
import ContactForm from '../components/user/ContactForm'
import EmergencyCall from '../components/user/EmergencyCall'

function UserView() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6">
      <header className="mb-6">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-blue-800">
            Medical Assistance Portal
          </h1>
          <p className="text-sm text-gray-600">
            Contact us for non-emergency medical assistance
          </p>
        </div>
      </header>
      
      <main className="max-w-md mx-auto space-y-6">
        <ContactForm />
        <div className="border-t border-gray-200 pt-6 mt-6">
          <EmergencyCall />
        </div>
      </main>
      
      <footer className="mt-12 text-center text-xs text-gray-500">
        <p>© {new Date().getFullYear()} Medical Triage System</p>
      </footer>
    </div>
  )
}

export default UserView 