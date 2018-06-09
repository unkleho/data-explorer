const routes = require('next-routes')();

routes
	.add('example-page', '/example-page/:id')
	.add('abs', '/abs/:dataSetSlug')
	.add('abs-encoded-params', '/abs/:dataSetSlug/:encodedParams')
	.add('oecd', '/oecd/:dataSetSlug')
	.add('ukds', '/ukds/:dataSetSlug')
	.add('unesco', '/unesco/:dataSetSlug')
	.add('about', '/about')
	.add('demo', '/demo');

module.exports = routes;
