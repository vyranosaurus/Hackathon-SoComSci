import { useNavigate } from "react-router-dom";
import BottomNavigation from "./BottomNavigation";
import { FaHospital, FaSearch, FaUserMd, FaCalendarAlt, FaAmbulance, FaArrowLeft } from "react-icons/fa";



const HomePage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container">
      {}
      <div className="back-button-container">
        <button className="back-button" onClick={() => navigate("/")}>
          <FaArrowLeft size={14} />
        </button>
      </div>
      
      {}
      <div className="hero-section" style={{ paddingTop: "50px" }}>
        <h1 className="app-title">We<span className="ai-highlight">AI</span>d</h1>
        <p>Smart healthcare waiting system for efficient patient management</p>
        <button 
          className="cta-button"
          onClick={() => navigate("/search")}
        >
          Check Availability
        </button>
      </div>

      <div className="search-bar" onClick={() => navigate("/hospital")}>
        <div className="search-input">
          <FaSearch className="search-icon" style = {{marginLeft: '1rem'}}/>
          <span className="placeholder-text" style = {{marginLeft: '2rem'}}>What symptoms do you have?</span>
        </div>
      </div>

      <div className="features-section">
        <h2>Our Services</h2>
        <div className="features-container">
          <div className="feature-card">
            <div className="feature-icon">
              <FaUserMd size={24} />
            </div>
            <h3>Smart Triage</h3>
            <p>Priority based on urgency</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaHospital size={24} />
            </div>
            <h3>Hospital Finder</h3>
            <p>Find closest hospitals</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaCalendarAlt size={24} />
            </div>
            <h3>Appointments</h3>
            <p>Schedule doctor visits</p>
          </div>
          
          <div className="feature-card">
            <div className="feature-icon">
              <FaAmbulance size={24} />
            </div>
            <h3>Emergency</h3>
            <p>Urgent care services</p>
          </div>
        </div>
      </div>

      <div className="banner" onClick={() => navigate("/hospital")}>
        <div className="banner-content">
          <h3>Smart Queue System</h3>
          <p>Priority based on urgency, not arrival time</p>
          <div className="banner-button">JOIN NOW</div>
        </div>
      </div>

      <div className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <p>Find a hospital near you</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <p>Enter your symptoms</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <p>Get your queue position</p>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default HomePage;