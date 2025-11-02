/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  turbopack: {
    rules: {
      // Handle Mapbox GL JS
      'mapbox-gl': {
        loaders: [
          {
            loader: 'imports-loader',
            options: {
              imports: [
                'define mapboxgl',
                'define mapbox-gl/dist/mapbox-gl.js',
              ],
            },
          },
        ],
      },
    },
  },
  webpack: (config) => {
    // Handle Mapbox GL JS for webpack fallback
    config.resolve.alias = {
      ...config.resolve.alias,
      'mapbox-gl': 'mapbox-gl/dist/mapbox-gl.js',
    };

    // Ignore optional dependencies that cause issues
    config.externals = config.externals || [];
    config.externals.push({
      'utf-8-validate': 'utf-8-validate',
      'bufferutil': 'bufferutil',
      'supports-color': 'supports-color',
    });

    return config;
  },
}

export default nextConfig
