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
      {
        source: '/closet/images/:path*',
        destination:
          'https://storage.cloud.google.com/aww-rats/closet/images/:path*',
        permanent: false,
      },
      {
        source: '/closet/image-thumbnails/:path*',
        destination:
          'https://storage.cloud.google.com/aww-rats/closet/image-thumbnails/:path*',
        permanent: false,
      },
      {
        source: '/closet/tokens/:path*',
        destination:
          'https://storage.cloud.google.com/aww-rats/closet/tokens/:path*',
        permanent: false,
      },
    ];
  },
  images: {
    domains: ['development.awwrats.com', 'www.awwrats.com', 'awwrats.com'],
  },
};
