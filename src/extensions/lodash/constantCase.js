const _ = require('lodash');

_.mixin({
  constantCase(string) {
    return _.snakeCase(string).toUpperCase();
  },
});
