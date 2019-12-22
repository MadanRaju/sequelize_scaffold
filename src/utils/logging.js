const path = require('path');
const { ensureDirSync } = require('fs-extra');
require('winston-daily-rotate-file');
const { Container, transports, format } = require('winston');

const { logging: LOGGING_CONFIGS } = require('../configuration')();

try {
  ensureDirSync(LOGGING_CONFIGS.location);
} catch (error) {
  console.log(`ERROR while setting up logging : ${error.message}`); // eslint-disable-line no-console
}

const commonFormats = [format.splat(), format.timestamp()];

const consoleTransport = (label) => new transports.Console({
  format: format.combine(
    ...commonFormats,
    format.label({ label }),
    format.printf((info) => `${info.timestamp} [${info.label}] ${info.level.toUpperCase()} : ${info.message}`)
  ),
});

const getTransports = (label) => [
  new transports.DailyRotateFile({
    filename: path.join(LOGGING_CONFIGS.location, `${label}-%DATE%.log`),
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: LOGGING_CONFIGS.maxFileSize,
    maxFiles: LOGGING_CONFIGS.maxFiles,
  }),
  consoleTransport(label),
];

const logFormat = format.printf((info) => `${info.timestamp} ${info.level.toUpperCase()} : ${info.message}`);

const logsContainer = new Container();

module.exports = {
  getLogger: (tag) => logsContainer.add(tag, {
    level: LOGGING_CONFIGS.level,
    format: format.combine(
      ...commonFormats,
      logFormat
    ),
    transports: getTransports(tag),
  }),
};
