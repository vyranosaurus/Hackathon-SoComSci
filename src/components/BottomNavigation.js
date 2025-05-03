import { useNavigate } from "react-router-dom";
import { Home, Search, PlusSquare, User } from "lucide-react";

const BottomNavigation = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bottom-nav">
      <button onClick={() => navigate("/")} className="nav-item">
        <Home className="nav-icon" />
        <span>Home</span>
      </button>
      <button onClick={() => navigate("/")} className="nav-item">
        <Search className="nav-icon" />
        <span>Search</span>
      </button>
      <button onClick={() => navigate("/queue")} className="nav-item">
        <PlusSquare className="nav-icon" />
        <span>Hospital</span>
      </button>
      <button onClick={() => navigate("/")} className="nav-item">
        <User className="nav-icon" />
        <span>Profile</span>
      </button>
    </div>
  );
};

export default BottomNavigation;