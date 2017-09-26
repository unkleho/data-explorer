// External apps to proxy
module.exports = {
  // TODO: Function to redirect /XXXX to /XXXX/, otherwise WP redirects it.
  '/abs/sdmx-json/': {
    target: 'http://stat.data.abs.gov.au/sdmx-json/',
    // changeOrigin: true,
    proxyReqPathResolver(req) {
      console.log(req);
      const reqPath = url.parse(req.url).path;
      return ['/sdmx-json', reqPath].join('/');
    }
  },
};

// const proxyPath = '/other/path'
// app.use('/somePath', proxy('http://other.server/other/path', {
//     proxyReqPathResolver(req) {
//         const reqPath = url.parse(req.url).path;
//         return [proxyPath, reqPath].join('/');
//     }
// }));
