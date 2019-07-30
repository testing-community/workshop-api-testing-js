const agent = require('superagent-promise')(require('superagent'), Promise);
const { expect } = require('chai');
const statusCode = require('http-status-codes');

describe('Given a renamed repository', () => {
  const oldRepositoryName = 'https://github.com/aperdomob/redirect-test';
  const newRepositoryName = 'https://github.com/aperdomob/new-redirect-test';

  describe('when get the head old repository', () => {
    let headQuery;

    before(() => {
      headQuery = agent.head(oldRepositoryName);
    });

    it('then should have the redirect information', () =>
      headQuery.catch((error) => {
        expect(error.response.headers.location).to.equal(newRepositoryName);
        expect(error.status).to.equal(statusCode.MOVED_PERMANENTLY);
      }));

    describe('and consume the url with redirect', () => {
      let oldRequest;

      before(() => {
        oldRequest = agent
          .get(oldRepositoryName);
      });

      it('then url should be redirected', () =>
        oldRequest.then((response) => {
          expect(response.status).to.equal(statusCode.OK);
        }));
    });
  });
});
