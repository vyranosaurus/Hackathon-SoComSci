import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown } from "lucide-react";
import BottomNavigation from "./BottomNavigation";

// Mock navigation function since we don't have react-router-dom
const mockNavigate = (path) => {
    console.log(`Navigating to: ${path}`);
  };
  
  const QueuePage = () => {
    const navigate = mockNavigate;
  
    // Hardcoded patient data
    const patients = [
      {
        id: 1,
        name: "John Pork",
        condition: "Inconsistent Heart Rhythm",
        priority: "CRITICAL",
        date: "Today",
        gender: "male"
      },
      {
        id: 2,
        name: "Patient 2",
        condition: "Persistent Heart Burn",
        priority: "URGENT",
        date: "Today",
        gender: "female"
      },
      {
        id: 3,
        name: "Tim Cheese",
        condition: "Heart Attack Survivor",
        priority: "URGENT",
        date: "Today",
        gender: "male"
      },
      {
        id: 4,
        name: "Patient 3",
        condition: "Enlargement of ventricles",
        priority: "",
        date: "Tomorrow",
        gender: "female"
      },
      {
        id: 5,
        name: "Patient 4",
        condition: "Heart Checkup",
        priority: "",
        date: "Tomorrow",
        gender: "male"
      },
      {
        id: 6,
        name: "You",
        condition: "Regular Checkup",
        priority: "",
        date: "May 7",
        gender: "male"
      },
      {
        id: 7,
        name: "Mariana Napolitani",
        condition: "Regular Checkup",
        priority: "",
        date: "May 7",
        gender: "female"
      }
    ];
  
    return (
      <div className="container">
        <header className="queue-header mt-6">
          <div className="back-arrow" onClick={() => navigate("/")}>
            <ArrowLeft size={20} color="white" />
          </div>
          <h1>Cardiology Queue</h1>
        </header>
        
        <div className="horizontal-line"></div>
        
        <ul className="patient-list">
          {patients.map((patient) => (
            <li key={patient.id} className="patient-item">
              <div className="patient-avatar">
                <img 
                  src={`/api/placeholder/40/40?text=${patient.gender === 'male' ? 'M' : 'F'}`} 
                  alt={patient.name} 
                />
                <div className="priority-indicator">!</div>
              </div>
              <div className="patient-info">
                <div className="patient-name">
                  {patient.name}
                  {patient.priority && (
                    <span className={`patient-tag ${patient.priority === "CRITICAL" ? "tag-critical" : "tag-urgent"}`}>
                      #{patient.priority}
                    </span>
                  )}
                </div>
                <div className="patient-condition">{patient.condition}</div>
              </div>
              <div className="patient-date">{patient.date}</div>
              <button 
                className="bg-red-800 text-white px-4 py-1 rounded-md font-medium"
                onClick={() => navigate(`/patient/${patient.id}`)}
              >
                View
              </button>
            </li>
          ))}
        </ul>
        
        <BottomNavigation />
      </div>
    );
  };
  
  export default QueuePage;