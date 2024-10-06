/** @type {import('next').NextConfig} */
const nextConfig = {
  // Custom server settings
  devIndicators: {
    autoPrerender: false, // Disable auto prerendering for better polling behavior
  },
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 1000, // Check for changes every second
      aggregateTimeout: 300, // Delay before rebuilding after the first change
    };
    return config;
  },
};

module.exports = nextConfig;