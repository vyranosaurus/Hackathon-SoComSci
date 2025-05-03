import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./components/HomePage"; // Assuming HomePage exists
import QueuePage from "./components/QueuePage.js";
import HospitalPage from "./components/HospitalPage.js";
import "./App.css"; // Your global App CSS

function App() {
  const router = createBrowserRouter([
    {
      path: "/hospital",
      element: <HospitalPage />
    },
    {
      path: "/",
      element: <HomePage /> // Assuming your home page is separate
    },
    {
      // Updated path to include both hospitalId and serviceId parameters
      path: "/queue/:hospitalId/:serviceId", // <-- Changed this line
      element: <QueuePage />
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;
