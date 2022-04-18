const axios = require('axios');
const { StatusCodes } = require('http-status-codes');
const { expect, assert } = require('chai');

describe('Given a user github logged', () => {
  const urlBase = 'https://api.github.com';
  const username = 'aperdomob';

  describe('when wanna follow a user', () => {
    let followQueryResponse;

    before(async () => {
      followQueryResponse = await axios.put(`${urlBase}/user/following/${username}`, {}, {
        headers: {
          Authorization: `token ${process.env.ACCESS_TOKEN}`
        }
      });
    });

    it('then should be a response', () => {
      expect(followQueryResponse.status).to.eql(StatusCodes.NO_CONTENT);
      expect(followQueryResponse.data).to.eql('');
    });

    describe('when wanna know who follow', () => {
      let user;

      before(async () => {
        const response = await axios.get(`${urlBase}/user/following`, {
          headers: {
            Authorization: `token ${process.env.ACCESS_TOKEN}`
          }
        });
        user = response.data.find((list) => list.login === username);
      });

      it(`then should be followed to ${username}`, () => assert.exists(user));
    });

    describe('when wanna follow a user again', () => {
      let followUserAgainQueryResponse;

      before(async () => {
        followUserAgainQueryResponse = await axios.put(`${urlBase}/user/following/${username}`, {}, {
          headers: {
            Authorization: `token ${process.env.ACCESS_TOKEN}`
          }
        });
      });

      it('then verify the method is idempotent', () => {
        expect(followUserAgainQueryResponse.status).to.eql(StatusCodes.NO_CONTENT);
        expect(followUserAgainQueryResponse.data).to.eql('');
      });

      describe('when wanna know who follow', () => {
        let user;

        before(async () => {
          const userFollowQuery = await axios.get(`${urlBase}/user/following`, {
            headers: {
              Authorization: `token ${process.env.ACCESS_TOKEN}`
            }
          });
          user = userFollowQuery.data.find((list) => list.login === username);
        });

        it(`then should be followed to ${username}`, () => assert.exists(user));
      });
    });
  });
});
