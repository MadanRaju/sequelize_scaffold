const feathers = require('@feathersjs/feathers');
const express = require('@feathersjs/express');
const authentication = require('feathers-auth');

require('./extensions');
const appConfig = require('./configuration');
const middleware = require('./middleware');
const { getLogger } = require('./utils/logging');
const appHooks = require('./app.hooks');
const { sequelize } = require('./models');

const app = express(feathers());
app.configure(appConfig);

const logger = getLogger(app.get('appName'));
app.set('logger', logger);

app.configure(middleware);

app.use('/', (req, res, next) => {
  if (req.path === '/') res.send(`Welcome to ${app.get('appName')} app.`);
  else next();
});

app.configure(express.rest());

module.exports = sequelize.setupEnums(app).then(() => {
  app.configure(authentication(app.get('authentication')));
  app.configure(require('./services')); // eslint-disable-line global-require
  app.hooks(appHooks);

  app.use(express.notFound());
  app.use(express.errorHandler({ logger }));

  return app;
});
