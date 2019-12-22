module.exports = {
  up: (queryInterface) => queryInterface.renameColumn('Users', 'role', 'roleId'),

  down: (queryInterface) => queryInterface.renameColumn('Users', 'roleId', 'role'),
};
