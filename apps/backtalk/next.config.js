/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')([
  'common',
  'types',
  'smart-contracts',
]);

module.exports = withTM({
  webpack5: true,
  webpack: (config) => {
    // config.resolve.fallback = {
    //   fs: false,
    //   path: false,
    //   http: false,
    //   https: false,
    //   tls: false,
    //   os: false,
    //   crypto: false,
    //   zlib: false,
    //   stream: false,
    //   net: false,
    // };
    return config;
  },
  reactStrictMode: true,
  images: {
    domains: [
      'development.awwrats.com',
      'www.awwrats.com',
      'awwrats.com',
      'storage.googleapis.com',
    ],
  },
  experimental: {
    esmExternals: false,
  },
});
