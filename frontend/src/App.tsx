import { useState } from 'react'
import Welcome from './pages/Welcome'
import Dashboard from './pages/Dashboard'
import Analisis from './pages/Analisis'
import './styles/index.css'

type PageType = 'welcome' | 'dashboard' | 'analisis' | 'agregar' | 'settings' | 'profile'

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('welcome')

  const handleEnterPlatform = () => {
    setCurrentPage('dashboard')
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'welcome':
        return <Welcome onEnter={handleEnterPlatform} />
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentPage} />
      case 'analisis':
        return <Analisis />
      default:
        return <Dashboard onNavigate={setCurrentPage} />
    }
  }

  return (
    <div className="app">
      {renderPage()}
    </div>
  )
}

export default App
