const axios = require('axios');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

describe('Given a renamed repository', () => {
  const oldRepositoryName = 'https://github.com/aperdomob/redirect-test';
  const newRepositoryName = 'https://github.com/aperdomob/new-redirect-test';

  describe('when get the head old repository', () => {
    let queryResponse;

    before(async () => {
      queryResponse = await axios.head(oldRepositoryName);
    });

    it('then should have the redirect information', () => {
      expect(queryResponse.request.res.responseUrl).to.equal(newRepositoryName);
    });

    describe('and consume the url with redirect', () => {
      let oldRequestResponse;

      before(async () => {
        oldRequestResponse = await axios.get(oldRepositoryName);
      });

      it('then url should be redirected', () => {
        expect(oldRequestResponse.status).to.equal(StatusCodes.OK);
      });
    });
  });
});
