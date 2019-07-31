const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect, assert } = require('chai');

describe('Given a user github logged', () => {
  const urlBase = 'https://api.github.com';
  const username = 'germandavid85';

  describe('when wanna follow a user', () => {
    let followQueryResponse;

    before(async () => {
      followQueryResponse = await agent.put(`${urlBase}/user/following/${username}`)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
    });

    it('then should be a response', () => {
      expect(followQueryResponse.status).to.eql(statusCode.NO_CONTENT);
      expect(followQueryResponse.body).to.eql({});
    });

    describe('when wanna know who follow', () => {
      let user;

      before(async () => {
        const response = await agent.get(`${urlBase}/user/following`)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent');

        user = response.body.find(list => list.login === username);
      });

      it(`then should be followed to ${username}`, () => assert.exists(user));
    });

    describe('when wanna follow a user again', () => {
      let followUserAgainQueryResponse;

      before(async () => {
        followUserAgainQueryResponse = await agent.put(`${urlBase}/user/following/${username}`)
          .set('User-Agent', 'agent')
          .auth('token', process.env.ACCESS_TOKEN);
      });

      it('then verify the method is idempotent', () => {
        expect(followUserAgainQueryResponse.status).to.eql(statusCode.NO_CONTENT);
        expect(followUserAgainQueryResponse.body).to.eql({});
      });

      describe('when wanna know who follow', () => {
        let user;

        before(async () => {
          const userFollowQuery = await agent.get(`${urlBase}/user/following`)
            .set('User-Agent', 'agent')
            .auth('token', process.env.ACCESS_TOKEN);

          user = userFollowQuery.body.find(list => list.login === username);
        });

        it(`then should be followed to ${username}`, () => assert.exists(user));
      });
    });
  });
});
