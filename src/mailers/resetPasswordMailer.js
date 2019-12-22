const Mailer = require('./mailer');
const { resetPasswordUrl } = require('../utils/urlHelper');
const { appName } = require('../configuration')();

class ResetPasswordMailer extends Mailer {
  constructor(user, token, ...emailIds) {
    super('PasswordResetMailer', emailIds);
    this.token = token;
    this.user = user;
    this.subject = `${appName} | Verify Email`;
  }

  content() {
    return {
      text: `Hi ${this.user.name},\n\n`
        + `To verify your identity, please click the following link: ${resetPasswordUrl(this.token)}\n\n`
        + 'If you did not make this request, you may safely ignore it.\n\n'
        + 'Best,\n'
        + `Team ${appName}`,
      html: `<p>Hi ${this.user.name},</p><p></p>`
        + `<p>To verify your identity, please click the following link: <a href="${resetPasswordUrl(this.token)}">Verify ID</a></p><p></p>`
        + '<p>If you did not make this request, you may safely ignore it.</p><p></p>'
        + '<p>Best,</p>'
        + `<p>Team ${appName}</p>`,
    };
  }
}

module.exports = ResetPasswordMailer;
