import { useState } from 'react'
import UrgencyBadge from './UrgencyBadge'

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

export default MessageInbox 