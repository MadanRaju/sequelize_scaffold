const url = require('url');

const app = require('../src/app');

const port = app.get('PORT') || 3031;
const getUrl = (pathname) => url.format({
  hostname: app.get('host') || 'localhost',
  protocol: 'http',
  port,
  pathname,
});

module.exports = {
  port,
  getUrl,
  baseUrl: getUrl(''),
  app,
  appName: app.get('appName'),
};
