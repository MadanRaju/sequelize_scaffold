const { GET_UTC_DATE } = require('../constants');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Enums', {
    id: {
      allowNull: false,
      type: Sequelize.INTEGER,
      primaryKey: 'EnumsPrimaryKey',
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: 'EnumsPrimaryKey',
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: GET_UTC_DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
      defaultValue: GET_UTC_DATE,
    },
    deletedAt: {
      type: Sequelize.DATE,
    },
  }).then,
  down: (queryInterface) => queryInterface.dropTable('Enums'),
};
