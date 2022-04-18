const axios = require('axios');
const { expect } = require('chai');

const urlBase = 'https://api.github.com';

describe('Given an authenticate github user', () => {
  let user;

  before(async () => {
    const response = await axios.get(`${urlBase}/user`, {
      headers: {
        Authorization: `token ${process.env.ACCESS_TOKEN}`
      }
    });

    user = response.data;
  });

  it('then should have repositories', () => {
    expect(user.public_repos).to.be.above(0);
  });

  describe('when get all repositories', () => {
    let firstRepository;

    before(async () => {
      const response = await axios.get(user.repos_url, {
        headers: {
          Authorization: `token ${process.env.ACCESS_TOKEN}`
        }
      });

      const { data } = response;
      firstRepository = data.shift();
    });

    it('then should have some repository', () => {
      expect(firstRepository).to.not.equal(undefined);
    });

    describe('when create a new issue', () => {
      const newIssue = { title: 'this is an example about an issue' };
      const updateIssue = { body: 'add a body' };
      let issue;

      before(async () => {
        const response = await axios.post(`${urlBase}/repos/${user.login}/${firstRepository.name}/issues`, newIssue, {
          headers: {
            Authorization: `token ${process.env.ACCESS_TOKEN}`
          }
        });

        issue = response.data;
      });

      it('then the issue should be created', () => {
        expect(issue.id).to.not.equal(undefined);
        expect(issue.title).to.equal(newIssue.title);
        expect(issue.body).to.equal(null);
      });

      describe('when modify an issue', () => {
        let modifiedIssue;

        before(async () => {
          const response = await axios.patch(`${urlBase}/repos/${user.login}/${firstRepository.name}/issues/${issue.number}`, updateIssue, {
            headers: {
              Authorization: `token ${process.env.ACCESS_TOKEN}`
            }
          });

          modifiedIssue = response.data;
        });

        it('then add the body', () => {
          expect(modifiedIssue.title).to.equal(newIssue.title);
          expect(modifiedIssue.body).to.equal(updateIssue.body);
        });
      });
    });
  });
});
