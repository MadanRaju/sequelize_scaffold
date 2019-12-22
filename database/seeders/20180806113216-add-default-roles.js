const { Enum } = require('../../src/models');

module.exports = {
  up: async () => {
    await Enum.createOrUpdate({ where: { id: 0, type: 'Role' }, defaults: { name: 'System Admin' } });
    await Enum.createOrUpdate({ where: { id: 1, type: 'Role' }, defaults: { name: 'Admin' } });
    await Enum.createOrUpdate({ where: { id: 2, type: 'Role' }, defaults: { name: 'Member' } });
  },

  down: () => {},
};
