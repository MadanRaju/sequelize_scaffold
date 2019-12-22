const { User } = require('../../src/models');
const { sysadminPassword } = require('../../src/configuration')();

const sysadminUserDetails = {
  name: 'System Admin',
  emailId: 'madan.731993@gmail.com.com',
  roleId: 0,
  password: sysadminPassword,
};

module.exports = {
  up: () => User.createOrUpdate({
    where: { username: 'sysadmin' },
    defaults: sysadminUserDetails,
  }),

  down: () => User.destroy({ where: { username: 'sysadmin' } }),
};
