const agent = require('superagent');
const { expect } = require('chai');

const urlBase = 'https://api.github.com';

describe('Given an authenticate github user', () => {
  let user;

  before(async () => {
    const response = await agent.get(`${urlBase}/user`)
      .auth('token', process.env.ACCESS_TOKEN)
      .set('User-Agent', 'agent');

    user = response.body;
  });

  it('then should have repositories', () => {
    expect(user.public_repos).to.be.above(0);
  });

  describe('when get all repositories', () => {
    let firstRepository;

    before(async () => {
      const response = await agent.get(user.repos_url)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');

      const { body } = response;
      firstRepository = body.shift();
    });

    it('then should have some repository', () => {
      expect(firstRepository).to.not.equal(undefined);
    });

    describe('when create a new issue', () => {
      const newIssue = { title: 'this is an example about an issue' };
      const updateIssue = { body: 'add a body' };
      let issue;

      before(async () => {
        const response = await agent.post(`${urlBase}/repos/${user.login}/${firstRepository.name}/issues`, newIssue)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent');

        issue = response.body;
      });

      it('then the issue should be created', () => {
        expect(issue.id).to.not.equal(undefined);
        expect(issue.title).to.equal(newIssue.title);
        expect(issue.body).to.equal(null);
      });

      describe('when modify an issue', () => {
        let modifiedIssue;

        before(async () => {
          const response = await agent.patch(`${urlBase}/repos/${user.login}/${firstRepository.name}/issues/${issue.number}`, updateIssue)
            .auth('token', process.env.ACCESS_TOKEN)
            .set('User-Agent', 'agent');

          modifiedIssue = response.body;
        });

        it('then add the body', () => {
          expect(modifiedIssue.title).to.equal(newIssue.title);
          expect(modifiedIssue.body).to.equal(updateIssue.body);
        });
      });
    });
  });
});
