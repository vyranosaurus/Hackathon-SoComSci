import { useNavigate } from "react-router-dom";
import BottomNavigation from "./BottomNavigation";


//EME LANG MUNA
//NDE PA SURE KULANG KULANG PA!!!!
const HomePage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container">
      <div className="app-header">
        <div className="header-content">
          <div className="deliver-to">
            <span>FIND HOSPITAL</span>
            <h3>Placeholder <span className="dropdown-arrow">▼</span></h3>
          </div>
          <div className="header-icons">
            <div className="icon-circle">♡</div>
            <div className="icon-circle">≡</div>
          </div>
        </div>
      </div>

      <div className="search-bar">
        <div className="search-input">
          <span className="search-icon">🔍</span>
          <span className="placeholder-text">What symptoms do you have?</span>
        </div>
      </div>

      <div className="categories-container">
        <div className="category-item">
          <div className="category-icon emergency"></div>
          <p>Emergency</p>
        </div>
        <div className="category-item">
          <div className="category-icon consultation"></div>
          <p>Consultation</p>
        </div>
        <div className="category-item">
          <div className="category-icon appointments"></div>
          <p>Appointments</p>
        </div>
        <div className="category-item">
          <div className="category-icon specialists"></div>
          <p>Specialists</p>
        </div>
      </div>

      <div className="banner" onClick={() => navigate("/queue")}>
        <div className="banner-content">
          <h3>Smart Queue System</h3>
          <p>Priority based on urgency</p>
          <div className="banner-button">JOIN NOW</div>
        </div>
      </div>

      <div className="rewards-bar">
        <div className="rewards-text">
          <p>There are 5 hospitals nearby</p>
        </div>
        <div className="view-button">View</div>
      </div>

      <div className="promo-card" onClick={() => navigate("/queue")}>
        <div className="promo-content">
          <h3>Find nearest hospital</h3>
          <p>Use current location to find hospitals</p>
          <div className="hospital-icon"></div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default HomePage;