import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Welcome from './pages/Welcome/Welcome'
import Dashboard from './pages/Dashboard/Dashboard'
import Home from './pages/Home/Home'
import Analysis from './pages/Analysis/Analysis'
import AllAnalyses from './pages/AllAnalyses/AllAnalyses'
import AthleteDetail from './pages/AthleteDetail/AthleteDetail'
import AddAthlete from './pages/AddAthlete/AddAthlete'
import EditAthlete from './pages/EditAthlete/EditAthlete'
import NewAnalysis from './pages/NewAnalysis/NewAnalysis'
import EditAnalysis from './pages/EditAnalysis/EditAnalysis'
import AnalysisView from './pages/AnalysisView/AnalysisView'
import Settings from './pages/Settings/Settings'
import Profile from './pages/Profile/Profile'
import './styles/index.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/home" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analysis" element={<Analysis />} />
        <Route path="/all-analyses" element={<AllAnalyses />} />
        <Route path="/athlete-detail/:id" element={<AthleteDetail />} />
        <Route path="/add-athlete" element={<AddAthlete />} />
        <Route path="/athletes/edit/:id" element={<EditAthlete />} />
        <Route path="/new-analysis" element={<NewAnalysis />} />
        <Route path="/analysis/edit/:id" element={<EditAnalysis />} />
        <Route path="/analysis-view/:id" element={<AnalysisView />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />

        {/* Legacy redirects */}
        <Route path="/all-analysis" element={<Navigate to="/all-analyses" replace />} />
        <Route path="/configuracion" element={<Navigate to="/settings" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App

