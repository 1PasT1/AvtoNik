"use client";

import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  language?: string;
}

export function SEO({
  title = "AvtoNik - Car Rental Service | Rent Cars Online | Best Car Rental Deals",
  description = "Rent a car with AvtoNik - Fast, easy, and affordable car rental service. Choose from economy, luxury, SUV cars. Best prices guaranteed. Book your rental car online today!",
  keywords = "car rental, rent a car, car hire, rental cars, cheap car rental, luxury car rental, SUV rental, economy car rental, online car booking, best car rental deals, affordable car rental, long term car rental, daily car rental, car rental near me, automatic car rental, AvtoNik, rent a car Tbilisi, Georgia car hire,მანქანების ქირაობა, მანქანის ქირაობა, იაფი მანქანის ქირაობა, იქირავე მანქანა, იქირავე მანქანა დღიურად, ქირავდება მანქანა, მანქანა დღიურად, თბილისი მანქანის ქირაობა, ავტო გაქირავება, მანქანის დაქირავება, მანქანის დაჯავშნა ონლაინ,прокат автомобилей, аренда авто, аренда машины, прокат машин, аренда авто Тбилиси, аренда машины Грузия, дешёвая аренда авто, аренда внедорожников, аренда авто онлайн, аренда авто на день, аренда автомобилей в Тбилиси,alquiler de coches, renta de autos, alquilar un coche, alquiler de autos baratos, alquiler de coches de lujo, renta de SUV, renta de coches económicos, reserva de coches online, mejores ofertas de alquiler de autos,تأجير سيارات, استئجار سيارة, حجز سيارة, سيارات للإيجار, استئجار سيارة في تبليسي, تأجير سيارات فاخرة, سيارات رخيصة للإيجار, تأجير سيارات يومي, حجز سيارة اونلاين,Autovermietung, Auto mieten, günstige Autovermietung, Luxusauto mieten, SUV mieten, Mietwagen buchen, Auto mieten Tiflis, Mietwagen Georgien,location de voiture, louer une voiture, location de voitures pas chères, location de voiture de luxe, réserver une voiture en ligne, location voiture Tbilissi,noleggio auto, affittare una macchina, autonoleggio economico, auto di lusso a noleggio, noleggio SUV, prenotazione auto online, affitto auto Tbilisi,租车, 汽车租赁, 租一辆车, 豪华车租赁, 便宜租车, 格鲁吉亚租车, 第比利斯租车, 在线租车, 经济型租车,araba kiralama, araç kiralama, ucuz araba kiralama, lüks araç kiralama, SUV kiralama, Tiflis araba kiralama, Gürcistan araç kiralama, online araç rezervasyonu,कार रेंटल, कार किराए पर लें, सस्ती कार किराए पर, लक्ज़री कार किराए पर, SUV किराए पर, जॉर्जिया में कार किराए पर, त्बिलिसी कार किराया, ऑनलाइन कार बुकिंग car rental Georgia, rent a car Georgia, car hire Georgia, Tbilisi car rental, Batumi car rental, Kutaisi car rental,cheap car rental Georgia, SUV rental Georgia, luxury car rental Georgia, economy car hire Georgia, online car booking Georgia,best car rental deals Georgia, long term car rental Georgia, daily car rental Georgia, affordable car rental Georgia, automatic car rental Georgia,AvtoNik, Georgia car rental company, vehicle rental Georgia,მანქანის ქირაობა, იაფი მანქანის ქირაობა, იქირავე მანქანა, ავტო გაქირავება, თბილისი მანქანის ქირაობა,მანქანის დაჯავშნა ონლაინ, ავტომობილის დაქირავება, მანქანა დღიურად, ეკონომი მანქანის ქირაობა,аренда авто Грузия, аренда машины Тбилиси, прокат автомобилей Грузия, дешёвая аренда авто,аренда внедорожников, аренда авто онлайн, аренда автомобилей на день, прокат машин Тбилиси,alquiler de coches Georgia, renta de autos Georgia, alquiler de SUV, coches económicos, reservar coche online,تأجير سيارات جورجيا, استئجار سيارة في تبليسي, سيارات رخيصة للإيجار, حجز سيارة اونلاين,Auto mieten Georgien, Autovermietung Tiflis, SUV mieten, günstige Autovermietung,location de voiture Géorgie, louer une voiture Tbilissi, réserver une voiture en ligne,noleggio auto Georgia, affitto auto Tbilisi, auto di lusso a noleggio,Georgia car rental, rent a car near me, rent SUV Georgia, luxury car hire Tbilisi",
  language = "English",
}: SEOProps) {
  useEffect(() => {
    
    document.title = title;

    
    const updateMetaTag = (
      name: string,
      content: string,
      property?: string
    ) => {
      const selector = property
        ? `meta[property="${property}"]`
        : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;

      if (!meta) {
        meta = document.createElement("meta");
        if (property) {
          meta.setAttribute("property", property);
        } else {
          meta.setAttribute("name", name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

 
    updateMetaTag("description", description);
    updateMetaTag("keywords", keywords);

    
    updateMetaTag("", title, "og:title");
    updateMetaTag("", description, "og:description");
    updateMetaTag("", "website", "og:type");
    updateMetaTag("", window.location.href, "og:url");

    
    updateMetaTag("twitter:title", title);
    updateMetaTag("twitter:description", description);
    updateMetaTag("twitter:card", "summary_large_image");

    
    document.documentElement.lang = language === "English" ? "en" : "ru";

    
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description: description,
      url: window.location.href,
      inLanguage: language === "English" ? "en-US" : "ru-RU",
      isPartOf: {
        "@type": "WebSite",
        name: "AvtoNik Car Rental",
        url: window.location.origin,
      },
    };

    
    const existingScript = document.querySelector(
      'script[type="application/ld+json"][data-seo]'
    );
    if (existingScript) {
      existingScript.remove();
    }

    
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-seo", "true");
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
  }, [title, description, keywords, language]);

  return null;
}
