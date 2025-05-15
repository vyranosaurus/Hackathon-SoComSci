import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Navigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import QueuePage from "./components/QueuePage.js";
import SearchPage from "./components/SearchPage.js";
import ScriptRunner from "./components/ScriptRunner.js";
import LandingPage from "./components/LandingPage.js";
import PartnerLogin from "./components/PartnerLogin.js";
import HospitalDashboard from "./components/HospitalDashboard.js";
import TailwindTest from "./components/TailwindTest.js";
import MedicalTriageDashboard from "./components/MedicalTriageDashboard.js";
import PatientDashboard from "./components/PatientDashboard.js";
import HospitalPage from "./components/HospitalPage.js";  

import "./App.css"; 

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />
    },
    {
      path: "/home",
      element: <HomePage />
    },
    {
      path: "/hospital",
      element: <HospitalPage />
    },
    {
      path: "/search",
      element: <SearchPage />
    },
    {
      path: "/queue/:hospitalId/:serviceId",
      element: <QueuePage />
    },
    {
      path: "/scripts",
      element: <ScriptRunner />
    },
    {
      path: "/partner-login",
      element: <PartnerLogin />
    },
    {
      path: "/hospital-dashboard",
      element: <HospitalDashboard />
    },
    {
      path: "/tailwind-test",
      element: <TailwindTest />
    },
    {
      path: "/medical-portal",
      element: <PatientDashboard />
    },
    {
      path: "/medical-dashboard",
      element: <MedicalTriageDashboard />
    },
    {
      path: "/patient-dashboard",
      element: <Navigate to="/medical-portal" />
    }
  ]);

  return <RouterProvider router={router} />;
}

export default App;