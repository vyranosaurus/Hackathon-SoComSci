import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaHospital, FaChevronRight } from 'react-icons/fa';
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
      {/* Hero Section */}
      <div className={styles.heroSection}>
        <div className={styles.overlay}></div>
        <img src={slides[currentSlide]} alt="Healthcare" className={styles.backgroundImage} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            We<span className={styles.highlight}>AI</span>d
          </h1>
          <p className={styles.heroSubtitle}>
            Smart healthcare waiting system for efficient patient management
          </p>
        </div>
      </div>

      {/* Logo Section */}
      <div className={styles.logoSection}>
        <div className={styles.logoContainer}>
          <div className={styles.logoCircle}>
            <FaHospital className={styles.logoIcon} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          <h2 className={styles.contentTitle}>Please select your role to continue</h2>
          <p className={styles.contentDescription}>
            Sign in as a patient or as a hospital partner to access the appropriate dashboard
          </p>

          <button 
            className={styles.userButton} 
            onClick={() => navigate('/home')}
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
            onClick={() => navigate('/partner-login')}
          >
            <div className={styles.buttonContent}>
              <div className={styles.partnerButtonIcon}>
                <FaHospital />
              </div>
              <span className={styles.buttonText}>I'm a Hospital Partner</span>
            </div>
            <FaChevronRight className={styles.rightArrow} />
          </button>
        </div>
      </div>

      {/* Informational Sections */}
      <div className={styles.infoSections}>
        <div className={styles.infoSection}>
          <h3 className={styles.infoTitle}>Who We Are</h3>
          <p className={styles.infoText}>
            We<span className={styles.highlightText}>AI</span>d is a smart healthcare platform designed to connect patients and hospitals through AI-powered queue management.
          </p>
        </div>

        <div className={styles.infoSection}>
          <h3 className={styles.infoTitle}>Our Goal</h3>
          <p className={styles.infoText}>
            We aim to minimize wait times, prioritize critical care, and streamline hospital-patient communication using intelligent systems.
          </p>
        </div>

        <div className={styles.infoSection}>
          <h3 className={styles.infoTitle}>About</h3>
          <p className={styles.infoText}>
            Born from the idea of accessible and efficient healthcare, We<span className={styles.highlightText}>AI</span>d empowers both users and hospital admins to manage bookings and emergencies seamlessly.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <p>&copy; {new Date().getFullYear()} WeAId. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LandingPage; 