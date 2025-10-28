import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Welcome from './pages/Welcome'
import Dashboard from './pages/Dashboard'
import Analisis from './pages/Analisis'
import AgregarAtleta from './pages/AgregarAtleta'
import './styles/index.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analisis" element={<Analisis />} />
        <Route path="/agregar-atleta" element={<AgregarAtleta />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
