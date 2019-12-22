const helmet = require('helmet');
const cors = require('cors');
const compress = require('compression');
const express = require('@feathersjs/express');

module.exports = (app) => {
  // Add your custom middleware here. Remember that
  // in Express, the order matters.

  const securityHeaders = app.get('securityHeaders');
  /*
  * Sets security headers.
  * https://helmetjs.github.io/ for more options.
  */
  app.use(helmet());

  /*
  * Sets several headers to disable browser caching.
  * https://helmetjs.github.io/docs/nocache/ for more options
  */
  if (securityHeaders.noCache) {
    app.use(helmet.noCache());
  }

  /*
  * Sets header Content-Security-Policy for whitelisting JS, CSS, images, plugins.
  * https://helmetjs.github.io/docs/csp/ for more csp options.
  */
  if (securityHeaders.contentSecurityPolicy) {
    app.use(helmet.contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'", `${app.get('domainURL')}`],
      },
    }));
  }

  /*
  * Sets header X-Permitted-Cross-Domain-Policies: none.
  * https://helmetjs.github.io/docs/crossdomain/ for more CORS policies options.
  */
  if (securityHeaders.permittedCrossDomainPolicies) {
    app.use(helmet.permittedCrossDomainPolicies());
  }

  /*
  * Sets "Strict-Transport-Security: max-age=31536000; includeSubDomains".
  * https://helmetjs.github.io/docs/hsts/ for more csp options.
  */
  if (securityHeaders.hsts) {
    app.use(helmet.hsts(
      {
        maxAge: securityHeaders.maxAge,
        includeSubdomains: securityHeaders.includeSubdomains,
      }
    ));
  }

  /*
  * Sets 'Expect-CT HTTP' header which tells browsers to expect Certificate Transparency.
  * https://scotthelme.co.uk/certificate-transparency-an-introduction/  &
  * https://helmetjs.github.io/docs/expect-ct/ for more Expect-CT policies options.
  */
  if (securityHeaders.expectCt) {
    app.use(helmet.expectCt({
      enforce: true,
      maxAge: securityHeaders.maxAge,
    }));
  }

  /*
  * Sets Referrer-Policy header which tells server where browser is coming from.
  * https://helmetjs.github.io/docs/referrer-policy/ for more Referrer-Policy header options.
  */
  if (securityHeaders.referrerPolicy) {
    app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
  }

  app.use(cors());
  app.use(compress());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};
