import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaHospital, FaUser, FaLock } from 'react-icons/fa';
import styles from './PartnerLogin.module.css';

const PartnerLogin = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const hospitals = [
    { id: 'hospital-1', name: 'General Hospital', isFree: true },
    { id: 'hospital-2', name: 'City Medical Center', isFree: false },
    { id: 'hospital-3', name: 'St. Luke\'s Hospital', isFree: false },
    { id: 'hospital-4', name: 'People\'s Community Hospital', isFree: true },
    { id: 'hospital-5', name: 'Metro Health Center', isFree: false }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (!selectedHospital) {
      setError('Please select a hospital');
      return;
    }
    
    if (!username || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    
    
    const hospitalData = hospitals.find(h => h.name === selectedHospital) || 
      { name: selectedHospital, isFree: Math.random() > 0.5 };
    
    setTimeout(() => {
      setLoading(false);
      navigate('/hospital-dashboard', { 
        state: { 
          hospitalName: hospitalData.name,
          isFree: hospitalData.isFree
        } 
      });
    }, 1200);
  };

  return (
    <div className={styles.container}>
      {}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <button 
            onClick={() => navigate('/')}
            className={styles.backButton}
          >
            <FaArrowLeft />
          </button>
          <h1 className={styles.headerTitle}>Partner Sign In</h1>
        </div>
      </div>
      
      {}
      <div className={styles.mainContent}>
        <div className={styles.loginCard}>
          <div className={styles.logoContainer}>
            <div className={styles.logo}>
              <FaHospital className={styles.logoIcon} />
            </div>
          </div>
          
          <h2 className={styles.loginTitle}>
            WeAId Partner Portal
          </h2>
          
          {error && (
            <div className={styles.errorMessage}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className={styles.formGroup}>
              <label htmlFor="hospital" className={styles.label}>Hospital</label>
              <div className={styles.inputWrapper}>
                <FaHospital className={styles.inputIcon} />
                <select
                  id="hospital"
                  className={styles.input}
                  value={selectedHospital}
                  onChange={(e) => setSelectedHospital(e.target.value)}
                >
                  <option value="">Select a hospital</option>
                  {hospitals.map(hospital => (
                    <option key={hospital.id} value={hospital.name}>
                      {hospital.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.label}>Username</label>
              <div className={styles.inputWrapper}>
                <FaUser className={styles.inputIcon} />
                <input
                  id="username"
                  type="text"
                  placeholder="Enter your username"
                  className={styles.input}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>Password</label>
              <div className={styles.inputWrapper}>
                <FaLock className={styles.inputIcon} />
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className={styles.input}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className={styles.submitButton} 
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            
            <div className={styles.forgotPassword}>
              <a href="#" className={styles.forgotPasswordLink} onClick={(e) => e.preventDefault()}>Forgot password?</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PartnerLogin; 