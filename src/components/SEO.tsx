"use client";

import { useEffect } from "react";

/**
 * The canonical origin. Everything absolute is built from this.
 *
 * The old version of this file never touched the canonical tag at all, so
 * the hardcoded `https://avtonik.com/` in index.html stayed on every route
 * — telling Google the real page lived on a domain this site is not served
 * from. That is what produced "Alternate page with proper canonical tag"
 * and zero indexed pages.
 */
export const SITE_ORIGIN = "https://autonik.rentals";

interface SEOProps {
  title?: string;
  description?: string;
  /** Path only, e.g. "/cars". Defaults to the current location. */
  path?: string;
  image?: string;
  language?: string;
  /** Set for pages that must never be indexed (thank-you pages, etc). */
  noindex?: boolean;
  /** Extra JSON-LD to publish alongside the page description. */
  structuredData?: Record<string, unknown>;
}

const DEFAULT_TITLE =
  "Car Rental in Batumi | AvtoNik — Rent a Car in Georgia";
const DEFAULT_DESCRIPTION =
  "Rent a car in Batumi from AvtoNik. Economy, SUV and luxury cars with airport pickup, no hidden fees and instant online booking.";

function upsertMeta(key: string, content: string, asProperty = false) {
  const selector = asProperty
    ? `meta[property="${key}"]`
    : `meta[name="${key}"]`;

  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(asProperty ? "property" : "name", key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function upsertLink(rel: string, href: string, hreflang?: string) {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;

  let el = document.querySelector(selector) as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    if (hreflang) el.setAttribute("hreflang", hreflang);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

export function SEO({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path,
  image = `${SITE_ORIGIN}/og-image.jpg`,
  language = "English",
  noindex = false,
  structuredData,
}: SEOProps) {
  useEffect(() => {
    // Build the canonical from a clean path: query strings and hashes
    // create duplicate URLs that split ranking signals.
    const cleanPath = (path ?? window.location.pathname).split(/[?#]/)[0];
    const canonical =
      SITE_ORIGIN + (cleanPath === "/" ? "/" : cleanPath.replace(/\/+$/, ""));

    document.title = title;

    upsertMeta("description", description);
    upsertMeta(
      "robots",
      noindex
        ? "noindex, nofollow"
        : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
    );

    upsertLink("canonical", canonical);

    upsertMeta("og:title", title, true);
    upsertMeta("og:description", description, true);
    upsertMeta("og:type", "website", true);
    upsertMeta("og:url", canonical, true);
    upsertMeta("og:image", image, true);

    upsertMeta("twitter:title", title);
    upsertMeta("twitter:description", description);
    upsertMeta("twitter:card", "summary_large_image");
    upsertMeta("twitter:image", image);

    document.documentElement.lang = language === "Русский" ? "ru" : "en";

    // Page-level JSON-LD. Replaced rather than appended, so navigating
    // between routes does not leave stale graphs behind.
    const graph = structuredData ?? {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: title,
      description,
      url: canonical,
      inLanguage: language === "Русский" ? "ru-RU" : "en-US",
      isPartOf: {
        "@type": "WebSite",
        name: "AvtoNik Car Rental",
        url: SITE_ORIGIN,
      },
    };

    document
      .querySelectorAll('script[type="application/ld+json"][data-seo]')
      .forEach((s) => s.remove());

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.setAttribute("data-seo", "true");
    script.textContent = JSON.stringify(graph);
    document.head.appendChild(script);
  }, [title, description, path, image, language, noindex, structuredData]);

  return null;
}
