import React from 'react'

function UrgencyBadge({ urgency, small = false }) {
  const getUrgencyInfo = () => {
    switch (urgency) {
      case 'P1':
        return {
          bgColor: 'bg-red-100',
          textColor: 'text-red-800',
          label: small ? 'P1' : 'P1 - Critical'
        }
      case 'P2':
        return {
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800',
          label: small ? 'P2' : 'P2 - Urgent'
        }
      case 'P3':
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          label: small ? 'P3' : 'P3 - Standard'
        }
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          label: urgency
        }
    }
  }
  
  const { bgColor, textColor, label } = getUrgencyInfo()
  
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${bgColor} ${textColor}`}>
      {!small && (
        <span className={`h-1.5 w-1.5 rounded-full ${textColor.replace('text', 'bg')} mr-1.5`}></span>
      )}
      {label}
    </span>
  )
}

export default UrgencyBadge 