const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const pathMatch = require('path-match');

const dev = process.env.NODE_ENV !== 'production' && !process.env.NOW;
const app = next({ dev });
const handle = app.getRequestHandler();
const route = pathMatch();
const match = route('/example-page/:id');

app.prepare()
.then(() => {
  createServer((req, res) => {
    const { pathname } = parse(req.url);
    const params = match(pathname);

    if (params === false) {
      handle(req, res);
      return;
    }

    app.render(req, res, '/example-page', params);
  })
  .listen(process.env.PORT || 3000, (err) => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${process.env.PORT}`);
  })
});
