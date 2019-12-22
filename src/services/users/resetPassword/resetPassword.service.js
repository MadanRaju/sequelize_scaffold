const ResetPassword = require('./resetPassword.class');

module.exports = function (app) {
  app.use('/users/:username/resetPassword', ResetPassword);
};
