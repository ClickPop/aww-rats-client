/** @type {import('next').NextConfig} */
const withTM = require('next-transpile-modules')([
  'common',
  'types',
  'smart-contracts',
]);

module.exports = withTM({
  webpack5: true,
  webpack: (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: { ...config.resolve.alias, fabric: 'fabric-pure-browser' },
      },
    };
  },
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/default-metadata/:test*',
        destination: '/default-erc721-token-metadata.json',
        permanent: true,
      },
    ];
  },
  images: {
    domains: [
      'development.awwrats.com',
      'www.awwrats.com',
      'awwrats.com',
      'storage.googleapis.com',
      'awwrats.infura-ipfs.io'
    ],
  },
  experimental: {
    esmExternals: false,
  },
});
