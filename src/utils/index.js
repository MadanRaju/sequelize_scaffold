const logging = require('./logging');
const serviceHelper = require('./serviceHelper');

module.exports = {
  createModelService: serviceHelper.createModelService,
  getLogger: logging.getLogger,
};
