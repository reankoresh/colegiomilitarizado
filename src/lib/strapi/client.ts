import { mapPost } from "./mappers";
import type { StrapiPost } from "./types";

const STRAPI_URL = import.meta.env.STRAPI_URL;
const STRAPI_TOKEN = import.meta.env.STRAPI_TOKEN;

const ensureBaseUrl = (): string | undefined => {
  if (typeof STRAPI_URL !== "string" || STRAPI_URL.trim().length === 0) {
    return undefined;
  }
  return STRAPI_URL.replace(/\/$/, "");
};

const baseUrl = ensureBaseUrl();

const fetchStrapi = async (pathWithQuery: string): Promise<unknown> => {
  if (!baseUrl) return null;

  const headers: HeadersInit = {};
  if (typeof STRAPI_TOKEN === "string" && STRAPI_TOKEN.trim().length > 0) {
    headers.Authorization = `Bearer ${STRAPI_TOKEN}`;
  }

  const response = await fetch(`${baseUrl}${pathWithQuery}`, {
    headers,
  });

  if (!response.ok) {
    throw new Error(`Strapi request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

const extractDataArray = (payload: unknown): unknown[] => {
  if (typeof payload !== "object" || payload === null) return [];

  const data = (payload as Record<string, unknown>).data;
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") return [data];

  return [];
};

const postQuery = (() => {
  const query = new URLSearchParams();

  query.append("sort[0]", "publishDate:desc");
  query.append("sort[1]", "publishedAt:desc");
  query.append("filters[publishedAt][$notNull]", "true");

  query.append("fields[0]", "title");
  query.append("fields[1]", "slug");
  query.append("fields[2]", "excerpt");
  query.append("fields[3]", "content");
  query.append("fields[4]", "publishDate");
  query.append("fields[5]", "publishedAt");
  query.append("fields[6]", "readingTime");

  query.append("populate[coverImage][fields][0]", "url");
  query.append("populate[author][fields][0]", "name");
  query.append("populate[author][fields][1]", "bio");
  query.append("populate[author][populate][avatar][fields][0]", "url");
  query.append("populate[author][populate][socialLinks][fields][0]", "platform");
  query.append("populate[author][populate][socialLinks][fields][1]", "url");

  query.append("populate[category][fields][0]", "name");
  query.append("populate[category][fields][1]", "slug");
  query.append("populate[category][fields][2]", "color");

  query.append("populate[tags][fields][0]", "name");
  query.append("populate[tags][fields][1]", "slug");

  query.append("populate[seo][fields][0]", "metaTitle");
  query.append("populate[seo][fields][1]", "metaDescription");
  query.append("populate[seo][populate][shareImage][fields][0]", "url");

  return query.toString();
})();

export const getAllPosts = async (): Promise<StrapiPost[]> => {
  if (!baseUrl) return [];

  const payload = await fetchStrapi(`/api/posts?${postQuery}&pagination[pageSize]=100`);
  const data = extractDataArray(payload);

  return data
    .map((item) => mapPost(item, baseUrl))
    .filter((post): post is StrapiPost => Boolean(post));
};

export const getPostBySlug = async (slug: string): Promise<StrapiPost | undefined> => {
  if (!baseUrl) return undefined;

  const query = `${postQuery}&filters[slug][$eq]=${encodeURIComponent(slug)}&pagination[pageSize]=1`;
  const payload = await fetchStrapi(`/api/posts?${query}`);
  const data = extractDataArray(payload);
  const item = data[0];

  return mapPost(item, baseUrl);
};

export const hasStrapiConfig = (): boolean => Boolean(baseUrl);
