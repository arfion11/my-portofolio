import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useLayoutEffect } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import Messages from './pages/admin/Messages'

function App() {
  const location = useLocation();

  // Scroll to top BEFORE paint - prevents flickering
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/messages" element={<Messages />} />
          </Routes>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}

export default App