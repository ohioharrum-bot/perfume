/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['rvgfbbjclpaznfkfvcdl.supabase.co'],
  },
}

module.exports = nextConfig