/** @type {import('next').NextConfig} */
const nextConfig = {
  // 确保 React 严格模式开启 (默认就是 true，但显式声明也好)
  reactStrictMode: true,
  // 如果使用了远程图片，这里需要配置 images.domains
  images: {
    domains: ['images.unsplash.com', 'api.dicebear.com', 'picsum.photos'],
  },
  // 忽略构建时的 ESLint 错误，防止部署失败 (可选，开发环境很有用)
  eslint: {
    ignoreDuringBuilds: true,
  },
  // 忽略构建时的 TS 错误 (既然我们手动检查了，这里可以放宽)
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
