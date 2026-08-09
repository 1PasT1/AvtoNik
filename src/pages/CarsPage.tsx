import { useState, useEffect } from 'react';
import { CarListing } from '../components/CarListing';
import { fetchCars } from '../utils/api';
import { Car } from '../types/car';
import { SEO } from '../components/SEO';

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

  const isEn = language === 'English';

  return (
    <>
      <SEO
        title={
          isEn
            ? 'Cars for Rent in Batumi — Economy, SUV & Luxury | AvtoNik'
            : 'Автомобили напрокат в Батуми — эконом, внедорожники, премиум | AvtoNik'
        }
        description={
          isEn
            ? 'Browse the full AvtoNik fleet in Batumi: economy, midsize, SUV and luxury cars. Live availability, daily prices from $30, airport pickup and instant online booking.'
            : 'Весь автопарк AvtoNik в Батуми: эконом, средний класс, внедорожники и премиум. Актуальная доступность, цены от $30 в сутки, подача в аэропорт, онлайн-бронирование.'
        }
        path="/cars"
        language={language}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'CollectionPage',
          name: isEn ? 'Cars for Rent in Batumi' : 'Автомобили напрокат в Батуми',
          url: 'https://autonik.rentals/cars',
          about: { '@type': 'AutoRental', name: 'AvtoNik Car Rental' },
          // Lets Google see the fleet as a list rather than one blob of text.
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: cars.length,
            itemListElement: cars.slice(0, 30).map((c, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              url: `https://autonik.rentals/cars/${c.id}`,
              name: c.name,
            })),
          },
        }}
      />

    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white pt-20">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">
          {isEn ? 'Cars for Rent in Batumi' : 'Автомобили напрокат в Батуми'}
        </h1>
        {error && (
          <div className="text-center text-red-600 mb-8">
            <p>{error}</p>
          </div>
        )}
        <CarListing cars={cars} language={language} isLoading={loading} />
      </div>
    </main>
    </>
  );
}

