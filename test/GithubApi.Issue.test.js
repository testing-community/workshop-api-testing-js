const agent = require('superagent-promise')(require('superagent'), Promise);
// const statusCode = require('http-status-codes');
const { expect } = require('chai');

const urlBase = 'https://api.github.com';

describe('Given an authenticate github user', () => {
  let user;

  before(() => {
    const request = agent.get(`${urlBase}/user`)
      .auth('token', process.env.ACCESS_TOKEN)
      .then((response) => {
        user = response.body;
      });

    return request;
  });

  it('then should have repositories', () => {
    expect(user.public_repos).to.be.above(0);
  });

  describe('when get all repositories', () => {
    let firstRepository;

    before(() => {
      const request = agent.get(user.repos_url)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          const { body } = response;
          firstRepository = body.shift();
        });

      return request;
    });

    it('then should have some repository', () => {
      expect(firstRepository).to.not.equal(undefined);
    });

    describe('when create a new issue', () => {
      const newIssue = { title: 'this is an example about an issue' };
      const updateIssue = { body: 'add a body' };
      let issue;

      before(() => {
        const request = agent.post(`${urlBase}/repos/${user.login}/${firstRepository.name}/issues`, newIssue)
          .auth('token', process.env.ACCESS_TOKEN)
          .then((response) => {
            issue = response.body;
          });

        return request;
      });

      it('then the issue should be created', () => {
        expect(issue.title).to.equal(newIssue.title);
      });

      it('then add the body', () =>
        agent.patch(`${urlBase}/repos/${user.login}/${firstRepository.name}/issues/${issue.number}`, updateIssue)
          .auth('token', process.env.ACCESS_TOKEN)
          .then((response) => {
            expect(response.body.title).to.equal(newIssue.title);
            expect(response.body.body).to.equal(updateIssue.body);
          }));
    });
  });
});
