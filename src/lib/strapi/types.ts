export interface StrapiSocialLink {
  platform: string;
  url: string;
}

export interface StrapiAuthor {
  id: number | string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  socialLinks: StrapiSocialLink[];
}

export interface StrapiCategory {
  id: number | string;
  name: string;
  slug: string;
  color?: string;
}

export interface StrapiTag {
  id: number | string;
  name: string;
  slug: string;
}

export interface StrapiSeo {
  metaTitle?: string;
  metaDescription?: string;
  shareImageUrl?: string;
}

export interface StrapiPost {
  id: number | string;
  title: string;
  slug: string;
  excerpt?: string;
  content: unknown[];
  coverImageUrl?: string;
  publishDate?: string;
  publishedAt?: string;
  readingTime?: number;
  author?: StrapiAuthor;
  category?: StrapiCategory;
  tags: StrapiTag[];
  seo?: StrapiSeo;
}
