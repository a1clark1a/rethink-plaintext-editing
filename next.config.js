// Removed withCSS https://github.com/vercel/next.js/blob/master/errors/built-in-css-disabled.md
// To be able to use CSS node_modules

module.exports = {
  webpack: config => {
    // Load SVGs inline
    config.module.rules.push({
      test: /\.svg$/,
      use: { loader: 'svg-inline-loader', options: {} }
    });
    return config;
  }
};
