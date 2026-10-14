import type { MetadataRoute } from 'next'

// An internal web: nothing on it is meant for search engines. Both root layouts
// also set `noindex`, for crawlers that ignore robots.txt.
const robots = (): MetadataRoute.Robots => ({
  rules: { userAgent: '*', disallow: '/' },
})

export default robots
