const routes = require('next-routes')();

routes
  .add('example-page', '/example-page/:id');
  // .add('abs', '/abs')
  // .add('oecd', '/oecd')
  // .add('ukds', '/ukds')
  // .add('unesco', '/unesco');

module.exports = routes;
