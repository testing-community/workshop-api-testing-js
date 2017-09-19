const agent = require('superagent-promise')(require('superagent'), Promise);
const statusCode = require('http-status-codes');
const { expect, assert } = require('chai');

describe.only('Given a user github logged', () => {
  const urlBase = 'https://api.github.com';
  const username = 'germandavid85';

  describe('when wanna follow a user', () => {
    it('then should be a response', () =>
      agent.put(`${urlBase}/user/following/${username}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          expect(response.status).to.eql(statusCode.NO_CONTENT);
          expect(response.body).to.eql({});
        }));

    it('then vefiry idempotent method', () =>
      agent.put(`${urlBase}/user/following/${username}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          expect(response.status).to.eql(statusCode.NO_CONTENT);
          expect(response.body).to.eql({});
        }));

    describe('when wanna know who follow', () => {
      it(`then should be followed to ${username}`, () =>
        agent.get(`${urlBase}/user/following`)
          .auth('token', process.env.ACCESS_TOKEN)
          .then((response) => {
            const login = response.body.find(user => user.login === username);
            assert.exists(login);
          }));
    });
  });
});
