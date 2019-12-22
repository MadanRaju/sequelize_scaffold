const _ = require('lodash');

_.mixin({
  pascalCase(string) {
    return _.upperFirst(_.camelCase(string));
  },
});
