/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')([
  'common',
  'types',
  'smart-contracts',
]);

module.exports = withTM({
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  webpack5: true,
  reactStrictMode: true,
  images: {
    domains: [
      'development.awwrats.com',
      'www.awwrats.com',
      'awwrats.com',
      'storage.googleapis.com',
    ],
  },
});
