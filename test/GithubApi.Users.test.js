const axios = require('axios');
const { expect } = require('chai');

const urlBase = 'https://api.github.com';

describe('Given a github user', () => {
  describe('when gets all users', () => {
    let allUsersResponse;

    before(async () => {
      allUsersResponse = await axios.get(`${urlBase}/users`, {
        headers: {
          Authorization: `token ${process.env.ACCESS_TOKEN}`
        }
      });
    });

    it('and it should contain thirty users by default pagination', () => expect(allUsersResponse.data.length).to.equal(30));

    describe('when it filters the number of users to 10', () => {
      let users;

      before(async () => {
        const queryResponse = await axios.get(`${urlBase}/users`, { params: { per_page: 10 } }, {
          headers: {
            Authorization: `token ${process.env.ACCESS_TOKEN}`
          }
        });

        users = queryResponse.data;
      });

      it('then the number of filtered users should be equals to 10', () => expect(users.length).to.equal(10));
    });

    describe('when it filters the number of users to 100', () => {
      let users;

      before(async () => {
        const oneHundredUsersQuery = await axios.get(`${urlBase}/users`, { params: { per_page: 100 } }, {
          headers: {
            Authorization: `token ${process.env.ACCESS_TOKEN}`
          }
        });

        users = oneHundredUsersQuery.data;
      });

      it('then the number of filtered users should be equals to 100', () => expect(users.length).to.equal(100));
    });
  });
});
