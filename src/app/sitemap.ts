import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: "https://chungi.kr", lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: "https://chungi.kr/brain", lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: "https://chungi.kr/gijildo", lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: "https://chungi.kr/privacy", lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: "https://chungi.kr/terms", lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];
}
