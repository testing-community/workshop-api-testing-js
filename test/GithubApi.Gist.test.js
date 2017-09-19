const agent = require('superagent-promise')(require('superagent'), Promise);
const { expect } = require('chai');
const statusCode = require('http-status-codes');

const jsCode = `
function wait(method, time) {
  return new Promise((resolve) => {
    setTimeout(resolve(method()), time);
  });
}
`;

const urlBase = 'https://api.github.com';

describe('Given a github user', () => {
  describe('when create a gist', () => {
    let gist;

    const createGist = {
      description: 'this is an example about promise',
      public: true,
      files: {
        'promise.js': {
          content: jsCode
        }
      }
    };

    let newGistQuery;

    before(() => {
      newGistQuery = agent
        .post(`${urlBase}/gists`, createGist)
        .auth('token', process.env.ACCESS_TOKEN);
    });

    it('then a new gist should be created', () =>
      newGistQuery.then((response) => {
        gist = response.body;
        expect(response.status).to.equal(statusCode.CREATED);
        expect(createGist.description).to.equal(gist.description);
        expect(createGist.public).to.equal(gist.public);
        expect(createGist.files['promise.js'].content).to.equal(gist.files['promise.js'].content);
      }));

    describe('and get the new gist', () => {
      let gistQuery;

      before(() => {
        gistQuery = agent
          .get(gist.url)
          .auth('token', process.env.ACCESS_TOKEN);
      });

      it('then the Gits should be accessible', () =>
        gistQuery.then(response => expect(response.status).to.equal(statusCode.OK)));

      describe('when delete a gist', () => {
        let deleteGistQuery;

        before(() => {
          deleteGistQuery = agent
            .del(gist.url)
            .auth('token', process.env.ACCESS_TOKEN);
        });

        it('then the gist should be deleted', () =>
          deleteGistQuery
            .then(response => expect(response.status).to.equal(statusCode.NO_CONTENT)));
      });

      describe('and try to get the delete gist', () => {
        let gistNotFoundQuery;

        before(() => {
          gistNotFoundQuery = agent
            .get(gist.url)
            .auth('token', process.env.ACCESS_TOKEN);
        });

        it('then the Gits should not be accessible', () =>
          gistNotFoundQuery
            .catch(response => expect(response.status).to.equal(statusCode.NOT_FOUND)));
      });
    });
  });
});
