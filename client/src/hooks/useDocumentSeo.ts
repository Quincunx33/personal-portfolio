import { useEffect } from "react";

export interface SeoOptions {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string;
  robots?: string;
  ogType?: string;
  ogImage?: string;
  jsonLd?: Record<string, unknown> | Array<Record<string, unknown>>;
}

const DEFAULT_CANONICAL = "https://taissu.pages.dev/";

export function useDocumentSeo({
  title,
  description,
  canonical,
  keywords = "Tasfiya Tabassum, Quincunx33, taaissu, security researcher, full-stack engineer, React, TypeScript, Linux kernel, Alpine x86, penetration testing, PS2 WebXperience, ishkali VNC, Kali Minimal, penbox, phishGard",
  robots = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  ogType = "website",
  ogImage = "https://taissu.pages.dev/assets/taaissu-hero-texture.jpg",
  jsonLd,
}: SeoOptions) {
  useEffect(() => {
    // 1. Dynamic document title
    document.title = title;

    // Resolve canonical URL dynamically if in browser
    const resolvedCanonical =
      canonical ||
      (typeof window !== "undefined" && window.location.origin
        ? `${window.location.origin}${window.location.pathname}`
        : DEFAULT_CANONICAL);

    // Helper to set or create meta tag
    const setMeta = (nameAttr: "name" | "property", key: string, content: string) => {
      let element = document.querySelector<HTMLMetaElement>(`meta[${nameAttr}="${key}"]`);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(nameAttr, key);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // 2. Standard Meta Tags
    setMeta("name", "description", description);
    setMeta("name", "keywords", keywords);
    setMeta("name", "robots", robots);
    setMeta("name", "author", "Tasfiya Tabassum (Quincunx33)");

    // 3. Open Graph
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", resolvedCanonical);
    setMeta("property", "og:type", ogType);
    setMeta("property", "og:site_name", "taaissu (Quincunx33)");
    if (ogImage) {
      setMeta("property", "og:image", ogImage);
      setMeta("property", "og:image:secure_url", ogImage);
      setMeta("property", "og:image:alt", title);
    }

    // 4. Twitter / X Cards
    setMeta("name", "twitter:card", "summary_large_image");
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    setMeta("name", "twitter:site", "@taaissu");
    setMeta("name", "twitter:creator", "@taaissu");
    if (ogImage) {
      setMeta("name", "twitter:image", ogImage);
      setMeta("name", "twitter:image:alt", title);
    }

    // 5. Canonical link tag
    let canonicalTag = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute("href", resolvedCanonical);

    // 6. Optional Dynamic JSON-LD structured data script
    let dynamicLdScript: HTMLScriptElement | null = null;
    if (jsonLd) {
      const scriptId = "dynamic-seo-jsonld";
      dynamicLdScript = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (!dynamicLdScript) {
        dynamicLdScript = document.createElement("script");
        dynamicLdScript.id = scriptId;
        dynamicLdScript.type = "application/ld+json";
        document.head.appendChild(dynamicLdScript);
      }
      dynamicLdScript.textContent = JSON.stringify(jsonLd);
    }

    return () => {
      // Clean up dynamic jsonld if component unmounts
      if (dynamicLdScript && dynamicLdScript.parentNode) {
        dynamicLdScript.parentNode.removeChild(dynamicLdScript);
      }
    };
  }, [title, description, canonical, keywords, robots, ogType, ogImage, jsonLd]);
}
