const usersService = require('./users/users.service');
const enumsService = require('./enums/enums.service');

module.exports = function (app) {
  app.configure(usersService);
  app.configure(enumsService);
};
