import type { NextConfig } from "next";

const isGitHubPagesBuild = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: isGitHubPagesBuild ? "export" : undefined,
  images: isGitHubPagesBuild ? { unoptimized: true } : undefined,
};

export default nextConfig;
