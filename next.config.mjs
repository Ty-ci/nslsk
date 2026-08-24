/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Candidate portraits are served straight off Google Drive.
    remotePatterns: [{ protocol: 'https', hostname: 'drive.google.com' }],
  },
}

export default nextConfig
