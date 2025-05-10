import { useState, useEffect } from 'react'
import './MedicalTriageDashboard.module.css'

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


function MessageInbox({ cases, onStatusChange }) {
  const [activeConversation, setActiveConversation] = useState(null)
  const [replyText, setReplyText] = useState('')
  
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date)
  }
  
  const handleSendReply = () => {
    if (!replyText.trim() || !activeConversation) return
    
    
    alert(`Reply sent to Patient #${activeConversation.patientId}: ${replyText}`)
    
    
    if (activeConversation.status === 'new') {
      onStatusChange(activeConversation.id, 'in-progress')
    }
    
    setReplyText('')
  }
  
  if (cases.length === 0) {
    return (
      <div className="bg-gray-50 rounded-md p-6 text-center">
        <p className="text-gray-500">No messages found matching your filters.</p>
      </div>
    )
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-96">
      {}
      <div className="border border-gray-200 rounded-lg overflow-y-auto bg-white md:col-span-1">
        <div className="p-3 border-b border-gray-200">
          <h3 className="font-medium text-gray-700">Conversations</h3>
        </div>
        
        <ul className="divide-y divide-gray-200">
          {cases.map((patientCase) => (
            <li key={patientCase.id}>
              <button
                onClick={() => setActiveConversation(patientCase)}
                className={`w-full text-left p-3 hover:bg-gray-50 transition ${
                  activeConversation?.id === patientCase.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-gray-900">
                    Patient #{patientCase.patientId}
                  </span>
                  <UrgencyBadge urgency={patientCase.urgency} small />
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {patientCase.message}
                </p>
                <span className="text-xs text-gray-500">
                  {formatTimestamp(patientCase.timestamp)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      
      {}
      <div className="border border-gray-200 rounded-lg bg-white flex flex-col md:col-span-2">
        {activeConversation ? (
          <>
            <div className="p-3 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="font-medium text-gray-900">
                  Patient #{activeConversation.patientId}
                </h3>
                <span className="text-xs text-gray-500">
                  {formatTimestamp(activeConversation.timestamp)}
                </span>
              </div>
              <UrgencyBadge urgency={activeConversation.urgency} />
            </div>
            
            <div className="flex-grow overflow-y-auto p-4">
              <div className="bg-gray-100 rounded-lg p-3 mb-4 max-w-3/4">
                <p className="text-gray-800">{activeConversation.message}</p>
              </div>
              
              {}
            </div>
            
            <div className="p-3 border-t border-gray-200">
              <div className="flex">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Type your reply..."
                />
                <button
                  onClick={handleSendReply}
                  disabled={!replyText.trim()}
                  className={`ml-2 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium ${
                    !replyText.trim()
                      ? 'bg-blue-300 text-white cursor-not-allowed'
                      : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  }`}
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-grow flex items-center justify-center">
            <div className="text-center p-6">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No conversation selected</h3>
              <p className="mt-1 text-sm text-gray-500">Select a conversation from the list to view it.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


function useWindowSize() {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener('resize', handleResize)
    handleResize()
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}


function MedicalTriageDashboard() {
  const [cases, setCases] = useState([])
  const [filteredCases, setFilteredCases] = useState([])
  const [activeFilter, setActiveFilter] = useState('all')
  const { width } = useWindowSize()
  const isMobile = width < 768

  
  useEffect(() => {
    const mockCases = [
      {
        id: 1,
        message: "I've been having severe chest pain for the last hour.",
        timestamp: new Date(Date.now() - 20 * 60000).toISOString(),
        status: 'new',
        urgency: 'P1',
        patientId: 'PAT-1001'
      },
      {
        id: 2,
        message: "My child has a fever of 101°F since yesterday.",
        timestamp: new Date(Date.now() - 35 * 60000).toISOString(),
        status: 'acknowledged',
        urgency: 'P2',
        patientId: 'PAT-1002'
      },
      {
        id: 3,
        message: "I need a prescription refill for my blood pressure medication.",
        timestamp: new Date(Date.now() - 120 * 60000).toISOString(),
        status: 'in-progress',
        urgency: 'P3',
        patientId: 'PAT-1003'
      }
    ]
    
    setCases(mockCases)
    setFilteredCases(mockCases)
  }, [])

  const handleStatusChange = (caseId, newStatus) => {
    const updatedCases = cases.map(c => 
      c.id === caseId ? { ...c, status: newStatus } : c
    )
    setCases(updatedCases)
    filterCases(activeFilter, updatedCases)
  }

  const filterCases = (filter, casesToFilter = cases) => {
    setActiveFilter(filter)
    
    if (filter === 'all') {
      setFilteredCases(casesToFilter)
      return
    }
    
    if (['new', 'acknowledged', 'in-progress', 'resolved'].includes(filter)) {
      setFilteredCases(casesToFilter.filter(c => c.status === filter))
      return
    }
    
    if (['P1', 'P2', 'P3'].includes(filter)) {
      setFilteredCases(casesToFilter.filter(c => c.urgency === filter))
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-800 text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold">Hospital Triage Dashboard</h1>
          <p className="text-sm opacity-80">
            {isMobile ? 'Mobile View' : 'Desktop View'}
          </p>
        </div>
      </header>
      
      <main className="container mx-auto p-4">
        <div className={`${isMobile ? 'space-y-6' : 'grid grid-cols-12 gap-6'}`}>
          {}
          <div className={isMobile ? 'w-full' : 'col-span-3'}>
            <CaseFilters 
              activeFilter={activeFilter} 
              onFilterChange={filterCases} 
            />
          </div>
          
          {}
          <div className={isMobile ? 'w-full' : 'col-span-9'}>
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <h2 className="text-xl font-semibold mb-4">Live Case Feed</h2>
              <CasesFeed 
                cases={filteredCases} 
                onStatusChange={handleStatusChange} 
              />
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-xl font-semibold mb-4">Message Inbox</h2>
              <MessageInbox 
                cases={filteredCases} 
                onStatusChange={handleStatusChange} 
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default MedicalTriageDashboard 