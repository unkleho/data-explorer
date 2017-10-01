// External apps to proxy
module.exports = {
  '/api/abs': {
    target: 'http://stat.data.abs.gov.au',
    changeOrigin: true,
    pathRewrite: {
      '^/api/abs': '/sdmx-json',
    },
  },
  '/api/oecd': {
    target: 'http://stats.oecd.org',
    changeOrigin: true,
    pathRewrite: {
      '^/api/oecd': '/sdmx-json',
    },
  },
  '/api/ukds': {
    target: 'https://stats.ukdataservice.ac.uk',
    changeOrigin: true,
    pathRewrite: {
      '^/api/ukds': '/sdmx-json',
    },
  },
  '/api/unesco': {
    target: 'http://data.uis.unesco.org',
    changeOrigin: true,
    pathRewrite: {
      '^/api/unesco' : '/sdmx-json',
    },
  },
};
