require('dotenv').config();

const express = require('express');
const next = require('next');
const proxy = require('http-proxy-middleware');
const csv = require('csv-express');

const dev = process.env.NODE_ENV !== 'production' && !process.env.NOW;
const app = next({ dev });
const routes = require('./routes');
const proxyRoutes = require('./routes/proxyRoutes');
const handler = routes.getRequestHandler(app);
const buildDownload = require('./lib/download.js');

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

		server.get('/download', async (req, res) => {
			try {
				// console.log(req.query);

				const result = await buildDownload({
					...req.query,
					selectedDimensions: JSON.parse(req.query.selectedDimensions),
				});
				// console.log(result);
				res.csv(result, true);
			} catch (e) {
				console.log(e);
			}
		});

		server.all('*', (req, res) => handler(req, res));

		server.listen(port, (err) => {
			if (err) throw err;
			console.log(`> Ready on http://localhost:${port}`);
		});
	})
	.catch((ex) => {
		console.error(ex.stack);
		process.exit(1);
	});
