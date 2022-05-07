/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')([
  'common',
  'types',
  'smart-contracts',
]);

module.exports = withTM({
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
