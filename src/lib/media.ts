/**
 * Typed media helpers for Astro components.
 * The implementation lives in media-url.mjs so Node scripts can share it.
 */
export {
  DEFAULT_PAYLOAD_PUBLIC_BASE,
  DEFAULT_TENANT_SLUG,
  extractMediaPath,
  getPayloadPublicBase,
  getTenantSlug,
  repairMediaUrlsInHtml,
  repairTenantR2Url,
  resolveMediaUrl,
  toAbsoluteUrl,
} from './media-url.mjs';

import { resolveMediaUrl, toAbsoluteUrl } from './media-url.mjs';
import { DEFAULT_BLOG_IMAGE, resolveFeaturedImage, type BlogImageData } from './blogImages';

export { DEFAULT_BLOG_IMAGE, resolveFeaturedImage, resolveFeaturedImageAlt } from './blogImages';

/** Site logo/OG default — a real file in public/, safe to always emit. */
export const DEFAULT_OG_IMAGE = '/images/2023/01/cropped-Group-79-180x180.png';

/** Resolve a single media value, keeping the site placeholder as fallback. */
export function resolveSiteMediaUrl(
  input: unknown,
  fallback: string | null = DEFAULT_BLOG_IMAGE,
): string | null {
  return resolveMediaUrl(input, { fallback });
}

/**
 * Hero / card / OG images for one post. `body` lets a post without an explicit
 * image field fall back to its first inline image instead of the placeholder.
 */
export function getEntryBlogImages(data: BlogImageData | undefined, body?: string) {
  const featured = resolveFeaturedImage(data, body, { fallback: DEFAULT_BLOG_IMAGE });
  const og =
    resolveMediaUrl((data as { ogImage?: unknown })?.ogImage, { fallback: null }) ??
    featured ??
    DEFAULT_OG_IMAGE;

  return { hero: featured, featured, og };
}

/** Absolute URL for og:image / JSON-LD. */
export function absoluteMediaUrl(url: string | null | undefined, siteOrigin: string) {
  return toAbsoluteUrl(url ?? DEFAULT_OG_IMAGE, siteOrigin);
}
