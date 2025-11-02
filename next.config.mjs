import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost:3000",
      },
      
    ],
    
  },
   experimental: {
    serverActions: {
      bodySizeLimit: '200mb',
    },
  },
};

export default withNextIntl(nextConfig);
