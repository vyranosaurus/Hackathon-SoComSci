import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import UserView from './pages/UserView'
import HospitalView from './pages/HospitalView'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserView />} />
        <Route path="/hospital" element={<HospitalView />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
