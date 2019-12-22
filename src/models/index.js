require('../extensions');

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const { getInstance } = require('../utils/sequelizeHelper');
const logger = require('../utils/logging').getLogger('sequelize');

const basename = path.basename(__filename);
const db = {};
const sequelize = getInstance();

fs
  .readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(async (modelName) => {
  if (db[modelName].setup) {
    try {
      await db[modelName].setup(db);
    } catch (error) {
      logger.error(error.message);
      process.exit(1);
    }
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
