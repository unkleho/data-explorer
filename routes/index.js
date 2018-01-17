const routes = require('next-routes')();

routes
	.add('example-page', '/example-page/:id')
	.add('abs', '/abs/:id')
	.add('oecd', '/oecd/:id')
	.add('ukds', '/ukds/:id')
	.add('unesco', '/unesco/:id')
	.add('about', '/about')
	.add('demo', '/demo');

module.exports = routes;
