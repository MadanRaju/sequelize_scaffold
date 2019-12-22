const _ = require('lodash');
const Sequelize = require('sequelize');

const Enumerator = require('../../utils/enumerator');

Sequelize.prototype.setupEnums = function (app) {
  const enumModelName = this.options.enumModelName || 'Enum';
  return this.model(enumModelName).findAll({ raw: true }).then((enums) => {
    const enumerators = {};
    enums.forEach(({ id, name, type: enumName }) => {
      enumerators[enumName] = enumerators[enumName] || new Enumerator(enumName, {});
      enumerators[enumName].add(id, name);
    });
    _.forOwn(this.models, (Model) => {
      Model.setupEnumAttributes(enumerators);
    });
    if (app) app.set('enums', enumerators);
    return app;
  });
};
