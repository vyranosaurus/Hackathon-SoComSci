import { useNavigate, useLocation } from "react-router-dom";
import { FaHome, FaHospital, FaUser } from "react-icons/fa";

const BottomNavigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <div className="bottom-nav">
      <button 
        onClick={() => navigate("/")} 
        className={`nav-item ${isActive("/") ? "active" : ""}`}
      >
        <FaHome className="nav-icon" size={18} />
        <span>Home</span>
      </button>
      
      <button 
        onClick={() => navigate("/hospital")} 
        className={`nav-item ${isActive("/hospital") ? "active" : ""}`}
      >
        <FaHospital className="nav-icon" size={18} />
        <span>Hospital</span>
      </button>
      
      <button 
        onClick={() => navigate("/profile")} 
        className={`nav-item ${isActive("/profile") ? "active" : ""}`}
      >
        <FaUser className="nav-icon" size={18} />
        <span>Profile</span>
      </button>
    </div>
  );
};

export default BottomNavigation;