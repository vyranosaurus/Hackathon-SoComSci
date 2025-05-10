import { useState, useEffect } from 'react'
import MessageInbox from '../components/hospital/MessageInbox'
import CasesFeed from '../components/hospital/CasesFeed'
import CaseFilters from '../components/hospital/CaseFilters'
import useWindowSize from '../hooks/useWindowSize'

function HospitalView() {
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

export default HospitalView 