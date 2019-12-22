const _ = require('lodash');
const { when, discard } = require('feathers-hooks-common');
const { hooks: { authenticateJWT } } = require('feathers-auth');

const { restrictToRole } = require('../../commonHooks');
const { resetPassword: RESET_PASSWORD_CONFIGS } = require('../../configuration')();
const { User: { Role } } = require('../../models');

const includeDeactivatedUsers = (context) => {
  context.params.sequelize.paranoid = false;
};

module.exports = {
  before: {
    find: [authenticateJWT, restrictToRole(Role.SYSTEM_ADMIN, Role.ADMIN), includeDeactivatedUsers],
    get: [authenticateJWT, restrictToRole(Role.SYSTEM_ADMIN, Role.ADMIN), includeDeactivatedUsers],
    create: [authenticateJWT, restrictToRole(Role.SYSTEM_ADMIN)],
    update: [authenticateJWT, restrictToRole(Role.SYSTEM_ADMIN)],
    patch: [_.partial(authenticateJWT, _, _, RESET_PASSWORD_CONFIGS)],
    remove: [authenticateJWT, restrictToRole(Role.SYSTEM_ADMIN)],
  },

  after: {
    all: [when((context) => context.params.provider, discard('passwordHash', 'dataValues.passwordHash'))],
  },
};
