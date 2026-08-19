/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/academia',
  reactStrictMode: true,
  typescript: {
    tsconfigPath: './tsconfig.json'
  }
};

module.exports = nextConfig;
