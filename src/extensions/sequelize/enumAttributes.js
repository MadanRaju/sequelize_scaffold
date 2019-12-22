const _ = require('lodash');
const { Model, DataTypes } = require('sequelize');

const { convertFindClause } = require('../../utils/sequelizeHelper');

Model.setupEnumAttributes = function (enums) {
  const enumAttributes = {};
  _.forOwn(this.rawAttributes, ({ type, enumConfig }, attributeName) => {
    if (type instanceof DataTypes.INTEGER && enumConfig && enums[enumConfig.name]) {
      const { name, defaultValue, attrName } = enumConfig;
      const enumDef = enums[name];
      const enumValueAttributeName = attrName || _.camelCase(attributeName.replace(/id$/i, ''));
      enumAttributes[attributeName] = {
        enumDef,
        defaultValue: enumDef.for(defaultValue),
        attrName: enumValueAttributeName,
      };
      this[enumDef.name] = enumDef;
      this.rawAttributes[attributeName].validate = {
        validateEnum(value) {
          if (_.isUndefined(enumDef.for(value))) {
            throw new Error(`Invlid value '${value || this.getDataValue(enumValueAttributeName)}' for '${attributeName}'`);
          }
        },
      };
      this.rawAttributes[enumValueAttributeName] = {
        type: DataTypes.VIRTUAL,
        set(value) {
          this.setDataValue(attributeName, value);
          this.setDataValue(enumValueAttributeName, value);
        },
      };
    }
  });

  if (!_.isEmpty(enumAttributes)) {
    this.refreshAttributes();
    const convertStringToEnum = (instance) => {
      _.forOwn(enumAttributes, ({ enumDef, defaultValue }, attributeName) => {
        const value = instance.getDataValue(attributeName);
        const enumValue = _.isNil(value) ? defaultValue : enumDef.for(value) || value;
        instance.setDataValue(attributeName, enumValue);
      });
    };

    const convertEnumToString = (instance) => {
      if (!instance) return;
      _.forOwn(enumAttributes, ({ enumDef, attrName }, attributeName) => {
        const enumStringValue = enumDef.valueFor(instance[attributeName]);
        if (_.hasIn(instance, 'setDataValue')) {
          instance.setDataValue(attrName, enumStringValue);
        }
        instance[attrName] = enumStringValue;
      });
    };

    const convertToEnumInQuery = (query) => {
      _.forOwn(enumAttributes, ({ enumDef }, attributeName) => {
        convertFindClause(attributeName, enumDef.for.bind(enumDef))(query);
      });
    };

    this.addHook('beforeBulkCreate', 'convertEnum', (instances) => instances.forEach(convertStringToEnum));
    this.addHook('beforeValidate', 'convertEnum', convertStringToEnum);
    this.addHook('beforeCount', 'convertEnum', convertToEnumInQuery);
    this.addHook('beforeFind', 'convertEnum', convertToEnumInQuery);

    this.addHook('afterSave', 'convertEnum', convertEnumToString);
    this.addHook('afterFind', 'convertEnum', (instances) => {
      _.castArray(instances).forEach(convertEnumToString);
    });
    this.addHook('afterBulkCreate', 'convertEnum', (instances) => {
      if (instances) instances.forEach(convertEnumToString);
    });
  }
};
