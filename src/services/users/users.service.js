const { createModelService } = require('../../utils/serviceHelper');
const { User } = require('../../models');
const UserHooks = require('./users.hooks');
const UsersServiceClass = require('./users.class');
const createUserRolesService = require('./userRoles.service');
const createResetPasswordService = require('./resetPassword/resetPassword.service');
const ResetPasswordProcessor = require('../../mailers/processors/resetPasswordProcessor');

module.exports = (app) => {
  createUserRolesService(app);
  createResetPasswordService(app);
  createModelService(User, UserHooks, {
    ExtensionClass: UsersServiceClass,
    subscribers: {
      created: (user) => {
        new ResetPasswordProcessor(user).process();
      },
    },
  }, app);
};
