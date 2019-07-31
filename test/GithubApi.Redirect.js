const agent = require('superagent');
const { expect } = require('chai');
const statusCode = require('http-status-codes');

describe('Given a renamed repository', () => {
  const oldRepositoryName = 'https://github.com/aperdomob/redirect-test';
  const newRepositoryName = 'https://github.com/aperdomob/new-redirect-test';

  describe('when get the head old repository', () => {
    let headQueryError;

    before(async () => {
      try {
        await agent.head(oldRepositoryName);
      } catch (response) {
        headQueryError = response;
      }
    });

    it('then should have the redirect information', () => {
      expect(headQueryError.response.headers.location).to.equal(newRepositoryName);
      expect(headQueryError.status).to.equal(statusCode.MOVED_PERMANENTLY);
    });

    describe('and consume the url with redirect', () => {
      let oldRequestResponse;

      before(async () => {
        oldRequestResponse = await agent.get(oldRepositoryName);
      });

      it('then url should be redirected', () => {
        expect(oldRequestResponse.status).to.equal(statusCode.OK);
      });
    });
  });
});
