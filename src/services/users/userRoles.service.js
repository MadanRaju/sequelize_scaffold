const { hooks: { authenticateJWT } } = require('feathers-auth');

const { User: { Role } } = require('../../models');
const { restrictToRole } = require('../../commonHooks');

module.exports = (app) => {
  app.use('/users/roles', {
    find: async () => Role,
  });

  const service = app.service('users/roles');

  service.hooks({
    before: { find: [authenticateJWT, restrictToRole(Role.SYSTEM_ADMIN, Role.ADMIN)] },
  });
};
