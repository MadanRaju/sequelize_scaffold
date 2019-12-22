module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn('Users', 'emailId', {
    type: Sequelize.STRING,
    allowNull: false,
  }).then(() => queryInterface.changeColumn('Users', 'passwordHash', {
    type: Sequelize.STRING,
    allowNull: true,
  })),

  down: (queryInterface, Sequelize) => queryInterface.changeColumn('Users', 'emailId', {
    type: Sequelize.STRING,
    allowNull: true,
  }),
};
