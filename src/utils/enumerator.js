require('../extensions');
const _ = require('lodash');

class InvalidEnumeratorError extends Error {
  constructor(name, value) {
    super(`Invalid value '${value}' for enum '${name}'`);
  }
}

class Enumerator {
  constructor(name, enumerations) {
    this.name = name;
    this.enums = {};
    this.stringValues = {};
    _.forOwn(enumerations || {}, (stringValue, enumValue) => {
      this.add(enumValue, stringValue);
    });
  }

  is(constId, value) {
    if (_.isNil(this.for(constId))) throw new InvalidEnumeratorError(this.name, constId);
    return !_.isNil(constId) && this.for(value) === parseInt(constId, 10);
  }

  in(...constIds) {
    const values = new Set();
    constIds.forEach((constId) => {
      if (_.isNil(this.for(constId))) throw new InvalidEnumeratorError(this.name, constId);
      values.add(parseInt(constId, 10));
    });
    return (value) => {
      if (_.isNil(value)) return false;
      return values.has(this.for(value));
    };
  }

  for(constValue) {
    if (_.isNil(constValue)) return undefined;

    const intVal = parseInt(constValue, 10);
    if (!_.isNaN(intVal)) {
      return this.stringValues[intVal] && intVal;
    }

    return this.enums[constValue.toLowerCase()];
  }

  valueFor(constId) {
    return this.stringValues[constId];
  }

  selectClause(attr) {
    return `CASE\n${Object.entries(this.stringValues).map(([value, name]) => `WHEN ${attr} = ${value} THEN '${name}'`).join('\n')}END`;
  }

  toJSON() {
    return this.stringValues;
  }

  add(enumValue, stringValue) {
    const val = parseInt(enumValue, 10);
    const existingValue = this.for(stringValue);
    if (!_.isUndefined(existingValue) && existingValue === val) return;

    if (!_.isString(stringValue) || _.isEmpty(stringValue) || !_.isUndefined(existingValue)) {
      throw new Error('Invalid string value');
    } else if (_.isNaN(val)) {
      throw new Error('Invalid enum value');
    }
    this.remove(val);
    this.enums[stringValue.toLowerCase()] = val;
    this.stringValues[val] = stringValue;
    this[_.constantCase(stringValue)] = val;
  }

  remove(enumValue) {
    const val = this.for(enumValue);
    if (!_.isUndefined(val)) {
      delete this[_.constantCase(this.stringValues[val])];
      delete this.enums[this.stringValues[val].toLowerCase()];
      delete this.stringValues[val];
    }
  }
}

module.exports = Enumerator;
