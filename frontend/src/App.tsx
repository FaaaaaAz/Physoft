import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Welcome from './pages/Welcome'
import Dashboard from './pages/Dashboard'
import Analisis from './pages/Analisis'
import TodosAnalisis from './pages/TodosAnalisis'
import DetalleAtleta from './pages/DetalleAtleta'
import AgregarAtleta from './pages/AgregarAtleta'
import NuevoAnalisis from './pages/NuevoAnalisis'
import Configuracion from './pages/Configuracion'
import Perfil from './pages/Perfil'
import './styles/index.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analisis" element={<Analisis />} />
        <Route path="/todos-analisis" element={<TodosAnalisis />} />
        <Route path="/detalle-atleta" element={<DetalleAtleta />} />
        <Route path="/agregar-atleta" element={<AgregarAtleta />} />
        <Route path="/nuevo-analisis" element={<NuevoAnalisis />} />
        <Route path="/configuracion" element={<Configuracion />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
