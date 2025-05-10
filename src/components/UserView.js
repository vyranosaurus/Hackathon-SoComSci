import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from './UserView.module.css';

function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [messageType, setMessageType] = useState("hospital"); 

  const handleSubmit = (e) => {
    e.preventDefault();
    
    setShowConfirmation(true);
    
    setTimeout(() => {
      setName("");
      setEmail("");
      setMessage("");
      setShowConfirmation(false);
    }, 3000);
  };

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
                Your message has been sent to the {messageType === "doctor" ? "assigned doctor" : "hospital"}. A healthcare professional will respond shortly.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles["contact-form"]}>
          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>Name</label>
            <input
              className={styles["form-input"]}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          
          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>Email</label>
            <input
              className={styles["form-input"]}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>Message Type</label>
            <div className={styles["message-type-selector"]}>
              <button 
                type="button"
                className={`${styles["message-type-btn"]} ${messageType === "hospital" ? styles["active"] : ""}`} 
                onClick={() => setMessageType("hospital")}
              >
                Hospital
              </button>
              <button 
                type="button"
                className={`${styles["message-type-btn"]} ${messageType === "doctor" ? styles["active"] : ""}`} 
                onClick={() => setMessageType("doctor")}
              >
                My Doctor
              </button>
            </div>
          </div>
          
          <div className={styles["form-group"]}>
            <label className={styles["form-label"]}>Message</label>
            <textarea
              className={styles["form-textarea"]}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              placeholder={`Write your message to the ${messageType === "doctor" ? "assigned doctor" : "hospital"}...`}
            ></textarea>
          </div>
          
          <div className={styles["form-actions"]}>
            <button
              type="submit"
              className={styles["submit-button"]}
            >
              Send Message
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
    <div className={styles["emergency-section"]}>
      <h2 className={styles["emergency-title"]}>Emergency Services</h2>
      <p className={styles["emergency-info"]}>
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

function QueueStatus() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  
  const handleRefresh = () => {
    setIsRefreshing(true);
    
    
    setTimeout(() => {
      
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1500);
  };
  
  
  const formattedTime = lastUpdated.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
  
  return (
    <div className={styles["queue-status-card"]}>
      <h2 className={styles["card-title"]}>
        Your Queue Status
        <span className={styles["last-updated"]}>
          Last updated: {formattedTime}
        </span>
      </h2>
      
      <div className={styles["queue-info"]}>
        <div className={styles["queue-position-container"]}>
          <div className={styles["queue-position"]}>
            <span className={styles["position-number"]}>3</span>
            <span className={styles["position-text"]}>Current Position</span>
          </div>
        </div>
        
        <div className={styles["queue-stats"]}>
          <div className={styles["stat-item"]}>
            <span className={styles["stat-value"]}>8</span>
            <span className={styles["stat-label"]}>Total Patients</span>
          </div>
          <div className={styles["stat-item"]}>
            <span className={styles["stat-value"]}>~25</span>
            <span className={styles["stat-label"]}>Minutes Wait</span>
          </div>
        </div>
        
        <div className={styles["queue-details"]}>
          <div className={styles["queue-detail-item"]}>
            <div className={styles["detail-icon"]}>
              <svg className={styles["hospital-icon"]} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div className={styles["detail-info"]}>
              <span className={styles["detail-label"]}>Hospital</span>
              <span className={styles["detail-value"]}>Metro General Hospital</span>
            </div>
          </div>
          
          <div className={styles["queue-detail-item"]}>
            <div className={styles["detail-icon"]}>
              <svg className={styles["priority-icon"]} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className={styles["detail-info"]}>
              <span className={styles["detail-label"]}>Priority Level</span>
              <span className={styles["detail-value priority-medium"]}>Medium</span>
            </div>
          </div>
          
          <div className={styles["queue-detail-item"]}>
            <div className={styles["detail-icon"]}>
              <svg className={styles["department-icon"]} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
            </div>
            <div className={styles["detail-info"]}>
              <span className={styles["detail-label"]}>Department</span>
              <span className={styles["detail-value"]}>General Medicine</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles["queue-actions"]}>
        <button 
          className={styles["refresh-button"]} 
          onClick={handleRefresh}
          disabled={isRefreshing}
        >
          <svg 
            className={`${styles["refresh-icon"]} ${isRefreshing ? styles["spinning"] : ""}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {isRefreshing ? "Refreshing..." : "Refresh Status"}
        </button>
      </div>
    </div>
  );
}

function UserView() {
  return (
    <div className={styles["user-view"]}>
      <header className={styles["user-header"]}>
        <div className={styles["header-content"]}>
          <div className={styles["header-text"]}>
            <h1 className={styles["app-title"]}>
              Medical Assistance Portal
            </h1>
            <p className={styles["app-subtitle"]}>
              Contact us for non-emergency medical assistance
            </p>
          </div>
          <Link 
            to="/patient-dashboard" 
            className={styles["dashboard-link"]}
          >
            View Dashboard
          </Link>
        </div>
      </header>
      
      <main className={styles["user-main"]}>
        <QueueStatus />
        <ContactForm />
        <div className={styles["emergency-container"]}>
          <EmergencyCall />
        </div>
      </main>
      
      <footer className={styles["user-footer"]}>
        <p>© {new Date().getFullYear()} weAId</p>
      </footer>
    </div>
  )
}

export default UserView 