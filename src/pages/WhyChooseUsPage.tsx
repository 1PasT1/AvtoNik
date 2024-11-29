import { WhyChooseUs } from '../components/WhyChooseUs';

interface WhyChooseUsPageProps {
  language: string;
}

export function WhyChooseUsPage({ language }: WhyChooseUsPageProps) {
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white pt-20">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">
          {language === 'English' ? 'Why Choose Us' : 'Почему выбирают нас'}
        </h1>
        <WhyChooseUs language={language} />
      </div>
    </main>
  );
}

