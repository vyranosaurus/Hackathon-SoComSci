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
      // Modify the path to include the :serviceId parameter
      path: "/queue/:serviceId", // <-- Changed this line
      element: <QueuePage />
    }
    // You could also keep the exact /queue path if you want a default view:
    // {
    //   path: "/queue",
    //   element: <QueuePage /> // Maybe a page showing a list of services?
    // }
  ]);


  return <RouterProvider router={router} />;
}

export default App;