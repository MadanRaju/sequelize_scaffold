const { User } = require('../../../models');
const ResetPasswordProcessor = require('../../../mailers/processors/resetPasswordProcessor');

module.exports = {
  create: (data, params) => User.findOne({
    where: { username: params.route.username },
  }).then((user) => (user ? new ResetPasswordProcessor(user).process() : { status: 'User Not Found' })),
};
