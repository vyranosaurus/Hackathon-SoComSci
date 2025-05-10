import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaSearch, 
  FaSort, 
  FaFilter, 
  FaEllipsisV, 
  FaUserPlus, 
  FaBell, 
  FaCheckCircle,
  FaExclamationTriangle,
  FaUserMd,
  FaCalendarAlt,
  FaClock,
  FaRobot,
  FaBrain,
  FaLightbulb,
  FaSync,
  FaTimes,
  FaSpinner,
  FaMoneyBillWave,
  FaHandHoldingHeart
} from 'react-icons/fa';
import styles from './HospitalDashboard.module.css';

const HospitalDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hospitalName = location.state?.hospitalName || 'Hospital Dashboard';
  const isFree = location.state?.isFree || false; 
  
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all'); 
  const [timeDisplayMode, setTimeDisplayMode] = useState('waiting');
  const [aiInsight, setAiInsight] = useState('');
  const [aiInsightLoading, setAiInsightLoading] = useState(false);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientDetailsModal, setShowPatientDetailsModal] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    condition: '',
    bookingType: 'Walk-in'
  });
  const [addingPatient, setAddingPatient] = useState(false);
  const [processingAI, setProcessingAI] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const mockPatients = [
    {
      id: 1,
      name: 'Juan Dela Cruz',
      status: 'Critical',
      time: '08:30 AM',
      waitTime: '10 mins',
      age: 65,
      condition: 'Chest Pain',
      bookingDate: '2023-07-15',
      bookingType: 'Emergency',
      aiScore: 92,
      aiNotes: 'Potential cardiac event. Elevated risk factors detected.'
    },
    {
      id: 2,
      name: 'Maria Santos',
      status: 'Critical',
      time: '09:15 AM',
      waitTime: '15 mins',
      age: 45,
      condition: 'Severe Headache',
      bookingDate: '2023-07-15',
      bookingType: 'Urgent Care',
      aiScore: 87,
      aiNotes: 'Symptoms consistent with migraine or potential neurological condition.'
    },
    {
      id: 3,
      name: 'Pedro Reyes',
      status: 'Normal',
      time: '08:45 AM',
      waitTime: '30 mins',
      age: 35,
      condition: 'Fever',
      bookingDate: '2023-07-15',
      bookingType: 'Walk-in',
      aiScore: 65,
      aiNotes: 'Mild fever with no critical symptoms.'
    },
    {
      id: 4,
      name: 'Ana Gonzales',
      status: 'Normal',
      time: '10:00 AM',
      waitTime: '45 mins',
      age: 28,
      condition: 'Consultation',
      bookingDate: '2023-07-15',
      bookingType: 'Appointment',
      aiScore: 45,
      aiNotes: 'Routine check-up, no urgent concerns.'
    },
    {
      id: 5,
      name: 'Roberto Lim',
      status: 'Critical',
      time: '09:30 AM',
      waitTime: '5 mins',
      age: 72,
      condition: 'Difficulty Breathing',
      bookingDate: '2023-07-15',
      bookingType: 'Emergency',
      aiScore: 95,
      aiNotes: 'Respiratory distress with age as complicating factor. High priority.'
    },
    {
      id: 6,
      name: 'Sofia Cruz',
      status: 'Normal',
      time: '11:15 AM',
      waitTime: '60 mins',
      age: 8,
      condition: 'Cough and Cold',
      bookingDate: '2023-07-15',
      bookingType: 'Walk-in',
      aiScore: 58,
      aiNotes: 'Pediatric case with mild symptoms. Monitor for fever development.'
    },
    {
      id: 7,
      name: 'Carlos Bautista',
      status: 'Normal',
      time: '01:30 PM',
      waitTime: '90 mins',
      age: 42,
      condition: 'Regular Check-up',
      bookingDate: '2023-07-15',
      bookingType: 'Appointment',
      aiScore: 30,
      aiNotes: 'Routine appointment, stable condition.'
    }
  ];

  const mockAiInsights = [
    "Gemini AI has prioritized Roberto Lim due to respiratory distress in combination with advanced age.",
    "Current queue efficiency is at 78%. 3 patients with critical status have been prioritized.",
    "Based on historical patterns, expect 4 more urgent cases within the next hour.",
    "Gemini AI recommends allocating additional staff to handle respiratory cases today.",
    "Patient Juan Dela Cruz shows symptoms consistent with cardiac issues - cardiac specialist notification suggested.",
    "Queue optimization has reduced average critical patient wait time by 12 minutes."
  ];

  const criticalConditions = [
    'chest pain', 'heart attack', 'stroke', 'difficulty breathing', 'severe bleeding',
    'trauma', 'head injury', 'seizure', 'unconscious', 'unresponsive', 'severe pain',
    'overdose', 'poisoning', 'severe allergic', 'anaphylaxis', 'broken bone',
    'fracture', 'severe burn', 'labor', 'pregnancy complication'
  ];

  const sampleNotifications = [
    {
      id: 1,
      title: "Critical Patient Alert",
      message: "New critical patient added: Juan Dela Cruz",
      timestamp: "Just now",
      isRead: false,
      type: "critical"
    },
    {
      id: 2,
      title: "AI Insight Update",
      message: "Gemini AI recommends allocating additional staff today",
      timestamp: "5 min ago",
      isRead: false,
      type: "ai"
    },
    {
      id: 3,
      title: "Queue Update",
      message: "3 new patients added to queue in the last hour",
      timestamp: "30 min ago",
      isRead: true,
      type: "info"
    },
    {
      id: 4,
      title: "System Update",
      message: "Hospital Dashboard has been updated to v2.0",
      timestamp: "1 hour ago",
      isRead: true,
      type: "system"
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setPatients(mockPatients);
      setLoading(false);
      generateAiInsight();
    }, 800);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setNotifications(sampleNotifications);
      setUnreadCount(sampleNotifications.filter(n => !n.isRead).length);
    }, 1000);
  }, []);

  const generateAiInsight = () => {
    setAiInsightLoading(true);
    
    setAiInsight('');
    
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * mockAiInsights.length);
      const randomInsight = mockAiInsights[randomIndex];
      setAiInsight(randomInsight);
      
      addNotification({
        title: "New AI Insight",
        message: randomInsight,
        type: "ai"
      });
      
      setAiInsightLoading(false);
    }, 1200);
  };

  const handleRefreshInsight = (e) => {
    e.preventDefault();
    generateAiInsight();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPatient(prev => ({ ...prev, [name]: value }));
  };

  const processPatientWithAI = (patientData) => {
    setProcessingAI(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const condition = patientData.condition.toLowerCase();
        const age = parseInt(patientData.age);
        
        const isCriticalCondition = criticalConditions.some(cc => condition.includes(cc));
        
        const ageFactor = age > 65 ? 20 : (age < 12 ? 15 : 0);
        
        const bookingTypeFactor = 
          patientData.bookingType === 'Emergency' ? 40 :
          patientData.bookingType === 'Urgent Care' ? 25 :
          patientData.bookingType === 'Walk-in' ? 10 : 5;
        
        let aiScore = bookingTypeFactor + ageFactor + (isCriticalCondition ? 35 : 0);
        
        aiScore = Math.min(Math.max(aiScore, 30), 98);
        
        const status = aiScore > 75 ? 'Critical' : 'Normal';
        
        const waitMinutes = status === 'Critical' ? 
          Math.floor(Math.random() * 15) + 5 : 
          Math.floor(Math.random() * 60) + 30;
        
        let aiNotes = '';
        if (status === 'Critical') {
          if (age > 65) {
            aiNotes = `${condition} with advanced age as a complicating factor. Prioritized for immediate attention.`;
          } else if (age < 12) {
            aiNotes = `Pediatric case with ${condition}. Prioritized due to young age and symptoms.`;
          } else {
            aiNotes = `Priority case due to ${condition}. Immediate medical attention recommended.`;
          }
        } else {
          if (age > 65) {
            aiNotes = `${condition} being monitored with attention to age-related factors.`;
          } else if (age < 12) {
            aiNotes = `Pediatric case with ${condition}. Standard protocols for pediatric care applied.`;
          } else {
            aiNotes = `Standard case of ${condition} with normal priority assignment.`;
          }
        }
        
        const now = new Date();
        const hours = now.getHours();
        const minutes = Math.floor(now.getMinutes() / 15) * 15; 
        const time = `${hours % 12 || 12}:${minutes.toString().padStart(2, '0')} ${hours >= 12 ? 'PM' : 'AM'}`;
        
        const today = new Date().toISOString().split('T')[0];
        
        const processedPatient = {
          ...patientData,
          status,
          aiScore,
          aiNotes,
          time,
          waitTime: `${waitMinutes} mins`,
          bookingDate: today
        };
        
        setProcessingAI(false);
        resolve(processedPatient);
      }, 2000); 
    });
  };

  const toggleNotifications = () => {
    console.log("Toggling notifications", { current: showNotifications });
    
    setShowNotifications(prevState => {
      console.log("Setting showNotifications to:", !prevState);
      return !prevState;
    });
    
    if (!showNotifications) {
      console.log("Marking all notifications as read");
      const updatedNotifications = notifications.map(notification => ({
        ...notification,
        isRead: true
      }));
      
      setNotifications(updatedNotifications);
      setUnreadCount(0);
    }
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: notifications.length + 1,
      timestamp: "Just now",
      isRead: false,
      ...notification
    };
    
    setNotifications(prevNotifications => 
      [newNotification, ...prevNotifications]
    );
    
    setUnreadCount(prev => prev + 1);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const removeNotification = (id) => {
    const updatedNotifications = notifications.filter(
      notification => notification.id !== id
    );
    
    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.filter(n => !n.isRead).length);
  };


  const handleAddPatient = async (e) => {
    e.preventDefault();
    setAddingPatient(true);
    
    try {
      if (!newPatient.name || !newPatient.age || !newPatient.condition) {
        alert("Please fill in all required fields");
        setAddingPatient(false);
        return;
      }
      
      const processedPatient = await processPatientWithAI(newPatient);
      
      const newPatientWithId = {
        ...processedPatient,
        id: patients.length + 1,
      };
      
      setPatients(prev => [...prev, newPatientWithId]);
      
      if (processedPatient.status === 'Critical') {
        addNotification({
          title: "Critical Patient Alert",
          message: `New critical patient added: ${processedPatient.name}`,
          type: "critical"
        });
      } else {
        addNotification({
          title: "New Patient Added",
          message: `${processedPatient.name} has been added to the queue`,
          type: "info"
        });
      }
      
      generateAiInsight();
      
      setNewPatient({
        name: '',
        age: '',
        condition: '',
        bookingType: 'Walk-in'
      });
      setShowAddPatientModal(false);
    } catch (error) {
      console.error("Error adding patient:", error);
      alert("Failed to add patient. Please try again.");
    } finally {
      setAddingPatient(false);
    }
  };

  const sortedPatients = [...patients].sort((a, b) => {



    if (a.aiScore > b.aiScore) return -1;
    if (a.aiScore < b.aiScore) return 1;
    
    if (a.status === 'Critical' && b.status !== 'Critical') return -1;
    if (a.status !== 'Critical' && b.status === 'Critical') return 1;
    
    return a.time.localeCompare(b.time);
  });

  const filteredPatients = sortedPatients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && patient.status.toLowerCase() === activeTab.toLowerCase();
  });

  const getTotalsByStatus = () => {
    const critical = patients.filter(p => p.status === 'Critical').length;
    const normal = patients.filter(p => p.status === 'Normal').length;
    
    return {
      all: patients.length,
      critical,
      normal
    };
  };

  const totals = getTotalsByStatus();

  const toggleTimeDisplayMode = () => {
    setTimeDisplayMode(prev => prev === 'waiting' ? 'schedule' : 'waiting');
  };

  const viewPatientDetails = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDetailsModal(true);
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <button className={styles.backButton} onClick={() => navigate(-1)}>
              <FaArrowLeft />
            </button>
            <div>
              <h1 className={styles.headerTitle}>
                <span className={styles.headerHighlight}>We</span><span className="ai-highlight">AI</span><span className={styles.headerHighlight}>d</span> Hospital
              </h1>
              <p className={styles.headerSubtitle}>{hospitalName}</p>
              {}
              {isFree ? (
                <span className={styles.freeServicesBadge}>
                  <FaHandHoldingHeart className={styles.freeServicesIcon} />
                  Free Services Available
                </span>
              ) : (
                <span className={styles.paidServicesBadge}>
                  <FaMoneyBillWave className={styles.paidServicesIcon} />
                  No Free Services
                </span>
              )}
            </div>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.iconButton} onClick={toggleNotifications}>
              <FaBell />
              {unreadCount > 0 && (
                <span className={styles.notificationIndicator}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {}
      {showNotifications && (
        <div className={styles.notificationsPanel}>
          <div className={styles.notificationsHeader}>
            <h3 className={styles.notificationsTitle}>Notifications</h3>
            <button 
              className={styles.clearAllButton}
              onClick={clearAllNotifications}
              disabled={notifications.length === 0}
            >
              Clear All
            </button>
          </div>
          
          {notifications.length === 0 ? (
            <div className={styles.emptyNotifications}>
              No notifications at this time
            </div>
          ) : (
            <ul className={styles.notificationsList}>
              {notifications.map(notification => (
                <li 
                  key={notification.id} 
                  className={`${styles.notificationItem} ${!notification.isRead ? styles.unreadNotification : ''} ${styles[notification.type]}`}
                >
                  <h4 className={styles.notificationTitle}>{notification.title}</h4>
                  <p className={styles.notificationMessage}>{notification.message}</p>
                  <span className={styles.notificationTime}>{notification.timestamp}</span>
                  <button 
                    className={styles.removeNotification} 
                    onClick={() => removeNotification(notification.id)}
                  >
                    <FaTimes />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {}
      <div className={styles.aiInsightSection}>
        <div className={styles.aiInsightHeader}>
          <div className={styles.aiLogo}>
            <FaBrain />
          </div>
          <h3 className={styles.aiInsightTitle}>Gemini AI Insight</h3>
          <button 
            className={styles.refreshButton} 
            onClick={handleRefreshInsight}
            disabled={aiInsightLoading}
          >
            <FaSync className={aiInsightLoading ? styles.rotating : ''} />
          </button>
        </div>
        <div className={styles.aiInsightContent}>
          {aiInsightLoading ? (
            <div className={styles.aiInsightLoading}>
              <div className={styles.typingIndicator}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          ) : (
            <p className={styles.aiInsightText}>
              <FaLightbulb className={styles.insightIcon} />
              {aiInsight}
            </p>
          )}
        </div>
      </div>

      {}
      <div className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <button 
            className={`${styles.statCard} ${activeTab === 'all' ? styles.statCardAllActive : styles.statCardAll}`}
            onClick={() => setActiveTab('all')}
          >
            <p className={styles.statLabel}>All Patients</p>
            <p className={styles.statValue}>{totals.all}</p>
          </button>
          <button 
            className={`${styles.statCard} ${activeTab === 'critical' ? styles.statCardCriticalActive : styles.statCardCritical}`}
            onClick={() => setActiveTab('critical')}
          >
            <p className={styles.statLabel}>Critical</p>
            <p className={styles.statValue}>{totals.critical}</p>
          </button>
          <button 
            className={`${styles.statCard} ${activeTab === 'normal' ? styles.statCardNormalActive : styles.statCardNormal}`}
            onClick={() => setActiveTab('normal')}
          >
            <p className={styles.statLabel}>Normal</p>
            <p className={styles.statValue}>{totals.normal}</p>
          </button>
        </div>
      </div>

      {}
      <div className={styles.searchContainer}>
        <div className={styles.searchInputWrapper}>
          <input
            type="text"
            placeholder="Search patients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <FaSearch className={styles.searchIcon} />
          <div className={styles.actionsContainer}>
            <button 
              className={styles.actionButton} 
              onClick={toggleTimeDisplayMode}
              title={timeDisplayMode === 'waiting' ? "Show schedule time" : "Show waiting time"}
            >
              <FaClock />
            </button>
            <button className={styles.actionButton}>
              <FaSort />
            </button>
            <button className={styles.actionButton}>
              <FaFilter />
            </button>
          </div>
        </div>
      </div>

      {}
      <div className={styles.patientsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            Patient Queue 
            <span className={styles.aiPoweredBadge}>
              <FaRobot className={styles.aiIcon} />
              AI-Optimized
            </span>
          </h2>
          <p className={styles.dateDisplay}>Today, {new Date().toLocaleDateString()}</p>
        </div>
        
        {loading ? (
          <div className={styles.loadingContainer}>
            <div className={styles.spinner}></div>
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className={styles.emptyState}>
            <FaCheckCircle className={styles.emptyStateIcon} />
            <p className={styles.emptyStateMessage}>No patients found</p>
            {searchTerm && <p className={styles.emptyStateHint}>Try a different search term</p>}
          </div>
        ) : (
          <div className={styles.patientsList}>
            {filteredPatients.map(patient => (
              <div key={patient.id} className={`${styles.patientCard} ${patient.status === 'Critical' ? styles.criticalPatientCard : ''}`}>
                <div className={styles.patientHeader}>
                  <div className={styles.patientInfo}>
                    <div className={`${styles.patientAvatar} ${patient.status === 'Critical' ? styles.criticalAvatar : ''}`}>
                      {patient.name.charAt(0)}
                    </div>
                    <div className={styles.patientDetails}>
                      <h3 className={styles.patientName}>
                        {patient.name}
                      </h3>
                      <p className={styles.patientCondition}>
                        {patient.age} years • {patient.condition}
                      </p>
                      <div className={styles.aiScoreContainer}>
                        <div 
                          className={styles.aiScoreBar} 
                          style={{ width: `${patient.aiScore}%` }}
                        ></div>
                        <span className={styles.aiScoreLabel}>
                          <FaRobot className={styles.aiScoreIcon} /> 
                          {patient.aiScore}% Urgency
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.patientMeta}>
                    <span className={`${styles.statusBadge} ${patient.status === 'Critical' ? styles.criticalBadge : styles.normalBadge}`}>
                      {patient.status === 'Critical' && <FaExclamationTriangle className={styles.statusIcon} />}
                      {patient.status}
                    </span>
                    <span className={styles.patientTime}>
                      {timeDisplayMode === 'waiting' ? (
                        <>
                          <FaClock className={styles.timeIcon} />
                          {patient.waitTime} wait
                        </>
                      ) : (
                        <>
                          <FaCalendarAlt className={styles.timeIcon} />
                          {patient.time}
                        </>
                      )}
                    </span>
                    <span className={styles.bookingType}>
                      <FaUserMd className={styles.bookingIcon} />
                      {patient.bookingType}
                    </span>
                  </div>
                </div>
                <div className={styles.aiNotesSection}>
                  <p className={styles.aiNotes}>
                    <FaBrain className={styles.aiNotesIcon} />
                    <span>{patient.aiNotes}</span>
                  </p>
                </div>
                <div className={styles.patientFooter}>
                  <span className={styles.patientId}>ID: #{patient.id.toString().padStart(4, '0')}</span>
                  <button className={styles.viewDetailsButton} onClick={() => viewPatientDetails(patient)}>
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {}
      <button 
        className={styles.fab}
        onClick={() => setShowAddPatientModal(true)}
      >
        <FaUserPlus size={20} />
      </button>

      {}
      {showAddPatientModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                Add New Patient
                <span className={styles.aiPoweredBadge}>
                  <FaRobot className={styles.aiIcon} />
                  AI-Assisted
                </span>
              </h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowAddPatientModal(false)}
                disabled={addingPatient}
              >
                <FaTimes />
              </button>
            </div>
            
            <form onSubmit={handleAddPatient}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Patient Name *</label>
                <input
                  type="text"
                  name="name"
                  value={newPatient.name}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="Enter patient name"
                  required
                  disabled={addingPatient}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Age *</label>
                <input
                  type="number"
                  name="age"
                  value={newPatient.age}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="Enter patient age"
                  min="0"
                  max="120"
                  required
                  disabled={addingPatient}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Condition/Symptoms *</label>
                <input
                  type="text"
                  name="condition"
                  value={newPatient.condition}
                  onChange={handleInputChange}
                  className={styles.formInput}
                  placeholder="Describe the condition or symptoms"
                  required
                  disabled={addingPatient}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Booking Type</label>
                <select
                  name="bookingType"
                  value={newPatient.bookingType}
                  onChange={handleInputChange}
                  className={styles.formSelect}
                  disabled={addingPatient}
                >
                  <option value="Walk-in">Walk-in</option>
                  <option value="Appointment">Appointment</option>
                  <option value="Urgent Care">Urgent Care</option>
                  <option value="Emergency">Emergency</option>
                </select>
              </div>
              
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowAddPatientModal(false)}
                  disabled={addingPatient}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.submitButton}
                  disabled={addingPatient}
                >
                  {addingPatient ? (
                    <>
                      {processingAI ? 'AI Analyzing...' : 'Adding...'}
                      <FaSpinner className={styles.loadingSpinner} />
                    </>
                  ) : (
                    <>
                      Add Patient
                      <FaUserPlus className={styles.buttonIcon} />
                    </>
                  )}
                </button>
              </div>
            </form>
            
            {processingAI && (
              <div className={styles.aiProcessingContainer}>
                <div className={styles.aiProcessingContent}>
                  <FaBrain className={styles.aiProcessingIcon} />
                  <p className={styles.aiProcessingText}>
                    Gemini AI is analyzing patient data...
                  </p>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {}
      {showPatientDetailsModal && selectedPatient && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>
                Patient Details
                <span className={`${styles.statusBadge} ${selectedPatient.status === 'Critical' ? styles.criticalBadge : styles.normalBadge}`}>
                  {selectedPatient.status === 'Critical' ? (
                    <FaExclamationTriangle className={styles.statusIcon} />
                  ) : (
                    <FaCheckCircle className={styles.statusIcon} />
                  )}
                  {selectedPatient.status}
                </span>
              </h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowPatientDetailsModal(false)}
              >
                <FaTimes />
              </button>
            </div>
            
            <div className={styles.patientDetailsContent}>
              <div className={styles.patientDetailHeader}>
                <div className={`${styles.patientAvatar} ${selectedPatient.status === 'Critical' ? styles.criticalAvatar : ''}`}>
                  {selectedPatient.name.charAt(0)}
                </div>
                <div className={styles.patientDetailName}>
                  <h4>{selectedPatient.name}</h4>
                  <p>ID: #{selectedPatient.id.toString().padStart(4, '0')}</p>
                </div>
              </div>
              
              <div className={styles.patientDetailsGrid}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Age</span>
                  <span className={styles.detailValue}>{selectedPatient.age} years</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Condition</span>
                  <span className={styles.detailValue}>{selectedPatient.condition}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Booking Type</span>
                  <span className={styles.detailValue}>{selectedPatient.bookingType}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Booking Date</span>
                  <span className={styles.detailValue}>{selectedPatient.bookingDate}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Time</span>
                  <span className={styles.detailValue}>{selectedPatient.time}</span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Wait Time</span>
                  <span className={styles.detailValue}>{selectedPatient.waitTime}</span>
                </div>
              </div>
              
              <div className={styles.aiScoreSection}>
                <h4 className={styles.sectionTitle}>
                  <FaRobot className={styles.sectionIcon} />
                  AI Urgency Score
                </h4>
                <div className={styles.aiScoreContainer}>
                  <div 
                    className={styles.aiScoreBar} 
                    style={{width: `${selectedPatient.aiScore}%`}}
                  ></div>
                </div>
                <div className={styles.aiScoreLabel}>
                  <FaBrain className={styles.aiScoreIcon} />
                  {selectedPatient.aiScore}% Urgency Level
                </div>
              </div>
              
              <div className={styles.aiNotesSection}>
                <h4 className={styles.sectionTitle}>
                  <FaLightbulb className={styles.sectionIcon} />
                  AI Analysis Notes
                </h4>
                <p className={styles.aiNotes}>
                  <FaRobot className={styles.aiNotesIcon} />
                  {selectedPatient.aiNotes}
                </p>
              </div>
              
              <div className={styles.actionButtonsContainer}>
                <button className={styles.actionButton}>
                  <FaUserMd className={styles.actionIcon} />
                  Assign Doctor
                </button>
                <button className={styles.prioritizeButton}>
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalDashboard; 