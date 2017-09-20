const agent = require('superagent-promise')(require('superagent'), Promise);
const responseTime = require('superagent-response-time');
const { expect } = require('chai');

const urlBase = 'https://api.github.com';

describe.only('Given a github user', () => {
  describe('when gets all users', () => {
    let queryTime;

    before(() => {
      const usersQuery = agent
        .get(`${urlBase}/users`)
        .auth('token', process.env.ACCESS_TOKEN)
        .use(responseTime((request, time) => {
          queryTime = time;
        })).then(() => 0); // this line is needed because this libray has issues

      return usersQuery;
    });

    it('then should have a quick reponse', () => {
      expect(queryTime).to.be.at.below(5000);
    });
  });
});
