# Colegio Militarizado + Blog Strapi

Sitio Astro v6 con integración de blog en modo SSG consumiendo contenido desde Strapi.

## Requisitos

- Node 22.12 o superior
- Astro 6
- Instancia Strapi disponible

## Variables de entorno

Define estas variables en `.env`:

```bash
STRAPI_URL=http://localhost:1337
STRAPI_TOKEN=
```

`STRAPI_TOKEN` es opcional si tu API de lectura es pública.
<!--
## Modelo de contenido en Strapi

### Collection Type: Post

- `title` (Text short)
- `slug` (UID, enlazado a `title`)
- `content` (Blocks rich text)
- `excerpt` (Text long)
- `coverImage` (Media single)
- `publishDate` (Date)
- `readingTime` (Number, opcional)
- `author` (Relation N:1 -> Author)
- `category` (Relation N:1 -> Category)
- `tags` (Relation N:N -> Tag)
- `seo` (Component -> Shared.Seo)

Activa Draft & Publish para poder filtrar borradores en Astro.

### Collection Type: Author

- `name` (Text short)
- `avatar` (Media single)
- `bio` (Text long)
- `socialLinks` (Component repeatable -> Shared.SocialLink)

### Component: Shared.SocialLink

- `platform` (Enumeration)
- `url` (Text)

### Collection Type: Category

- `name` (Text short)
- `slug` (UID)
- `color` (Text short con hex, por ejemplo `#f97316`)


### Collection Type: Tag

- `name` (Text short)
- `slug` (UID)

### Component: Shared.Seo

- `metaTitle` (Text short, max 60)
- `metaDescription` (Text long, max 160)
- `shareImage` (Media single)
-->
## Permisos API (Strapi)

En Roles/Permissions o API Tokens, habilita lectura para:
- Posts
- Authors
- Categories
- Tags

Si usarás token, coloca el valor en `STRAPI_TOKEN`.

## Rutas implementadas

- `/blog` listado de posts
- `/blog/[slug]` detalle de post

Reglas clave implementadas:
- Solo se generan páginas para posts publicados (`publishedAt` no nulo).
- SEO por entrada usando `Shared.Seo` con fallback a título + extracto + portada.
- Render de `content` (Blocks) usando `blocks-html-renderer`.

## Archivos principales de la integración

- `src/lib/strapi/client.ts`
- `src/lib/strapi/mappers.ts`
- `src/lib/strapi/types.ts`
- `src/lib/strapi/blocks.ts`
- `src/pages/blog/index.astro`
- `src/pages/blog/[slug].astro`
- `src/components/blog/BlogCard.astro`
- `src/components/blog/PostMeta.astro`
- `src/components/blog/PostAuthor.astro`
- `src/layouts/Layout.astro`

## Comandos

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Siguiente paso recomendado

Configurar un webhook en Strapi para disparar el rebuild del sitio al publicar un post (ya que el blog está en SSG).
