/** @type {import('next').NextConfig} */
module.exports = {
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
