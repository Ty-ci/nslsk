/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Candidate portraits (archive) are served straight off Google Drive.
    remotePatterns: [{ protocol: 'https', hostname: 'drive.google.com' }],
  },
  // The candidacy one-pager used to live at `/`, with these two older paths
  // redirecting to it. They now point into the archive instead.
  redirects: async () => [
    { source: '/otazky', destination: '/archiv/kandidatka2026#otazky', permanent: true },
    { source: '/dev', destination: '/archiv/kandidatka2026', permanent: true },
  ],
}

export default nextConfig
