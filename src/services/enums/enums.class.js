const _ = require('lodash');
const { NotFound, Conflict } = require('feathers-errors');

const Enumerator = require('../../utils/enumerator');

const findEnum = (enums, enumType) => {
  const requiredType = enumType.toLowerCase();
  return _.find(enums, ({ name }) => name.toLowerCase() === requiredType);
};

const addEnum = (app, enumeration) => {
  const enumName = _.pascalCase(enumeration.type);
  const enums = app.get('enums');

  enums[enumName] = enums[enumName] || new Enumerator(enumName);
  enums[enumName].add(enumeration.id, enumeration.name);
};

const createEnum = (context) => {
  const { enumType } = context.params.route;
  const { Model: Enum } = context.service;
  return Enum.findOne({ where: { name: context.data.name, type: enumType }, paranoid: false })
    .then((enumeration) => {
      if (enumeration) {
        if (enumeration.deletedAt) {
          enumeration.setDataValue('deletedAt', null);
          return enumeration.save();
        }
        throw new Conflict(`${enumType} with name: '${context.data.name}' already exists`, enumeration.toJSON());
      }
      return Enum.max('id', { where: { type: enumType }, paranoid: false }).then((lastId) => Enum.create({
        id: _.isNaN(lastId) ? 0 : lastId + 1,
        type: _.pascalCase(enumType),
        name: context.data.name,
      }));
    }).then((enumeration) => {
      addEnum(context.app, enumeration);
      context.result = enumeration.toJSON();
    });
};


const getEnums = (context) => {
  context.result = context.app.get('enums');
  const enumType = _.get(context, 'params.route.enumType');
  if (enumType) {
    context.result = findEnum(context.result, enumType);
    if (!context.result) {
      throw new NotFound(`Enum of type '${enumType}' not found.`);
    }
  }
};

const updateEnum = (context) => context.service.Model.findOne({
  where: { id: context.id, type: context.params.route.enumType },
}).then((enumeration) => {
  if (!enumeration) {
    throw new NotFound(`No ${context.data.type} found with id: '${context.id}' not found.`);
  }
  return enumeration.update(context.data).then((updateEnumeration) => {
    addEnum(context.app, updateEnumeration);
    context.result = updateEnumeration.toJSON();
  });
});

const removeEnum = (app, enumeration) => {
  const enumName = _.pascalCase(enumeration.type);
  const enumerator = app.get('enums')[enumName];
  enumerator.remove(enumeration.id);
  if (_.isEmpty(enumerator.toJSON())) {
    delete app.get('enums')[enumName];
  }
};

module.exports = {
  createEnum,
  findEnum,
  getEnums,
  removeEnum,
  updateEnum,
};
