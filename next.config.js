/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BASE_URL: process.env.BASE_URL,
    RECAPTCHA_SITE_KEY: process.env.RECAPTCHA_SITE_KEY,
    RECAPTCHA_SITE_KEY_V2: process.env.RECAPTCHA_SITE_KEY_V2,
    RAZORPAY_KEY: process.env.RAZORPAY_KEY,
    AUTH_CLIENT_ID: process.env.AUTH_CLIENT_ID,
    ENCRYPT_VECTOR_KEY: process.env.ENCRYPT_VECTOR_KEY,
    ENCRYPT_PUBLIC_KEY: process.env.ENCRYPT_PUBLIC_KEY,
    MS_CLARITY_KEY: process.env.MS_CLARITY_KEY,
    GOOGLE_TAG_MANAGER_ID: process.env.GOOGLE_TAG_MANAGER_ID,
    META_PIXEL_ID: process.env.META_PIXEL_ID,
    GOOGLE_ANALYTICS_ID: process.env.GOOGLE_ANALYTICS_ID,
    NEST_BASE_URL: process.env.NEST_BASE_URL,
    GOOGLE_ADS_ID: process.env.GOOGLE_ADS_ID,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.cloudfront.net',
        port: '',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'media.cerebellumacademy.com',
        port: '',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/vi/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
module.exports = nextConfig;
