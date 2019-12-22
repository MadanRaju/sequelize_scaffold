module.exports = {
  port: 'PORT',
  host: 'scaffolding.com',
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    dialectOptions: {
      encrypt: process.env.DB_ENCRYPTION === 'true',
    },
  },
  mailing: {
    transport: process.env.SMTP_CONNECTION_STRING,
    fromEmailId: process.env.SMTP_FROM_EMAIL_ID,
  },
  resetPassword: {
    secret: process.env.RESET_PASSWORD_SECRET,
    jwtOptions: {
      expiresIn: process.env.PASSWORD_RESET_TOKEN_EXPIRY || '3d',
      issuer: process.env.JWT_ISSUER,
    },
  },
  externalUrls: {
    basePath: process.env.FRONTEND_DOMAIN_BASE,
  },
};
