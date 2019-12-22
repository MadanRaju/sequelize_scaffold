const _ = require('lodash');
const Sequelize = require('sequelize');

const { database: DATABASE_CONFIGS } = require('../configuration')();
const logger = require('./logging').getLogger('sequelize');

DATABASE_CONFIGS.logging = logger[DATABASE_CONFIGS.logging];

const convertWhereCondition = (condition, convertFunc) => {
  const convertRecursive = _.partialRight(convertWhereCondition, convertFunc);
  if (_.isArray(condition)) {
    return _.map(condition, convertRecursive);
  }
  if (_.isPlainObject(condition)) {
    return _.mapValues(condition, convertRecursive);
  }
  return convertFunc(condition);
};

module.exports = {
  getInstance: () => ((DATABASE_CONFIGS.useEnvVariable)
    ? new Sequelize(process.env[DATABASE_CONFIGS.useEnvVariable], DATABASE_CONFIGS)
    : new Sequelize(DATABASE_CONFIGS)),
  convertWhereCondition,
  convertFindClause: (attribute, convertFunc) => (query) => {
    const whereCondition = _.get(query, `where.${attribute}`);
    if (!_.isUndefined(whereCondition)) {
      query.where[attribute] = convertWhereCondition(whereCondition, convertFunc);
    }
  },
};
