import { getCollection, type CollectionEntry } from 'astro:content'
import { isSpamBlogPost } from './spam-blog'

/** Posts per page on /blog/ and /blogs/ */
export const BLOG_PAGE_SIZE = 12

type Post = CollectionEntry<'blog'>

/**
 * Publication time used for ordering. pubDate/date first, updatedDate only as a
 * fallback when neither exists — sorting by updatedDate would push an old post
 * above a newer one while the card still shows its original pubDate.
 */
function postTimestamp(post: Post): number {
  const candidates = [post.data.pubDate, post.data.date, post.data.updatedDate]
  for (const value of candidates) {
    if (value instanceof Date && !Number.isNaN(value.valueOf())) return value.valueOf()
  }
  return 0
}

/**
 * Single source of truth for "is this post live?". Every listing and every
 * getStaticPaths must go through getBlogPosts() so a post can never appear in
 * one place and 404 in another.
 */
export function isPublished(post: Post): boolean {
  if (post.data.draft) return false
  if (post.data._status && post.data._status !== 'published') return false
  if (isSpamBlogPost(post.id, post.body ?? '', post.data.title ?? '')) return false
  return true
}

/** Newest-first published posts from the local collection (filled by Payload sync). */
export async function getBlogPosts(): Promise<Post[]> {
  const posts = await getCollection('blog', ({ data }) => !data.draft)
  return posts.filter(isPublished).sort((a, b) => postTimestamp(b) - postTimestamp(a))
}

/** Latest N published posts, for the homepage and related-post blocks. */
export async function getRecentBlogPosts(limit = 6): Promise<Post[]> {
  return (await getBlogPosts()).slice(0, limit)
}
