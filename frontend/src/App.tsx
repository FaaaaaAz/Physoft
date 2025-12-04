import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Welcome from './pages/Welcome'
import Dashboard from './pages/Dashboard'
import Analisis from './pages/Analisis'
import TodosAnalisis from './pages/TodosAnalisis'
import DetalleAtleta from './pages/DetalleAtleta'
import AgregarAtleta from './pages/AgregarAtleta'
import NuevoAnalisis from './pages/NuevoAnalisis'
import AnalysisView from './pages/AnalysisView'
import Configuracion from './pages/Configuracion'
import Perfil from './pages/Perfil'
import './styles/index.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analysis" element={<Analisis />} />
        <Route path="/all-analysis" element={<TodosAnalisis />} />
        <Route path="/athlete-detail/:id" element={<DetalleAtleta />} />
        <Route path="/add-athlete" element={<AgregarAtleta />} />
        <Route path="/new-analysis" element={<NuevoAnalisis />} />
        <Route path="/analysis-view/:id" element={<AnalysisView />} />
        <Route path="/settings" element={<Configuracion />} />
        <Route path="/profile" element={<Perfil />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
