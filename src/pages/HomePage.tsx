import { useState, useEffect } from 'react';
import { HeroSection } from '../components/HeroSection';
import { CarListing } from '../components/CarListing';
import { HowItWorks } from '../components/HowItWorks';
import { WhyChooseUs } from '../components/WhyChooseUs';
import { fetchCars } from '../utils/api';
import { Car} from '../types/car';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface HomePageProps {
  language: string;
}

export function HomePage({ language }: HomePageProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCars = async () => {
      try {
        const data = await fetchCars();
        if (Array.isArray(data)) {
          setCars(data);
        } else {
          throw new Error('Invalid data structure received from API');
        }
      } catch (err) {
        setError(language === 'English' 
          ? 'Unable to load car data. Please try again later.' 
          : 'Не удалось загрузить данные об автомобилях. Пожалуйста, попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    loadCars();
  }, [language]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      <div id="home">
        <HeroSection language={language} />
      </div>
      <div id="how-it-works">
        <HowItWorks language={language} />
      </div>
      <div id="cars">
        {error && (
          <Alert variant="destructive">
            <AlertTitle>{language === 'English' ? 'Error' : 'Ошибка'}</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <CarListing cars={cars} language={language} isLoading={loading} />
      </div>
      <div id="why-choose-us">
        <WhyChooseUs language={language} />
      </div>
    </main>
  );
}

