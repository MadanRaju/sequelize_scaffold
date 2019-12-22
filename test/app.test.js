const assert = require('assert');
const axios = require('axios');

const {
  getUrl, app, port, baseUrl, appName,
} = require('./testHelper');

describe(`${appName} Application tests`, () => {
  before((done) => {
    this.server = app.listen(port);
    this.server.once('listening', () => done());
  });

  after((done) => {
    this.server.close(done);
  });

  it('should show welcome message on root', () => axios({
    url: baseUrl,
    headers: {
      Accept: 'text/html',
    },
  }).then((response) => {
    assert.equal(response.status, 200);
    assert.equal(response.data, `Welcome to ${appName} app.`);
  }));

  describe('404', () => {
    it('shows a 404 HTML page', () => axios({
      url: getUrl('path/to/nowhere'),
      headers: {
        Accept: 'text/html',
      },
    }).catch(({ response: res, message }) => {
      assert.equal(res.status, 404);
      assert.equal(message, 'Request failed with status code 404');
    }));

    it('shows a 404 JSON error without stack trace', () => axios({
      url: getUrl('path/to/nowhere'),
      json: true,
    }).catch(({ response: { status, statusText, data } }) => {
      assert.equal(status, 404);
      assert.equal(statusText, 'Not Found');
      assert.deepEqual(data, {
        code: 404, message: 'Page not found', name: 'NotFound', className: 'not-found', data: { url: '/path/to/nowhere' }, errors: {},
      });
    }));
  });
});
