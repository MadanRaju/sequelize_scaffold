const { createModelService } = require('../../utils/serviceHelper');
const { Enum } = require('../../models');
const EnumHooks = require('./enums.hooks');

module.exports = createModelService(Enum, EnumHooks, {
  path: 'enums/:enumType?',
});
