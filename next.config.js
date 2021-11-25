/** @type {import('next').NextConfig} */
module.exports = {
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
};
