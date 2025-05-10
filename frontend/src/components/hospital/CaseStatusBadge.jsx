import React from 'react'

function CaseStatusBadge({ status }) {
  const getStatusInfo = () => {
    switch (status) {
      case 'new':
        return {
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-800',
          label: 'New'
        }
      case 'acknowledged':
        return {
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          label: 'Acknowledged'
        }
      case 'in-progress':
        return {
          bgColor: 'bg-indigo-100',
          textColor: 'text-indigo-800',
          label: 'In Progress'
        }
      case 'resolved':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-800',
          label: 'Resolved'
        }
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          label: status
        }
    }
  }
  
  const { bgColor, textColor, label } = getStatusInfo()
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${bgColor} ${textColor}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${textColor.replace('text', 'bg')} mr-1.5`}></span>
      {label}
    </span>
  )
}

export default CaseStatusBadge 