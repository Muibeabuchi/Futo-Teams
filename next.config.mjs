/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "quixotic-bass-65.convex.cloud",
        // port: "",
        // pathname: "/my-bucket/**",
      },
    ],
  },
};

export default nextConfig;
