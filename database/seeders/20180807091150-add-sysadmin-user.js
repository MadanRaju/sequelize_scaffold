const { User } = require('../../src/models');
const { sysadminPassword } = require('../../src/configuration')();

const sysadminUserDetails = {
  name: 'System Admin',
  emailId: 'Abhishek.Puri@Bain.com',
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
