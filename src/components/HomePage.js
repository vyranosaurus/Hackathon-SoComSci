import { useNavigate } from "react-router-dom";
import BottomNavigation from "./BottomNavigation";

const HomePage = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container">
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Medical App Home</h1>
        <p style={{ margin: "20px 0" }}>Welcome to the Medical App</p>
        <button
          onClick={() => navigate("/queue")}
          style={{ 
            display: "block",
            background: "#8B0000",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
            border: "none",
            cursor: "pointer",
            margin: "30px auto",
            maxWidth: "200px",
            width: "100%"
          }}
        >
          Go to Cardiology Queue
        </button>
      </div>
      <BottomNavigation />
    </div>
  );
};

export default HomePage;