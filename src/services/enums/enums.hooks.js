const _ = require('lodash');
const { disallow, required } = require('feathers-hooks-common');
const { NotFound } = require('feathers-errors');
const { hooks: { authenticateJWT } } = require('feathers-auth');


const { restrictToRole } = require('../../commonHooks');
const { User: { Role } } = require('../../models');
const EnumsClass = require('./enums.class');

const restrictToAdmins = [authenticateJWT, restrictToRole(Role.SYSTEM_ADMIN, Role.ADMIN)];

const validateEnumType = (context) => {
  const enumType = _.get(context.params, 'route.enumType');
  const exception = new NotFound('Page not found', { url: `/enums/${enumType}` });
  if (!enumType) {
    throw exception;
  }
  if (context.method !== 'create' && !EnumsClass.findEnum(context.app.get('enums'), enumType)) {
    throw exception;
  }
};

module.exports = {
  before: {
    find: [EnumsClass.getEnums],
    get: [validateEnumType, EnumsClass.getEnums],
    create: [validateEnumType, required('name'), ...restrictToAdmins, EnumsClass.createEnum],
    update: [validateEnumType, required('name'), ...restrictToAdmins, EnumsClass.updateEnum],
    patch: [disallow('rest')],
    remove: [validateEnumType, ...restrictToAdmins, (context) => {
      context.params.query.type = context.params.route.enumType;
    }],
  },
  after: {
    remove: [(context) => EnumsClass.removeEnum(context.app, context.result)],
  },
};
