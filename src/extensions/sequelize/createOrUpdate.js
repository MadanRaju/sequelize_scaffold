const _ = require('lodash');
const { Model } = require('sequelize');

Model.createOrUpdate = function (options) {
  return this.findOrCreate(options)
    .spread((instance, created) => {
      if (!created) {
        _.forOwn(options.defaults, (value, attr) => {
          instance.setDataValue(attr, value);
        });
        return instance.save(_.pick(options, 'transaction', 'logging'));
      }
      return instance;
    });
};
