const { literal } = require('sequelize');

module.exports = {
  GET_UTC_DATE: literal('GETUTCDATE()'),
  NEW_ID: literal('NEWID()'),
  GUID: 'UNIQUEIDENTIFIER',
};
