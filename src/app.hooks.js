const _ = require('lodash');
const uuid = require('uuid/v4');
const { ValidationError, ValidationErrorItem } = require('sequelize');

const { log } = require('./commonHooks');
const { getLogger } = require('./utils/logging');

const addTrackingId = (context) => {
  context.params.trackingId = context.params.trackingId || uuid();
};

const setServiceNameAndLogger = (context) => {
  const serviceName = context.service.name || _.camelCase(context.path.replace(/_*[:?&=/]+_*/g, '_'));
  context.service.logger = getLogger(serviceName);
  context.serviceName = serviceName;
};

const pretifyErrorResponse = (context) => {
  if (context.error.type === 'FeathersError' && context.error.errors) {
    const [validationErrors, otherErrors] = _.partition(
      _.castArray(context.error.errors),
      (error) => (error instanceof ValidationError || error instanceof ValidationErrorItem)
    );
    context.error.errors = {};
    if (!_.isEmpty(validationErrors)) {
      context.error.errors.validationErrors = _.reduce(validationErrors,
        (errors, { message, path }) => Object.assign(errors, { [path]: message }), {});
    }
    if (!_.isEmpty(otherErrors)) context.error.errors.otherErrors = _.map(otherErrors, 'message');
  }
};

const setDefaultSortOrder = (context) => {
  const { query = {} } = context.params;
  if (!query.$sort) {
    query.$sort = {
      createdAt: -1,
    };
  }
  context.params.query = query;
};

const initSequelizeParams = (context) => {
  context.params.sequelize = _.defaultTo(context.params.sequelize, {});
};

module.exports = {
  before: {
    all: [addTrackingId, setServiceNameAndLogger, log, initSequelizeParams],
    find: [setDefaultSortOrder],
  },
  after: {
    all: [log],
  },
  error: {
    all: [log, pretifyErrorResponse],
  },
};
