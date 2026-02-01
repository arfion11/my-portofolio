import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import ProjectDetail from './pages/ProjectDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import Messages from './pages/admin/Messages'
import Certificates from './pages/admin/Certificates'
import Journey from './pages/admin/Journey'

function App() {
  const location = useLocation();

  // Scroll to top instantly on route change - no animation
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 text-white flex flex-col">
      <Navbar />

      <main className="flex-grow relative">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolio/:id" element={<ProjectDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/messages" element={<Messages />} />
          <Route path="/admin/certificates" element={<Certificates />} />
          <Route path="/admin/journey" element={<Journey />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default App