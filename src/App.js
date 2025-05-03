import { createBrowserRouter, RouterProvider } from "react-router-dom";
import HomePage from "./components/HomePage";
import QueuePage from "./components/QueuePage.js";
import HospitalPage from "./components/HospitalPage.js";
import "./App.css";

function App() {
  const router = createBrowserRouter([
    {
      path: "/hospital",
      element: <HospitalPage />
    },
    {
      path: "/",
      element: <HomePage />
    },
    {
      path: "/queue",
      element: <QueuePage />
    }
  ]);

  

  return <RouterProvider router={router} />;
}

export default App;