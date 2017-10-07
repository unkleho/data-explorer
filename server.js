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
console.log(`GRAPHQL_URL=${process.env.GRAPHQL_URL}`);
console.log(`NOW_URL=${process.env.NOW_URL}`);
console.log('----------------------------------');

const port = process.env.PORT || 3000;

app
  .prepare()
  .then(() => {
    const server = express();

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
