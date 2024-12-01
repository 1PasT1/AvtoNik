import { useState, useEffect } from 'react';
import { CarListing } from '../components/CarListing';
import { fetchCars } from '../utils/api';
import { Car } from '../types/car';

interface CarsPageProps {
  language: string;
}

export function CarsPage({ language }: CarsPageProps) {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCars = async () => {
      try {
        const fetchedCars = await fetchCars();
        setCars(fetchedCars);
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
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white pt-20">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">
          {language === 'English' ? 'Our Cars' : 'Наши автомобили'}
        </h1>
        {error && (
          <div className="text-center text-red-600 mb-8">
            <p>{error}</p>
          </div>
        )}
        <CarListing cars={cars} language={language} isLoading={loading} />
      </div>
    </main>
  );
}

