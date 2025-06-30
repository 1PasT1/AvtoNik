"use client";

import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  language?: string;
}

"use client";

import { useEffect } from "react";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  language?: string;
}
export function SEO({
  title = "AvtoNik - Rent a Car in Georgia | Best Car Rental Deals Nationwide",
  description = "AvtoNik offers fast, affordable, and reliable car rental services across Georgia. Choose from economy, luxury, and SUV vehicles. Book your rental car online now!",
  keywords = `
    car rental Georgia, rent a car Georgia, car hire Georgia, Tbilisi car rental, Batumi car rental, Kutaisi car rental,
    cheap car rental Georgia, SUV rental Georgia, luxury car rental Georgia, economy car hire Georgia, online car booking Georgia,
    best car rental deals Georgia, long term car rental Georgia, daily car rental Georgia, affordable car rental Georgia, automatic car rental Georgia,
    AvtoNik, Georgia car rental company, vehicle rental Georgia,

    მანქანის ქირაობა, იაფი მანქანის ქირაობა, იქირავე მანქანა, ავტო გაქირავება, თბილისი მანქანის ქირაობა,
    მანქანის დაჯავშნა ონლაინ, ავტომობილის დაქირავება, მანქანა დღიურად, ეკონომი მანქანის ქირაობა,

    аренда авто Грузия, аренда машины Тбилиси, прокат автомобилей Грузия, дешёвая аренда авто,
    аренда внедорожников, аренда авто онлайн, аренда автомобилей на день, прокат машин Тбилиси,

    alquiler de coches Georgia, renta de autos Georgia, alquiler de SUV, coches económicos, reservar coche online,
    تأجير سيارات جورجيا, استئجار سيارة في تبليسي, سيارات رخيصة للإيجار, حجز سيارة اونلاين,

    Auto mieten Georgien, Autovermietung Tiflis, SUV mieten, günstige Autovermietung,
    location de voiture Géorgie, louer une voiture Tbilissi, réserver une voiture en ligne,
    noleggio auto Georgia, affitto auto Tbilisi, auto di lusso a noleggio,

    Georgia car rental, rent a car near me, rent SUV Georgia, luxury car hire Tbilisi
  `.replace(/\s+/g, ' ').trim(),
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
