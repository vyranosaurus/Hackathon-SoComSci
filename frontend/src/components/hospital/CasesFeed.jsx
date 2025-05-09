import React from 'react'
import CaseStatusBadge from './CaseStatusBadge'
import UrgencyBadge from './UrgencyBadge'

function CasesFeed({ cases, onStatusChange }) {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date)
  }
  
  if (cases.length === 0) {
    return (
      <div className="bg-gray-50 rounded-md p-6 text-center">
        <p className="text-gray-500">No cases found matching your filters.</p>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      {cases.map((patientCase) => (
        <div 
          key={patientCase.id}
          className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center">
              <span className="font-medium text-gray-900 mr-2">
                Patient #{patientCase.patientId}
              </span>
              <UrgencyBadge urgency={patientCase.urgency} />
            </div>
            <span className="text-xs text-gray-500">
              {formatTimestamp(patientCase.timestamp)}
            </span>
          </div>
          
          <p className="text-gray-700 mb-3">{patientCase.message}</p>
          
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CaseStatusBadge status={patientCase.status} />
            
            <div className="flex flex-wrap gap-2">
              <select
                value={patientCase.status}
                onChange={(e) => onStatusChange(patientCase.id, e.target.value)}
                className="text-sm border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="new">New</option>
                <option value="acknowledged">Acknowledge</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
              
              <button className="inline-flex items-center rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                Respond
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CasesFeed 