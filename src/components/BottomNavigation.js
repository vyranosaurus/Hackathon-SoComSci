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
        onClick={() => navigate("/home")} 
        className={`nav-item ${isActive("/home") ? "active" : ""}`}
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
        onClick={() => navigate("/medical-portal")} 
        className={`nav-item ${isActive("/medical-portal") ? "active" : ""}`}
      >
        <FaUser className="nav-icon" size={18} />
        <span>Portal</span>
      </button>
    </div>
  );
};

export default BottomNavigation;