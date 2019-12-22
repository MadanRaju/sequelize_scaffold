const { GET_UTC_DATE, NEW_ID, GUID } = require('../constants');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      type: GUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: NEW_ID,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    emailId: {
      type: Sequelize.STRING,
    },
    mobileNumber: {
      type: Sequelize.STRING,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    role: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    createdBy: {
      type: GUID,
      references: {
        model: 'Users',
        key: 'id',
      },
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: GET_UTC_DATE,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: GET_UTC_DATE,
    },
    deletedAt: {
      type: Sequelize.DATE,
    },
  }),

  down: (queryInterface) => queryInterface.dropTable('Users'),
};
