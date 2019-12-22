const _ = require('lodash');
const nodemailer = require('nodemailer');

const MAILING_CONFIGS = require('../configuration')().mailing;
const { getLogger } = require('../utils');

class Mailer {
  constructor(name, emailId) {
    this.logger = getLogger(name);
    this.transport = nodemailer.createTransport(MAILING_CONFIGS.transport);
    this.emailId = emailId;
  }

  // eslint-disable-next-line class-methods-use-this
  content() {
    return {
      text: 'Base Mailer!!! Should not use this!!!',
      html: '<b>DO NOT USE THIS BASE MAILER DIRECTLY<b>',
    };
  }

  send(emailId) {
    const content = this.content();
    return this.transport.sendMail(_.assign({
      from: MAILING_CONFIGS.fromEmailId,
      to: MAILING_CONFIGS.recepientOverrideEmailId || this.emailId,
      subject: this.subject,
    }, content)).then((info) => {
      if (!info) {
        this.logger.error('Error sending mail: ', emailId, ' ', content.subject);
      } else {
        this.logger.debug('Message sent: %s', info.messageId);
        this.logger.debug('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      }
    });
  }
}

module.exports = Mailer;
