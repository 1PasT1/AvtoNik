"use client"

import { useState, useEffect } from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import { Navbar } from "./components/Navbar"
import { Footer } from "./components/Footer"
import { HomePage } from "./pages/HomePage"
import { PrivacyPage } from "./pages/PrivacyPage"
import { TermsPage } from "./pages/TermsPage"
import { CarDetailPage } from "./pages/CarDetailPage"
import AOS from "aos"
import "aos/dist/aos.css"

function App() {
  const [language, setLanguage] = useState("English")
  const location = useLocation()

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-in-out",
      offset: 0,
      disable: "mobile",
      mirror: true,
    })
  }, [])

  useEffect(() => {
    window.history.scrollRestoration = "manual"
    window.scrollTo(0, 0)
    AOS.refresh()
  }, [location])

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar language={language} setLanguage={setLanguage} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage language={language} />} />
          <Route path="/privacy" element={<PrivacyPage language={language} />} />
          <Route path="/terms" element={<TermsPage language={language} />} />
          <Route path="/cars/:id" element={<CarDetailPage />} />
        </Routes>
      </main>
      <Footer language={language} />
    </div>
  )
}

export default App
