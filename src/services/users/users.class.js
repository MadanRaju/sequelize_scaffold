const _ = require('lodash');
const { NotAcceptable, NotFound } = require('feathers-errors');

const { resetPassword: RESET_PASSWORD_CONFIG } = require('../../configuration')();

class UsersService {
  constructor(opts) {
    this.Model = opts.Model;
    this.app = opts.app;
    this.editableAttributes = new Set(['name', 'phoneNumber', 'role', 'deletedAt']);
  }

  create(data, params) {
    delete data.id;
    data.createdBy = params.user.id;
    return this.Model.create(data, params);
  }

  update(id, data) {
    return this.Model.findById(id, { paranoid: false }).then((user) => {
      if (!user) throw new NotFound(`User with id ${id} not found.`);
      _.forOwn(data, (value, attr) => {
        if (this.editableAttributes.has(attr)) user.setDataValue(attr, value);
      });
      return user.save();
    });
  }

  patch(id, data, params) {
    return this.Model.findById(params.user.id).then((user) => {
      if (user.updatedAt > new Date(params.payload.requestTime)) {
        throw new NotAcceptable(RESET_PASSWORD_CONFIG.message);
      }
      user.password = data.password;
      return user.save();
    });
  }
}

module.exports = UsersService;
