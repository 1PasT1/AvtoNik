"use client"

import { useState, useEffect } from "react"
import { Route, Routes, useLocation } from "react-router-dom"
import { Navbar } from "./components/Navbar"
import { Footer } from "./components/Footer"
import { HomePage } from "./pages/HomePage"
import { PrivacyPage } from "./pages/PrivacyPage"
import { TermsPage } from "./pages/TermsPage"
import { CarDetailPage } from "./pages/CarDetailPage"
import { CarsPage } from "./pages/CarsPage"
import { HowItWorksPage } from "./pages/HowItWorksPage"
import { WhyChooseUsPage } from "./pages/WhyChooseUsPage"
import ReviewsSection from "./components/ReviewsSection";
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

          {/*
            These three components already existed in src/pages/ but were
            never routed, while the sitemap advertised them and the Navbar
            checked for their paths. Google was being sent to URLs that
            rendered an empty page. Wiring them up turns a one-page site
            into four indexable pages.
          */}
          <Route path="/cars" element={<CarsPage language={language} />} />
          <Route
            path="/how-it-works"
            element={
              <HowItWorksPage language={language} setLanguage={setLanguage} />
            }
          />
          <Route
            path="/why-choose-us"
            element={<WhyChooseUsPage language={language} />}
          />

          <Route path="/privacy" element={<PrivacyPage language={language} />} />
          <Route path="/terms" element={<TermsPage language={language} />} />
          <Route
            path="/cars/:id"
            element={
              <CarDetailPage language={language} />
            }
          />
        </Routes>
      </main>
      <ReviewsSection/>
      <Footer language={language} />
    </div>
  )
}

export default App
