import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './PatientDashboard.module.css'

function ContactForm() {
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [selectedHospital, setSelectedHospital] = useState('obstetrics')
  
  
  const queuedHospitals = [
    { id: 'obstetrics', name: 'Obstetrics & Gynecology - Dr. Renato Causing' },
    { id: 'cardiology', name: 'Cardiology Department - Dr. Maria Santos' },
    { id: 'general', name: 'General Hospital - Emergency Department' }
  ]
  
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!message.trim() || !selectedHospital) return
    
    setIsSubmitting(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      
      console.log(`Sending message to hospital: ${selectedHospital}`)
      console.log(`Message: ${message}`)
      
      setShowConfirmation(true)
      setMessage('')
      
      setTimeout(() => {
        setShowConfirmation(false)
      }, 5000)
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }
  
  return (
    <div className={styles["contact-card"]}>
      <h2 className={styles["card-title"]}>Contact Hospital</h2>
      
      {showConfirmation ? (
        <div className={styles["confirmation-box"]}>
          <div className={styles["confirmation-content"]}>
            <div className={styles["icon-container"]}>
              <svg className={styles["success-icon"]} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className={styles["confirmation-text"]}>
              <h3 className={styles["confirmation-title"]}>Message Sent</h3>
              <div className={styles["confirmation-message"]}>
                Your message has been sent to the hospital. A healthcare professional will respond shortly.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles["contact-form"]}>
          <div className={styles["form-group"]}>
            <label htmlFor="hospital" className={styles["form-label"]}>
              Select hospital or department
            </label>
            <select
              id="hospital"
              name="hospital"
              value={selectedHospital}
              onChange={(e) => setSelectedHospital(e.target.value)}
              className={styles["form-select"]}
              required
            >
              {queuedHospitals.map(hospital => (
                <option key={hospital.id} value={hospital.id}>
                  {hospital.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles["form-group"]}>
            <label htmlFor="message" className={styles["form-label"]}>
              Your medical concern
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={styles["form-textarea"]}
              placeholder="Describe your symptoms or concerns..."
              required
            />
          </div>
          
          <div className={styles["form-actions"]}>
            <button
              type="submit"
              disabled={isSubmitting || !message.trim()}
              className={`${styles["submit-button"]} ${isSubmitting || !message.trim() ? styles["disabled"] : ''}`}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

function EmergencyCall() {
  const [showConfirmation, setShowConfirmation] = useState(false)
  
  const handleEmergencyClick = () => {
    setShowConfirmation(true)
  }
  
  const handleCancel = () => {
    setShowConfirmation(false)
  }
  
  const handleConfirm = () => {
    alert('Emergency call would be initiated here')
    setShowConfirmation(false)
  }
  
  return (
    <div className={styles["emergency-card"]}>
      <h2 className={styles["emergency-title"]}>Emergency Services</h2>
      <p className={styles["emergency-text"]}>
        If you are experiencing a medical emergency, please call 911 immediately.
      </p>
      
      <button
        onClick={handleEmergencyClick}
        className={styles["emergency-button"]}
      >
        <svg className={styles["emergency-icon"]} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        Call 911
      </button>
      
      {showConfirmation && (
        <div className={styles["modal-overlay"]}>
          <div className={styles["modal-content"]}>
            <div className={styles["modal-icon-container"]}>
              <svg className={styles["modal-icon"]} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            
            <h3 className={styles["modal-title"]}>Emergency Call Confirmation</h3>
            
            <div className={styles["warning-box"]}>
              <p className={styles["warning-text"]}>
                This feature should only be used in true emergencies. Misuse may result in legal consequences.
              </p>
            </div>
            
            <p className={styles["modal-message"]}>
              Are you sure you want to call emergency services (911)? Only proceed if you are experiencing a genuine medical emergency.
            </p>
            
            <div className={styles["button-group"]}>
              <button
                onClick={handleCancel}
                className={styles["cancel-button"]}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={styles["confirm-button"]}
              >
                Yes, Call 911
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function MessageHistory() {
  const initialMessages = [
    {
      id: 1,
      sender: "You",
      message: "I've been having severe headaches for the past week.",
      timestamp: "4:53 PM",
      isPatient: true
    },
    {
      id: 2,
      sender: "AI Health Assistant",
      message: "I'm sorry to hear about your headaches. Persistent headaches can be concerning. Could you tell me more about the pain? For example, where is it located, how severe is it on a scale of 1-10, and are there any other symptoms?",
      timestamp: "4:53 PM", 
      isPatient: false,
      isAI: true
    },
    {
      id: 3,
      sender: "You",
      message: "The pain has improved with ibuprofen, but I still feel some discomfort.",
      timestamp: "5:53 PM",
      isPatient: true
    },
    {
      id: 4,
      sender: "AI Health Assistant",
      message: "It's good that ibuprofen has provided some relief. Since you still have discomfort, I recommend keeping track of when the headaches occur, their duration, and any potential triggers. If the headaches persist for more than a few days despite medication, please consider scheduling an appointment with your doctor for a proper evaluation.",
      timestamp: "5:53 PM",
      isPatient: false,
      isAI: true
    }
  ]
  
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [allMessages, setAllMessages] = useState(initialMessages)
  
  const formatTimestamp = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };
  
  const generateAIResponse = (message) => {
    const msg = message.toLowerCase();
    
    if (msg.includes('headache') || msg.includes('head pain') || msg.includes('migraine')) {
      if (msg.includes('severe') || msg.includes('worst') || msg.includes('unbearable')) {
        return "Your severe headache symptoms are concerning. This could potentially be a migraine or another serious condition. I recommend: 1) Rest in a quiet, dark room, 2) Apply a cold compress to your forehead, 3) Stay hydrated, and 4) Take your prescribed medication if you have any. If the pain is the worst you've ever experienced, is accompanied by fever, stiff neck, confusion, seizures, double vision, weakness, numbness, or difficulty speaking, please seek emergency medical attention immediately.";
      } else if (msg.includes('light') || msg.includes('sound') || msg.includes('sensitive')) {
        return "The sensitivity to light and sound along with your headache suggests this might be a migraine. Try to rest in a dark, quiet room and avoid screens. Over-the-counter medications like ibuprofen might help if taken early. Stay hydrated and consider tracking potential triggers like certain foods, stress, or sleep patterns. If these headaches occur regularly, a preventive treatment plan from your doctor might be beneficial.";
      } else {
        return "Headaches can be caused by various factors including stress, dehydration, or tension. Some recommendations: 1) Stay hydrated by drinking plenty of water, 2) Practice stress-reduction techniques like deep breathing or meditation, 3) Ensure you're getting enough rest, 4) Consider over-the-counter pain relievers like acetaminophen or ibuprofen following package directions. If your headaches persist for more than a week or worsen, please schedule an appointment with your healthcare provider.";
      }
    }
    
    else if (msg.includes('fever') || msg.includes('temperature') || msg.includes('hot')) {
      if (msg.includes('high') || msg.includes('103') || msg.includes('104')) {
        return "A high fever (over 103°F/39.4°C) requires prompt attention. Please take acetaminophen or ibuprofen as directed to help reduce the fever, stay hydrated, and rest. If the fever is accompanied by severe headache, rash, sensitivity to light, stiff neck, persistent vomiting, difficulty breathing, or confusion, please seek emergency medical care immediately as these could be signs of a serious condition.";
      } else if (msg.includes('child') || msg.includes('baby') || msg.includes('infant')) {
        return "Fevers in children should be monitored closely. For children over 3 months, a fever above 102°F (38.9°C) may require medical attention. For infants under 3 months, contact a doctor for any fever over 100.4°F (38°C). Keep them hydrated, dress them lightly, and use children's acetaminophen or ibuprofen as directed by a healthcare provider. Never give aspirin to children or teenagers.";
      } else {
        return "For managing a fever: 1) Rest as much as possible, 2) Stay hydrated with water, clear broths, or sports drinks, 3) Take acetaminophen or ibuprofen as directed to reduce fever, 4) Dress in lightweight clothing and use light blankets. Contact your healthcare provider if the fever persists more than three days, is above 103°F (39.4°C), or is accompanied by severe symptoms like difficulty breathing, chest or abdominal pain, or confusion.";
      }
    }
    
    else if (msg.includes('cough') || msg.includes('sore throat') || msg.includes('congestion')) {
      if (msg.includes('blood') || msg.includes('breathing') || msg.includes('breath')) {
        return "Coughing up blood or experiencing difficulty breathing requires immediate medical attention. Please contact your doctor right away or go to the emergency room. These symptoms could indicate a serious respiratory condition that needs proper evaluation and treatment.";
      } else if (msg.includes('night') || msg.includes('sleep') || msg.includes('lying down')) {
        return "For a cough that worsens at night: 1) Try elevating your head with extra pillows, 2) Use a humidifier in your bedroom, 3) Consider taking honey (if you're not allergic and over 1 year old) before bed, 4) Avoid eating close to bedtime as acid reflux can trigger coughing. If the nighttime cough persists for more than a week or is severely disrupting your sleep, please consult with your healthcare provider.";
      } else {
        return "For managing a cough: 1) Stay hydrated to help thin mucus, 2) Try honey (if you're not allergic and over 1 year old) to soothe throat irritation, 3) Use a humidifier to add moisture to the air, 4) Consider cough drops or throat lozenges to reduce coughing. If your cough lasts more than two weeks, produces thick, yellow-green or bloody mucus, or is accompanied by fever over 100.4°F (38°C), please consult your healthcare provider.";
      }
    }
    
    else if (msg.includes('stomach') || msg.includes('nausea') || msg.includes('vomit') || msg.includes('diarrhea')) {
      if (msg.includes('severe') || msg.includes('intense') || msg.includes('worst')) {
        return "Severe stomach pain requires careful attention. If the pain is intense and accompanied by fever, bloody stools, persistent vomiting, yellowing of skin/eyes, or inability to keep any fluids down, please seek immediate medical care as these could indicate appendicitis, intestinal obstruction, or other serious conditions. For less severe symptoms, try resting, avoiding solid foods temporarily, and staying hydrated with small sips of clear liquids.";
      } else if (msg.includes('food') || msg.includes('ate') || msg.includes('meal')) {
        return "Your symptoms might be related to food poisoning or a food intolerance. For mild food poisoning: 1) Rest and avoid solid foods until symptoms improve, 2) Prevent dehydration with small sips of clear liquids or oral rehydration solutions, 3) Gradually reintroduce bland foods like toast or rice as you recover. If symptoms are severe, persistent beyond 2 days, or include fever above 101°F (38.3°C), bloody stools, or severe dehydration, please seek medical attention.";
      } else {
        return "For managing stomach discomfort: 1) Drink clear fluids in small, frequent sips, 2) Temporarily avoid solid foods, dairy, caffeine, alcohol, and fatty or spicy items, 3) Try bland foods like bananas, rice, applesauce, and toast (BRAT diet) as symptoms improve, 4) Get plenty of rest. If symptoms persist beyond 2 days, are accompanied by fever over 101°F (38.3°C), severe abdominal pain, bloody stools, or signs of dehydration, please consult your healthcare provider.";
      }
    }
    
    else if (msg.includes('pain') || msg.includes('ache') || msg.includes('sore') || msg.includes('joint')) {
      if (msg.includes('back') || msg.includes('spine') || msg.includes('neck')) {
        return "For back or neck pain: 1) Apply ice for the first 48-72 hours to reduce inflammation, then switch to heat to relax muscles, 2) Take over-the-counter pain relievers like ibuprofen as directed, 3) Maintain good posture and ergonomics, 4) Gentle stretching may help once acute pain subsides. If you experience numbness, tingling, weakness in limbs, loss of bladder/bowel control, or if the pain follows an injury, please seek immediate medical attention as these could indicate serious conditions requiring prompt treatment.";
      } else if (msg.includes('exercise') || msg.includes('workout') || msg.includes('activity')) {
        return "Muscle soreness after exercise is normal and typically peaks 24-72 hours after activity (called DOMS - Delayed Onset Muscle Soreness). To manage: 1) Gentle stretching and movement, 2) Adequate hydration, 3) Over-the-counter pain relievers if necessary, 4) Proper warm-ups before future workouts. Consider incorporating rest days between intense training sessions. If pain is severe, prevents normal movement, or includes significant swelling or redness, please consult your healthcare provider.";
      } else {
        return "For general pain management: 1) Rest the affected area, 2) Apply ice to reduce inflammation (15-20 minutes several times daily), 3) Consider over-the-counter pain relievers like acetaminophen or ibuprofen following package directions, 4) Gentle stretching once acute pain subsides. If pain is severe, worsening, accompanied by unexplained weight loss, fever, or doesn't improve with home care after several days, please schedule an appointment with your healthcare provider for proper evaluation.";
      }
    }
    
    else if (msg.includes('sleep') || msg.includes('insomnia') || msg.includes('tired') || msg.includes('fatigue')) {
      return "For better sleep quality: 1) Maintain a consistent sleep schedule, even on weekends, 2) Create a relaxing bedtime routine away from screens for 30-60 minutes before bed, 3) Ensure your bedroom is cool, dark, and quiet, 4) Limit caffeine after noon and avoid large meals close to bedtime. If sleep problems persist for more than a month or significantly impact your daily functioning, consider consulting with your healthcare provider about possible underlying conditions or treatment options.";
    }
    
    else if (msg.includes('stress') || msg.includes('anxiety') || msg.includes('depress') || msg.includes('overwhelm')) {
      return "I understand that mental health challenges can be difficult. Some strategies that might help include: 1) Regular physical activity, 2) Mindfulness meditation or deep breathing exercises, 3) Maintaining social connections, 4) Establishing healthy routines. Remember that seeking help is a sign of strength. If you're experiencing persistent feelings of anxiety or depression that interfere with daily activities, please consider talking to a mental health professional who can provide proper support and treatment options.";
    }
    
    else {
      return "Thank you for sharing your health concerns. Based on the information provided, I recommend monitoring your symptoms and maintaining healthy habits including adequate hydration, proper nutrition, and sufficient rest. If your symptoms persist or worsen, please contact your healthcare provider for personalized medical advice. Is there any specific aspect of your concern you'd like me to address in more detail?";
    }
  };
  
  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return
    
    const timestamp = formatTimestamp();
    
    const userMessage = {
      id: allMessages.length + 1,
      sender: "You",
      message: newMessage,
      timestamp,
      isPatient: true
    };
    
    setAllMessages(prevMessages => [...prevMessages, userMessage]);
    setNewMessage('');
    setIsLoading(true);
    
    try {
      
      setTimeout(() => {
        
        const aiResponse = generateAIResponse(newMessage);
        
        const aiMessage = {
          id: allMessages.length + 2,
          sender: "AI Health Assistant",
          message: aiResponse,
          timestamp: formatTimestamp(),
          isPatient: false,
          isAI: true
        };
        
        setAllMessages(prevMessages => [...prevMessages, aiMessage]);
        setIsLoading(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error with AI response:', error);
      setIsLoading(false);
    }
  }
  
  return (
    <div className={styles["message-card"]}>
      <h2 className={styles["card-title"]}>Message History</h2>
      
      <div className={styles["ai-integration-notice"]}>
        <div className={styles["ai-badge"]}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"></path>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
          <span>Powered by Gemini AI</span>
        </div>
        <p>Get intelligent medical advice from our AI assistant. A healthcare professional reviews all conversations. Not a substitute for professional medical care.</p>
      </div>
      
      <div className={styles["message-container"]}>
        {allMessages.map((msg) => (
          <div 
            key={msg.id} 
            className={`${styles["message"]} ${msg.isPatient ? styles["patient-message"] : styles["doctor-message"]}`}
          >
            <div className={`${styles["message-bubble"]} ${msg.isPatient ? styles["patient-bubble"] : msg.isAI ? styles["ai-bubble"] : styles["doctor-bubble"]}`}>
              <div className={styles["message-sender"]}>{msg.sender}</div>
              <p className={styles["message-text"]}>{msg.message}</p>
              <div className={styles["message-time"]}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className={`${styles["message"]} ${styles["doctor-message"]}`}>
            <div className={`${styles["message-bubble"]} ${styles["ai-bubble"]} ${styles["typing-indicator"]}`}>
              <span className={styles["typing-dot"]}></span>
              <span className={styles["typing-dot"]}></span>
              <span className={styles["typing-dot"]}></span>
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleSendMessage} className={styles["message-form"]}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className={styles["message-input"]}
          placeholder="Describe your symptoms or ask a health question..."
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !newMessage.trim()}
          className={`${styles["send-button"]} ${(isLoading || !newMessage.trim()) ? styles["disabled"] : ''}`}
        >
          Send
        </button>
      </form>
    </div>
  )
}

function ProfileSection() {
  
  const profile = {
    name: "John Nathan Ramos",
    patientId: "PAT-1001",
    dob: "1985-05-15",
    contactNumber: "(555) 123-4567",
    email: "john.natlan@gmel.com",
    address: "123 Main St, Anytown, USA",
    photo: "https://randomuser.me/api/portraits/men/75.jpg"
  }
  
  return (
    <div className={styles["profile-card"]}>
      <div className={styles["profile-header"]}>
        <img 
          src={profile.photo} 
          alt={profile.name}
          className={styles["profile-photo"]}
        />
        <div>
          <h2 className={styles["profile-name"]}>{profile.name}</h2>
          <p className={styles["profile-id"]}>Patient ID: {profile.patientId}</p>
        </div>
      </div>
      
      <div className={styles["profile-details"]}>
        <dl className={styles["details-list"]}>
          <div className={styles["detail-item"]}>
            <dt className={styles["detail-label"]}>Date of Birth</dt>
            <dd className={styles["detail-value"]}>{profile.dob}</dd>
          </div>
          <div className={styles["detail-item"]}>
            <dt className={styles["detail-label"]}>Contact</dt>
            <dd className={styles["detail-value"]}>{profile.contactNumber}</dd>
          </div>
          <div className={styles["detail-item"]}>
            <dt className={styles["detail-label"]}>Email</dt>
            <dd className={styles["detail-value"]}>{profile.email}</dd>
          </div>
          <div className={styles["detail-item"]}>
            <dt className={styles["detail-label"]}>Address</dt>
            <dd className={styles["detail-value"]}>{profile.address}</dd>
          </div>
        </dl>
      </div>
      
      <div className={styles["profile-actions"]}>
        <button className={styles["edit-button"]}>
          Edit Profile
        </button>
      </div>
    </div>
  )
}

function QueueStatus() {
  const queueData = {
    position: 3,
    estimatedWaitTime: "15 minutes",
    department: "Obstetrics & Gynecology",
    doctor: "Dr. Renato Causing",
    appointmentTime: "2:30 PM"
  }
  
  return (
    <div className={styles["queue-card"]}>
      <h2 className={styles["card-title"]}>Your Queue Status</h2>
      
      <div className={styles["queue-status-box"]}>
        <div className={styles["queue-position"]}>
          <span className={styles["position-label"]}>Current Position</span>
          <span className={styles["position-number"]}>{queueData.position}</span>
        </div>
        <div className={styles["progress-bar-container"]}>
          <div className={styles["progress-bar"]} style={{ width: '70%' }}></div>
        </div>
        <p className={styles["wait-time"]}>Estimated wait time: {queueData.estimatedWaitTime}</p>
      </div>
      
      <div className={styles["queue-details"]}>
        <dl className={styles["details-list"]}>
          <div className={styles["detail-item"]}>
            <dt className={styles["detail-label"]}>Department</dt>
            <dd className={styles["detail-value"]}>{queueData.department}</dd>
          </div>
          <div className={styles["detail-item"]}>
            <dt className={styles["detail-label"]}>Doctor</dt>
            <dd className={styles["detail-value"]}>{queueData.doctor}</dd>
          </div>
          <div className={styles["detail-item"]}>
            <dt className={styles["detail-label"]}>Appointment Time</dt>
            <dd className={styles["detail-value"]}>{queueData.appointmentTime}</dd>
          </div>
        </dl>
      </div>
    </div>
  )
}

function PatientDashboard() {
  const [activeTab, setActiveTab] = useState('profile'); 
  const [showEmergencyConfirmation, setShowEmergencyConfirmation] = useState(false);
  
  const handleEmergencyClick = () => {
    setShowEmergencyConfirmation(true);
  }
  
  const handleCancelEmergency = () => {
    setShowEmergencyConfirmation(false);
  }
  
  const handleConfirmEmergency = () => {
    alert('Emergency call would be initiated here');
    setShowEmergencyConfirmation(false);
  }
  
  return (
    <div className={styles["dashboard-container"]}>
      <div className={styles["dashboard-content"]}>
        <header className={styles["dashboard-header"]}>
          <div className={styles["header-content"]}>
            <h1 className={styles["dashboard-title"]}>Patient Portal</h1>
            <nav>
              <ul className={styles["nav-links"]}>
                <li>
                  <Link to="/home" className={styles["back-link"]}>
                    <svg className={styles["back-icon"]} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M19 12H5"></path>
                      <path d="M12 19l-7-7 7-7"></path>
                    </svg>
                    Back
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>
        
        <div className={styles["tabs-container"]}>
          <button 
            className={`${styles["tab-button"]} ${activeTab === 'profile' ? styles["active-tab"] : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button 
            className={`${styles["tab-button"]} ${activeTab === 'messages' ? styles["active-tab"] : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages
          </button>
          <button 
            className={`${styles["tab-button"]} ${activeTab === 'contact' ? styles["active-tab"] : ''}`}
            onClick={() => setActiveTab('contact')}
          >
            Contact Hospital
          </button>
        </div>
        
        <main className={styles["dashboard-main-combined"]}>
          {activeTab === 'profile' && (
            <>
              <ProfileSection />
              <QueueStatus />
              <div className={styles["emergency-section-container"]}>
                <h2 className={styles["emergency-title"]}>Emergency Services</h2>
                <p className={styles["emergency-text"]}>
                  If you are experiencing a medical emergency, please call 911 immediately.
                </p>
                
                <button
                  onClick={handleEmergencyClick}
                  className={styles["emergency-button"]}
                >
                  <svg className={styles["emergency-icon"]} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call 911
                </button>
              </div>
              
              {showEmergencyConfirmation && (
                <div className={styles["modal-overlay"]}>
                  <div className={styles["modal-content"]}>
                    <div className={styles["modal-icon-container"]}>
                      <svg className={styles["modal-icon"]} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    
                    <h3 className={styles["modal-title"]}>Emergency Call Confirmation</h3>
                    
                    <div className={styles["warning-box"]}>
                      <p className={styles["warning-text"]}>
                        This feature should only be used in true emergencies. Misuse may result in legal consequences.
                      </p>
                    </div>
                    
                    <p className={styles["modal-message"]}>
                      Are you sure you want to call emergency services (911)? Only proceed if you are experiencing a genuine medical emergency.
                    </p>
                    
                    <div className={styles["button-group"]}>
                      <button
                        onClick={handleCancelEmergency}
                        className={styles["cancel-button"]}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmEmergency}
                        className={styles["confirm-button"]}
                      >
                        Yes, Call 911
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          
          {activeTab === 'messages' && (
            <MessageHistory />
          )}
          
          {activeTab === 'contact' && (
            <>
              <ContactForm />
              <EmergencyCall />
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default PatientDashboard 