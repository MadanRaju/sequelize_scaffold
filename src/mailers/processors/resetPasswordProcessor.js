const _ = require('lodash');
const jwt = require('jsonwebtoken');

const ResetPasswordMailer = require('../resetPasswordMailer');
const { getLogger } = require('../../utils');
const RESET_PASSWORD_CONFIG = require('../../configuration')().resetPassword;

class ResetPasswordProcessor {
  constructor(user) {
    this.user = user;
    this.logger = getLogger('ResetPasswordProcessor');
  }

  getToken() {
    return new Promise((resolve, reject) => {
      jwt.sign({
        user: _.pick(this.user, 'id', 'username'),
        requestTime: new Date().toISOString(),
      }, RESET_PASSWORD_CONFIG.secret, RESET_PASSWORD_CONFIG.jwtOptions, (error, token) => {
        if (error) reject(error);
        resolve(token);
      });
    });
  }

  async process() {
    const token = await this.getToken();
    const mailer = new ResetPasswordMailer(this.user, token, this.user.emailId);
    this.logger.debug(`Sending mail to user (id: ${this.user.id}) for password reset.`);
    return mailer.send().then(() => ({ status: 'DONE' }));
  }
}

module.exports = ResetPasswordProcessor;
