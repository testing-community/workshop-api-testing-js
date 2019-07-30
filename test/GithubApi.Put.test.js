const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');
const { expect, assert } = require('chai');

describe('Given a user github logged', () => {
  const urlBase = 'https://api.github.com';
  const username = 'germandavid85';

  describe('when wanna follow a user', () => {
    let followQuery;

    before(() => {
      followQuery = agent.put(`${urlBase}/user/following/${username}`)
        .set('User-Agent', 'agent')
        .auth('token', process.env.ACCESS_TOKEN);
    });

    it('then should be a response', () =>
      followQuery.then((response) => {
        expect(response.status).to.eql(statusCode.NO_CONTENT);
        expect(response.body).to.eql({});
      }));

    describe('when wanna know who follow', () => {
      let userFollowQuery;

      before(() => {
        userFollowQuery = agent.get(`${urlBase}/user/following`)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent')
          .then(response => response.body.find(user => user.login === username));
      });

      it(`then should be followed to ${username}`, () =>
        userFollowQuery.then(user => assert.exists(user)));
    });

    describe('when wanna follow a user again', () => {
      let followUserAgainQuery;

      before(() => {
        followUserAgainQuery = agent.put(`${urlBase}/user/following/${username}`)
          .set('User-Agent', 'agent')
          .auth('token', process.env.ACCESS_TOKEN);
      });

      it('then verify the method is idempotent', () => {
        followUserAgainQuery.then((response) => {
          expect(response.status).to.eql(statusCode.NO_CONTENT);
          expect(response.body).to.eql({});
        });

        describe('when wanna know who follow', () => {
          let userFollowQuery;

          before(() => {
            userFollowQuery = agent.get(`${urlBase}/user/following`)
              .set('User-Agent', 'agent')
              .auth('token', process.env.ACCESS_TOKEN)
              .then(response => response.body.find(user => user.login === username));
          });

          it(`then should be followed to ${username}`, () =>
            userFollowQuery.then(user => assert.exists(user)));
        });
      });
    });
  });
});
