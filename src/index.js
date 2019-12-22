const appLoader = require('./app');

appLoader.then((app) => {
  const APP_NAME = app.get('appName');
  const port = app.get('port');
  const logger = app.get('logger');
  const server = app.listen(port);

  server.on('listening', () => {
    logger.info('%s application started on http://%s:%s', APP_NAME, app.get('host'), port);
  });

  process.on('unhandledRejection', (reason, p) => logger.error('Unhandled Rejection at: Promise %s with reason %s', p, reason));

  process.on('uncaughtException', (error) => {
    logger.error('Unhandled Exception at: ', error.stack);
  });
});
