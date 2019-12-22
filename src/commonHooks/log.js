const _ = require('lodash');

const { logging: LOGGING_CONFIGS } = require('../configuration')();

const LOGGED_SERVICES = {
  data: LOGGING_CONFIGS.dataLogging,
  result: LOGGING_CONFIGS.resultLogging,
  params: LOGGING_CONFIGS.paramsLogging,
};

const shouldLog = (type, serviceName) => {
  const loggedService = LOGGED_SERVICES[type];
  if (_.isBoolean(loggedService)) return loggedService;

  return _.isArray(loggedService) && loggedService.includes(serviceName);
};

const removeMaskedData = (data) => JSON.stringify(_.omitDeep(
  data, ...LOGGING_CONFIGS.maskedFields
));

module.exports = ({ service: { logger }, serviceName, ...context }) => {
  const message = [`[${context.params.trackingId}] {${context.type.toUpperCase()}} ${context.method.toUpperCase()} /${context.path} :`];
  if (context.type === 'error') {
    message.push(context.error.message);
    logger.error(message.join(' '));
  } else {
    if (context.params && shouldLog('params', serviceName)) {
      const paramsToLog = _.omit(context.params, 'provider', 'sequelize', 'headers', 'trackingId', 'payload');
      message.push(`params : ${removeMaskedData(paramsToLog)}`);
    }
    if (context.type === 'before' && context.data && shouldLog('data', serviceName)) { message.push(`data: ${removeMaskedData(context.data)}`); }
    if (context.result && shouldLog('result', serviceName)) { message.push(`result : ${removeMaskedData(context.result)}`); }
    logger.info(message.join(' '));
  }
};
