import { Headphones, BadgeDollarSign, MapPin } from 'lucide-react';

interface WhyChooseUsProps {
  language: string;
}

export function WhyChooseUs({ language }: WhyChooseUsProps) {
  const reasons = [
    {
      icon: Headphones,
      title: { en: 'Customer Support', ru: 'Поддержка клиентов' },
      description: { 
        en: 'We\'re always here to help! Our friendly customer support team is available around the clock, ready to assist you with any questions or concerns.',
        ru: 'Мы всегда готовы помочь! Наша дружелюбная команда поддержки клиентов доступна круглосуточно и готова помочь вам с любыми вопросами или проблемами.'
      }
    },
    {
      icon: BadgeDollarSign,
      title: { en: 'Best Price Guaranteed', ru: 'Гарантия лучшей цены' },
      description: { 
        en: 'Rest assured that you\'re getting the best price available. We\'re committed to offering you the most competitive rates in the industry.',
        ru: 'Будьте уверены, что вы получаете лучшую доступную цену. Мы стремимся предложить вам самые конкурентоспособные тарифы в отрасли.'
      }
    },
    {
      icon: MapPin,
      title: { en: 'Flexible Pickup, Wherever You Are', ru: 'Гибкая система получения, где бы вы ни находились' },
      description: { 
        en: 'You name your location, we deliver! Whether you\'re at home, the airport, or a meeting spot, we\'ll deliver the car right to you.',
        ru: 'Вы называете место, мы доставляем! Независимо от того, находитесь ли вы дома, в аэропорту или в месте встречи, мы доставим автомобиль прямо к вам.'
      }
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
          {language === 'English' ? 'Why choose us' : 'Почему выбирают нас'}
        </h2>
        <p className="text-center text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto">
          {language === 'English'
            ? 'Enjoy exceptional support, unbeatable prices, and pickup options tailored to your needs—because your journey matters to us'
            : 'Наслаждайтесь исключительной поддержкой, непревзойденными ценами и вариантами получения, адаптированными к вашим потребностям — потому что ваше путешествие важно для нас'}
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div>
            <img
              src="./src/assets/G-class.png"
              alt={language === 'English' ? 'Mercedes G-Class' : 'Мерседес G-класса'}
              className="w-full h-auto rounded-lg"
            />
          </div>
          
          <div className="space-y-6 sm:space-y-8">
            {reasons.map((reason, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                    <reason.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">{language === 'English' ? reason.title.en : reason.title.ru}</h3>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {language === 'English' ? reason.description.en : reason.description.ru}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

