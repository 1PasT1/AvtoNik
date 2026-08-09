import { HowItWorks } from '../components/HowItWorks';
import { SEO } from '../components/SEO';

interface HowItWorksPageProps {
  language: string;
  setLanguage: (lang: string) => void;
}

export function HowItWorksPage({ language }: HowItWorksPageProps) {
  const isEn = language === 'English';

  return (
    <>
      <SEO
        title={
          isEn
            ? 'How to Rent a Car in Batumi — 3 Simple Steps | AvtoNik'
            : 'Как арендовать авто в Батуми — 3 простых шага | AvtoNik'
        }
        description={
          isEn
            ? 'Renting a car in Batumi takes three steps: pick your car and dates, send a booking request, collect the keys. No deposit surprises, airport pickup available.'
            : 'Аренда авто в Батуми в три шага: выберите машину и даты, отправьте заявку, заберите ключи. Без скрытых платежей, возможна подача в аэропорт.'
        }
        path="/how-it-works"
        language={language}
      />

      {/*
        This page used to render its own Navbar and Footer. App.tsx already
        wraps every route in both, so once the route was wired up you would
        have seen two of each stacked on the page.
      */}
      <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
        <div className="container mx-auto px-4 py-16 pt-32">
          <h1 className="mb-8 text-3xl font-bold">
            {isEn
              ? 'How to Rent a Car in Batumi'
              : 'Как арендовать автомобиль в Батуми'}
          </h1>
          <HowItWorks language={language} />
        </div>
      </main>
    </>
  );
}
