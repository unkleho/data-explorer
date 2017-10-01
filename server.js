require('dotenv').config();

const express = require('express');
const next = require('next');
const proxy = require('http-proxy-middleware');

const dev = process.env.NODE_ENV !== 'production' && !process.env.NOW;
const app = next({ dev });
const routes = require('./routes');
const proxyRoutes = require('./routes/proxyRoutes');
const handler = routes.getRequestHandler(app);

console.log('----------------------------------');
console.log('Environment Variables:');
console.log('----------------------------------');
console.log(`PORT=${process.env.PORT}`);
console.log('----------------------------------');

const port = process.env.PORT || 3000;

app
  .prepare()
  .then(() => {
    const server = express();

    // server.use('/api/abs', proxy({
    //   target: 'http://stat.data.abs.gov.au',
    //   pathRewrite: {
    //     '^/api/abs' : '/sdmx-json',
    //   },
    // }));

    // server.use('/api/oecd/', proxy({
    //   target: 'http://stats.oecd.org/sdmx-json',
    //   pathRewrite: {
    //     '^/api/oecd/sdmx-json/' : '/sdmx-json/',
    //   },
    // }));
    //
    // server.use('/api/ukds/', proxy({
    //   target: 'https://stats.ukdataservice.ac.uk/sdmx-json',
    //   pathRewrite: {
    //     '^/api/ukds/sdmx-json/' : '/sdmx-json/',
    //   },
    // }));
    //
    // server.use('/api/ukds/', proxy({
    //   target: 'https://stats.ukdataservice.ac.uk/sdmx-json',
    //   pathRewrite: {
    //     '^/api/ukds/sdmx-json/' : '/sdmx-json/',
    //   },
    // }));

    // Proxy external apps
    Object.keys(proxyRoutes).forEach((route) => {
      server.use(route, proxy(proxyRoutes[route]));
    });

    // server.get('/example-page/:id', (req, res) => {
    //   const mergedQuery = Object.assign({}, req.query, req.params)
    //   return app.render(req, res, '/example-page', mergedQuery);
    // })

    server.all('*', (req, res) => handler(req, res));

    server.listen(port, err => {
      if (err) throw err;
      console.log(`> Ready on http://localhost:${port}`);
    });
  })
  .catch(ex => {
    console.error(ex.stack);
    process.exit(1);
  });
