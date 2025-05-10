import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, 
  FaHospital, 
  FaChevronRight, 
  FaClock, 
  FaBrain, 
  FaMobileAlt, 
  FaShieldAlt, 
  FaHeartbeat, 
  FaStethoscope 
} from 'react-icons/fa';
import styles from './LandingPage.module.css';

import hospitalImg from '../images/hospital.jpg';
import philheartImg from '../images/philheart.jpg';
import stlukesImg from '../images/stlukes.jpg';

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [hospitalImg, philheartImg, stlukesImg];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className={styles.container}>
      {}
      <div className={styles.heroSection}>
        <div className={styles.overlay}></div>
        <img src={slides[currentSlide]} alt="Healthcare" className={styles.backgroundImage} />
        <div className={styles.heroContent}>
          <div className={styles.iconBadge}>
            <FaHeartbeat className={styles.heartbeatIcon} />
            <div className={styles.pulse}></div>
          </div>
          <h1 className={styles.heroTitle}>
            We<span className="ai-highlight">AI</span>d
          </h1>
          <p className={styles.heroSubtitle}>
            Smart healthcare waiting system for efficient patient management
          </p>
          <div className={styles.slideIndicators}>
            {slides.map((_, index) => (
              <div 
                key={index} 
                className={`${styles.indicator} ${index === currentSlide ? styles.activeIndicator : ''}`}
                onClick={() => setCurrentSlide(index)}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {}
      <div className={styles.logoSection}>
        <div className={styles.logoContainer}>
          <div className={styles.logoCircle}>
            <FaHospital className={styles.logoIcon} />
          </div>
        </div>
      </div>

      {}
      <div className={styles.roleSelectContainer}>
        <h2 className={styles.roleHeading}>Please select your role to continue</h2>
        <p className={styles.roleDescription}>
          Sign in as a patient or as a hospital partner to access the
          appropriate dashboard
        </p>

        <div className={styles.userButtons}>
          <button 
            className={styles.userButton}
            onClick={() => navigate("/home")}
          >
            <div className={styles.buttonContent}>
              <div className={styles.buttonIcon}>
                <FaUser />
              </div>
              <span className={styles.buttonText}>I'm a User</span>
            </div>
            <FaChevronRight className={styles.rightArrow} />
          </button>
          
          <button 
            className={styles.partnerButton}
            onClick={() => navigate("/partner-login")}
          >
            <div className={styles.buttonContent}>
              <div className={styles.partnerButtonIcon}>
                <FaHospital />
              </div>
              <span className={styles.buttonText}>Hospital Partner</span>
            </div>
            <FaChevronRight className={styles.rightArrow} />
          </button>
        </div>
      </div>

      {}
      <div className={styles.featuresContainer}>
        <h3 className={styles.featuresTitle}>Features</h3>
        <div className={styles.featuresGrid}>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <FaBrain />
            </div>
            <h4>AI Triage</h4>
            <p>Smart prioritization based on symptom severity</p>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <FaClock />
            </div>
            <h4>Real-time Updates</h4>
            <p>Live queue status and wait time estimates</p>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <FaMobileAlt />
            </div>
            <h4>Mobile Access</h4>
            <p>Manage your hospital visit from anywhere</p>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}>
              <FaShieldAlt />
            </div>
            <h4>Secure</h4>
            <p>Protected personal and medical information</p>
          </div>
        </div>
      </div>

      {}
      <div className={styles.infoSections}>
        <div className={styles.infoSection}>
          <div className={styles.infoIconContainer}>
            <FaStethoscope className={styles.infoIcon} />
          </div>
          <h3 className={styles.infoTitle}>Who We Are</h3>
          <p className={styles.infoText}>
            We<span className={styles.highlightText}>AI</span>d is a smart healthcare platform designed to connect patients and hospitals through AI-powered queue management.
          </p>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoIconContainer}>
            <FaHeartbeat className={styles.infoIcon} />
          </div>
          <h3 className={styles.infoTitle}>Our Goal</h3>
          <p className={styles.infoText}>
            We aim to minimize wait times, prioritize critical care, and streamline hospital-patient communication using intelligent systems.
          </p>
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoIconContainer}>
            <FaHospital className={styles.infoIcon} />
          </div>
          <h3 className={styles.infoTitle}>About</h3>
          <p className={styles.infoText}>
            Born from the idea of accessible and efficient healthcare, We<span className={styles.highlightText}>AI</span>d empowers both users and hospital admins to manage bookings and emergencies seamlessly.
          </p>
        </div>
      </div>

      {}
      <div className={styles.footer}>
        <div className={styles.footerLogo}>
          <span className={styles.footerLogoText}>
            we<span className={styles.footerLogoHighlight}>AI</span>d
          </span>
        </div>
        <p>&copy; {new Date().getFullYear()} WeAId. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LandingPage; 