import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { HomePage } from "./pages/HomePage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { TermsPage } from "./pages/TermsPage";
import { CarDetailPage } from "./pages/CarDetailPage";
import { Analytics } from '@vercel/analytics/react';

function App() {
  const [language, setLanguage] = useState("English");

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar language={language} setLanguage={setLanguage} />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage language={language} />} />
          <Route
            path="/privacy"
            element={<PrivacyPage language={language} />}
          />
          <Route path="/terms" element={<TermsPage language={language} />} />
          <Route path="/cars/:id" element={<CarDetailPage />} />
        </Routes>
      </main>
      <Footer language={language} />
      <Analytics />
    </div>
  );
}

export default App;
