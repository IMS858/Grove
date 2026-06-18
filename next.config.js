/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Supabase Edge Functions use Deno types - ignore during Next.js build
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}
module.exports = nextConfig
