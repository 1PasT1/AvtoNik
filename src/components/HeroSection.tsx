import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

interface HeroSectionProps {
  language: string;
}

export function HeroSection({ language }: HeroSectionProps) {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      mirror: false,
      offset: 100,
    });
  }, []);

  return (
    <div className="relative min-h-screen bg-gradient-to-r from-white to-[#FF4D00] overflow-hidden">
      <div className="container mx-auto px-4 pt-20 sm:pt-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div
            className="text-center lg:text-left"
            data-aos="fade-right"
            data-aos-offset="300"
            data-aos-easing="ease-in-sine"
          >
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6">
              {language === "English"
                ? "FAST AND EASY WAY TO RENT A CAR"
                : "БЫСТРЫЙ И ПРОСТОЙ СПОСОБ АРЕНДОВАТЬ АВТОМОБИЛЬ"}
            </h1>
            <p className="text-base sm:text-lg mb-6 sm:mb-8">
              {language === "English"
                ? "Explore without limits. Whether it's a weekend adventure or a daily commute, we've got the perfect car for you. Easy booking, flexible terms, and a fleet ready to roll - your next destination's only a ride away."
                : "Исследуйте без ограничений. Будь то выходные приключения или ежедневные поездки, у нас есть идеальный автомобиль для вас. Простое бронирование, гибкие условия и готовый к использованию автопарк - ваш следующий пункт назначения всего в одной поездке."}
            </p>
          </div>
          <div
            className="relative"
            data-aos="fade-left"
            data-aos-offset="300"
            data-aos-easing="ease-in-sine"
          >
            <img
              src="/SUV.png"
              alt={
                language === "English"
                  ? "Orange Jeep Wrangler"
                  : "Оранжевый Джип Вранглер"
              }
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
