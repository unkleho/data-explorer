const routes = require('next-routes')();

routes
	.add('example-page', '/example-page/:id')
	.add('abs', '/abs/:dataSetSlug')
	.add('oecd', '/oecd/:dataSetSlug')
	.add('ukds', '/ukds/:dataSetSlug')
	.add('unesco', '/unesco/:dataSetSlug')
	.add('images', '/images/:orgSlug/:dataSetSlug')
	.add('about', '/about')
	// WIP
	.add('abs-encoded-params', '/abs/:dataSetSlug/:encodedParams')
	.add('demo', '/demo');

module.exports = routes;
