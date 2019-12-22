const { Forbidden, NotAuthenticated } = require('feathers-errors');
const { User } = require('../models');

module.exports = (...roles) => {
  const permittedRole = User.Role.in(...roles);

  return (context) => {
    if (!context.params.provider) return;

    if (!context.params.authenticated && !context.params.user) {
      throw new NotAuthenticated('Invalid Authentication Token');
    }

    if (!permittedRole(context.params.user.roleId)) {
      throw new Forbidden('You do not have the permissions to access this.');
    }
  };
};
