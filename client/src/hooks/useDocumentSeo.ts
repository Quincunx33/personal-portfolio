import { useEffect } from "react";

export interface SeoOptions {
  title: string;
  description: string;
  canonical?: string;
  robots?: string;
  ogType?: string;
  ogImage?: string;
}

const DEFAULT_CANONICAL = "https://taissu.pages.dev/";

export function useDocumentSeo({
  title,
  description,
  canonical = DEFAULT_CANONICAL,
  robots = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1",
  ogType = "website",
  ogImage = "https://taissu.pages.dev/assets/taaissu-hero-texture.jpg",
}: SeoOptions) {
  useEffect(() => {
    // 1. Title
    document.title = title;

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

    // 2. Standard Meta
    setMeta("name", "description", description);
    setMeta("name", "robots", robots);

    // 3. Open Graph
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonical);
    setMeta("property", "og:type", ogType);
    if (ogImage) {
      setMeta("property", "og:image", ogImage);
    }

    // 4. Twitter Cards
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);
    if (ogImage) {
      setMeta("name", "twitter:image", ogImage);
    }

    // 5. Canonical link tag
    let canonicalTag = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement("link");
      canonicalTag.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute("href", canonical);
  }, [title, description, canonical, robots, ogType, ogImage]);
}
