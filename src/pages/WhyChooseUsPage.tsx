import { WhyChooseUs } from '../components/WhyChooseUs';
import { SEO } from '../components/SEO';

interface WhyChooseUsPageProps {
  language: string;
}

export function WhyChooseUsPage({ language }: WhyChooseUsPageProps) {
  const isEn = language === 'English';

  return (
    <>
      <SEO
        title={
          isEn
            ? 'Why Rent With AvtoNik — Car Rental in Batumi, Georgia'
            : 'Почему AvtoNik — аренда авто в Батуми, Грузия'
        }
        description={
          isEn
            ? 'Local Batumi car rental with transparent pricing, no hidden fees, flexible pickup including the airport, and a fleet from economy to luxury.'
            : 'Местная аренда авто в Батуми: прозрачные цены, без скрытых платежей, гибкая подача включая аэропорт, автопарк от эконома до премиума.'
        }
        path="/why-choose-us"
        language={language}
      />

      <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white pt-20">
        <div className="container mx-auto px-4">
          <h1 className="mb-8 text-3xl font-bold">
            {isEn
              ? 'Why Choose AvtoNik in Batumi'
              : 'Почему выбирают AvtoNik в Батуми'}
          </h1>
          <WhyChooseUs language={language} />
        </div>
      </main>
    </>
  );
}
