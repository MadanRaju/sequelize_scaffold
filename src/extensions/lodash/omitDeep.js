const _ = require('lodash');

const omitDeep = (obj, ...keysToBeRemoved) => {
  const keysToRemove = _.isSet(keysToBeRemoved) ? keysToBeRemoved : new Set(keysToBeRemoved);
  return _.transform(obj, (result, value, key) => {
    let val = value;
    if (_.isPlainObject(value) || _.isArray(value)) {
      val = omitDeep(value, keysToBeRemoved);
    }
    if (!keysToRemove.has(key)) {
      if (_.isArray(obj)) result.push(val); else result[key] = val;
    }
  });
};

_.mixin({
  omitDeep,
});
