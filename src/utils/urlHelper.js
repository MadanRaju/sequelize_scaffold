const { format, parse } = require('url');

const URLS = require('../configuration')().externalUrls;

const baseUrl = parse(URLS.basePath);

const resolveWithHash = (url, path) => {
  url.hash = path;
  return format(url);
};

if (URLS.basePath.match(/(#|#\/)$/)) {
  URLS.resetPasswordUrl = resolveWithHash(baseUrl, URLS.resetPasswordPath);
} else {
  URLS.resetPasswordUrl = baseUrl.resolve(URLS.resetPasswordPath);
}


module.exports = {
  baseUrl: () => URLS.baseUrl,
  resetPasswordUrl: (token) => `${URLS.resetPasswordUrl}?q=${token}`,
};
