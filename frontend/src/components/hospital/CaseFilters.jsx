import React from 'react'

function CaseFilters({ activeFilter, onFilterChange }) {
  const statusFilters = [
    { id: 'all', label: 'All Cases' },
    { id: 'new', label: 'New', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
    { id: 'acknowledged', label: 'Acknowledged', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800' },
    { id: 'in-progress', label: 'In Progress', bgColor: 'bg-indigo-100', textColor: 'text-indigo-800' },
    { id: 'resolved', label: 'Resolved', bgColor: 'bg-green-100', textColor: 'text-green-800' },
  ]
  
  const urgencyFilters = [
    { id: 'P1', label: 'P1 - Critical', bgColor: 'bg-red-100', textColor: 'text-red-800' },
    { id: 'P2', label: 'P2 - Urgent', bgColor: 'bg-orange-100', textColor: 'text-orange-800' },
    { id: 'P3', label: 'P3 - Standard', bgColor: 'bg-gray-100', textColor: 'text-gray-800' },
  ]
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-lg font-semibold mb-3">Filters</h2>
      
      <div className="mb-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">By Status</h3>
        <div className="space-y-2">
          {statusFilters.map(filter => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition
                ${activeFilter === filter.id 
                  ? 'bg-blue-50 text-blue-700 font-medium' 
                  : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <div className="flex items-center">
                {filter.id !== 'all' && (
                  <span className={`inline-block w-2 h-2 rounded-full mr-2 ${filter.bgColor}`}></span>
                )}
                {filter.label}
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-gray-700 mb-2">By Urgency</h3>
        <div className="space-y-2">
          {urgencyFilters.map(filter => (
            <button
              key={filter.id}
              onClick={() => onFilterChange(filter.id)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition
                ${activeFilter === filter.id 
                  ? `${filter.bgColor} ${filter.textColor} font-medium` 
                  : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <div className="flex items-center">
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${filter.id === 'P1' ? 'bg-red-500' : filter.id === 'P2' ? 'bg-orange-500' : 'bg-gray-500'}`}></span>
                {filter.label}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CaseFilters 