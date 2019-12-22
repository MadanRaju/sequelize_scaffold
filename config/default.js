const appName = 'Scaffolding';
const host = 'localhost';
const port = 3030;
const domainURL = `${host}:${port}`;
module.exports = {
  port,
  host,
  appName,
  domainURL,
  getEnvironment: () => (process.env.NODE_ENV || 'development'),
  logging: {
    level: 'info',
    location: 'logs',
    maxFileSize: '20m',
    maxFiles: '30d',
    resultLogging: false,
    dataLogging: true,
    paramsLogging: true,
    maskedFields: ['password'],
  },
  database: {
    host: 'localhost',
    dialect: 'mssql',
    username: '',
    password: '',
    database: 'mydb',
    logging: 'debug',
    dialectOptions: {
      port: 1433,
      encrypt: true,
    },
    define: {
      timestamps: true,
      paranoid: true,
      underscored: false,
      freezeTableName: true,
      defaultScope: {
        attributes: { exclude: ['deletedAt'] },
      },
    },
  },
  authentication: {
    secret: 'AUTHENTICATION_SECRET',
    jwt: {
      audience: 'http://localhost:3030',
      subject: `\\${appName.toUpperCase()}_AUTHENTICATION`,
      issuer: appName,
    },
    local: {
      entityPasswordField: 'passwordHash',
    },
    userAttributes: {
      payload: ['id', 'roleId', 'username'],
      response: { exclude: ['password', 'passwordHash'] },
    },
  },
  sysadminPassword: '',
  mailing: {
    transport: {
      host: 'mailhost',
      port: 25,
      secure: false,
      tls: false,
      auth: {
        user: '',
        pass: '',
      },
    },
    fromEmailId: `no-reply@${appName.toLowerCase()}.com`,
    recepientOverrideEmailId: 'abc@receiverfoobar.com',
  },
  resetPassword: {
    secret: 'RESET_PASSWORD_SECRET',
    jwtOptions: {
      expiresIn: '3d',
      issuer: appName,
      subject: '\\PASSWORD_RESET',
    },
    message: 'Either the token is invalid or can no longer be used for resetting password.',
  },
  externalUrls: {
    basePath: 'http://localhost:3001/#',
    resetPasswordPath: '/reset-password',
  },
  /* Sets "Strict-Transport-Security: max-age=31536000; includeSubDomains". */
  securityHeaders: {
    noCache: true,
    contentSecurityPolicy: true,
    permittedCrossDomainPolicies: true,
    hsts: false,
    expectCt: false,
    referrerPolicy: true,
    maxAge: 31536000,
    includeSubdomains: true,
  },
};
