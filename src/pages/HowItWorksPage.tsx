
import { HowItWorks } from '../components/HowItWorks';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

interface HowItWorksPageProps {
  language: string;
  setLanguage: (lang: string) => void;
}

export function HowItWorksPage({ language, setLanguage }: HowItWorksPageProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar language={language} setLanguage={setLanguage} />
      <main className="flex-grow bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4 py-16 pt-32">
          <HowItWorks language={language} />
        </div>
      </main>
      <Footer language={language} />
    </div>
  );
}

