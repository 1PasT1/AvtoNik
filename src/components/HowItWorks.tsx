import { Car, ClipboardCheck, PhoneCall } from 'lucide-react';

interface HowItWorksProps {
  language: string;
}

export function HowItWorks({ language }: HowItWorksProps) {
  const steps = [
    {
      icon: Car,
      title: { en: 'Choose a car', ru: 'Выберите автомобиль' },
      description: { 
        en: 'Explore our range of vehicles and pick the one that matches your journey.',
        ru: 'Изучите наш ассортимент автомобилей и выберите тот, который подходит для вашей поездки.'
      }
    },
    {
      icon: ClipboardCheck,
      title: { en: 'Fill out the form', ru: 'Заполните форму' },
      description: { 
        en: 'Enter your booking details and preferences.',
        ru: 'Введите данные для бронирования и ваши предпочтения.'
      }
    },
    {
      icon: PhoneCall,
      title: { en: 'Wait for a call', ru: 'Ожидайте звонка' },
      description: { 
        en: 'Sit back and relax! Our team will get in touch shortly to confirm your booking.',
        ru: 'Расслабьтесь! Наша команда свяжется с вами в ближайшее время для подтверждения бронирования.'
      }
    }
  ];

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">
          {language === 'English' ? 'How it works' : 'Как это работает'}
        </h2>
        <p className="text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto">
          {language === 'English'
            ? 'Pick the perfect vehicle, fill out a quick form, and leave the rest to us. We\'ll confirm your booking and get you on the road in no time.'
            : 'Выберите идеальный автомобиль, заполните короткую форму, а остальное предоставьте нам. Мы подтвердим ваше бронирование и быстро отправим вас в путь.'}
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-orange-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                <step.icon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">{language === 'English' ? step.title.en : step.title.ru}</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                {language === 'English' ? step.description.en : step.description.ru}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

