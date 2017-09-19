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

    it('then a new gist should be created', () =>
      agent
        .post(`${urlBase}/gists`, createGist)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          gist = response.body;
          expect(response.status).to.equal(statusCode.CREATED);
          expect(createGist.description).to.equal(gist.description);
          expect(createGist.public).to.equal(gist.public);
          expect(createGist.files['promise.js'].content).to.equal(gist.files['promise.js'].content);
        }));

    it('and the Gits should be accessible', () =>
      agent
        .get(gist.url)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          expect(response.status).to.equal(statusCode.OK);
        }));

    it('and delete the current gist', () =>
      agent
        .del(gist.url)
        .auth('token', process.env.ACCESS_TOKEN)
        .then((response) => {
          expect(response.status).to.equal(statusCode.NO_CONTENT);
        }));

    it('and the Gits should not be accessible', () =>
      agent
        .get(gist.url)
        .auth('token', process.env.ACCESS_TOKEN)
        .catch((response) => {
          expect(response.status).to.equal(statusCode.NOT_FOUND);
        }));
  });
});
