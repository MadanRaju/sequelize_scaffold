const _ = require('lodash');
const createService = require('feathers-sequelize');
const { camelize, pluralize } = require('inflection');

module.exports = {
  createModelService: _.curry((Model, hooks, options, app) => {
    const opts = _.defaultTo(options, {});
    const serviceName = _.defaultTo(opts.name, pluralize(camelize(Model.name, true)));
    const servicePath = _.defaultTo(opts.path, serviceName);
    const paginate = _.defaultTo(opts.paginate, false) && app.get('paginate');
    const useAsStandalone = _.defaultTo(opts.useAsStandalone, true);
    const serviceSubscribers = _.defaultTo(opts.subscribers, {});
    const middleWares = _.defaultTo(opts.middleWares, []);
    const serviceOptions = {
      name: serviceName,
      Model,
      paginate,
    };
    let serviceHandler = createService(serviceOptions);
    if (opts.ExtensionClass) {
      serviceHandler = serviceHandler.extend(new opts.ExtensionClass(serviceOptions));
    }

    app.use(`/${servicePath}`, ...middleWares, serviceHandler);

    // Get our initialized service so that we can register hooks and filters
    const service = app.service(servicePath);
    if (serviceName !== servicePath && useAsStandalone) {
      app.services[serviceName] = service;
    }

    service.hooks(hooks);

    _.forOwn(serviceSubscribers, (listner, eventName) => {
      service.on(eventName, listner);
    });

    if (service.filter) {
      service.filter(opts.filters);
    }
  }),
};
