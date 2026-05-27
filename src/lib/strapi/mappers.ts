import type {
  StrapiAuthor,
  StrapiCategory,
  StrapiPost,
  StrapiSeo,
  StrapiSocialLink,
  StrapiTag,
} from "./types";

type UnknownRecord = Record<string, unknown>;

const asRecord = (value: unknown): UnknownRecord | undefined => {
  if (typeof value === "object" && value !== null) {
    return value as UnknownRecord;
  }
  return undefined;
};

const unwrapData = (value: unknown): unknown => {
  const record = asRecord(value);
  if (!record) return value;
  if ("data" in record) return record.data;
  return value;
};

const readField = (entity: unknown, key: string): unknown => {
  const unwrapped = asRecord(unwrapData(entity));
  if (!unwrapped) return undefined;

  const attributes = asRecord(unwrapped.attributes);
  if (attributes && key in attributes) {
    return attributes[key];
  }

  return unwrapped[key];
};

const toStringValue = (value: unknown): string | undefined => {
  if (typeof value === "string" && value.trim().length > 0) return value;
  return undefined;
};

const toNumberValue = (value: unknown): number | undefined => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
};

const toArray = (value: unknown): unknown[] => {
  const unwrapped = unwrapData(value);
  if (Array.isArray(unwrapped)) return unwrapped;
  return [];
};

const toAbsoluteUrl = (url: string | undefined, baseUrl: string): string | undefined => {
  if (!url) return undefined;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;

  try {
    return new URL(url, baseUrl).toString();
  } catch {
    return url;
  }
};

const extractMediaUrl = (value: unknown, baseUrl: string): string | undefined => {
  const unwrapped = unwrapData(value);

  if (Array.isArray(unwrapped)) {
    return extractMediaUrl(unwrapped[0], baseUrl);
  }

  const url = toStringValue(readField(unwrapped, "url"));
  return toAbsoluteUrl(url, baseUrl);
};

const mapSocialLinks = (value: unknown): StrapiSocialLink[] => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      const platform = toStringValue(readField(item, "platform"));
      const url = toStringValue(readField(item, "url"));
      if (!platform || !url) return undefined;
      return { platform, url };
    })
    .filter((item): item is StrapiSocialLink => Boolean(item));
};

const estimateReadingTime = (text: string): number => {
  const words = text
    .replace(/<[^>]*>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;

  if (words === 0) return 1;
  return Math.max(1, Math.ceil(words / 220));
};

const flattenBlockText = (nodes: unknown[]): string => {
  const chunks: string[] = [];

  const walk = (node: unknown): void => {
    const record = asRecord(node);
    if (!record) return;

    const text = toStringValue(record.text);
    if (text) chunks.push(text);

    const children = record.children;
    if (Array.isArray(children)) {
      for (const child of children) {
        walk(child);
      }
    }
  };

  for (const node of nodes) {
    walk(node);
  }

  return chunks.join(" ");
};

export const mapAuthor = (value: unknown, baseUrl: string): StrapiAuthor | undefined => {
  const id = readField(value, "id");
  const name = toStringValue(readField(value, "name"));
  if (!name || (typeof id !== "number" && typeof id !== "string")) return undefined;

  const bio = toStringValue(readField(value, "bio"));
  const avatarUrl = extractMediaUrl(readField(value, "avatar"), baseUrl);
  const socialLinks = mapSocialLinks(readField(value, "socialLinks"));

  return { id, name, bio, avatarUrl, socialLinks };
};

export const mapCategory = (value: unknown): StrapiCategory | undefined => {
  const id = readField(value, "id");
  const name = toStringValue(readField(value, "name"));
  const slug = toStringValue(readField(value, "slug"));

  if (!name || !slug || (typeof id !== "number" && typeof id !== "string")) {
    return undefined;
  }

  const color = toStringValue(readField(value, "color"));
  return { id, name, slug, color };
};

export const mapTag = (value: unknown): StrapiTag | undefined => {
  const id = readField(value, "id");
  const name = toStringValue(readField(value, "name"));
  const slug = toStringValue(readField(value, "slug"));

  if (!name || !slug || (typeof id !== "number" && typeof id !== "string")) {
    return undefined;
  }

  return { id, name, slug };
};

export const mapSeo = (value: unknown, baseUrl: string): StrapiSeo | undefined => {
  const raw = asRecord(value);
  if (!raw) return undefined;

  const metaTitle = toStringValue(readField(raw, "metaTitle"));
  const metaDescription = toStringValue(readField(raw, "metaDescription"));
  const shareImageUrl = extractMediaUrl(readField(raw, "shareImage"), baseUrl);

  if (!metaTitle && !metaDescription && !shareImageUrl) return undefined;
  return { metaTitle, metaDescription, shareImageUrl };
};

export const mapPost = (value: unknown, baseUrl: string): StrapiPost | undefined => {
  const id = readField(value, "id");
  const title = toStringValue(readField(value, "title"));
  const slug = toStringValue(readField(value, "slug"));

  if (!title || !slug || (typeof id !== "number" && typeof id !== "string")) {
    return undefined;
  }

  const excerpt = toStringValue(readField(value, "excerpt"));
  const contentValue = readField(value, "content");
  const content = Array.isArray(contentValue) ? contentValue : [];
  const coverImageUrl = extractMediaUrl(readField(value, "coverImage"), baseUrl);
  const publishDate =
    toStringValue(readField(value, "publishDate")) ||
    toStringValue(readField(value, "publicationDate"));
  const publishedAt = toStringValue(readField(value, "publishedAt"));

  const author = mapAuthor(readField(value, "author"), baseUrl);
  const category = mapCategory(readField(value, "category"));
  const tags = toArray(readField(value, "tags"))
    .map((tag) => mapTag(tag))
    .filter((tag): tag is StrapiTag => Boolean(tag));

  const seo = mapSeo(readField(value, "seo"), baseUrl);

  const readingTime =
    toNumberValue(readField(value, "readingTime")) ||
    estimateReadingTime(`${excerpt ?? ""} ${flattenBlockText(content)}`);

  return {
    id,
    title,
    slug,
    excerpt,
    content,
    coverImageUrl,
    publishDate,
    publishedAt,
    readingTime,
    author,
    category,
    tags,
    seo,
  };
};
