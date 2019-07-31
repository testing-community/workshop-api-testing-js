const isomorphic = require('isomorphic-fetch');
const chai = require('chai');
const statusCode = require('http-status-codes');

chai.use(require('chai-subset'));

const { expect } = chai;

const jsCode = `
function wait(method, time) {
  return new Promise((resolve) => {
    setTimeout(resolve(method()), time);
  });
}
`;

const urlBase = 'https://api.github.com';
const defaultHeaders = {
  Authorization: `token ${process.env.ACCESS_TOKEN}`
};
let gist;

describe('Given a github user', () => {
  describe('when create a gist', () => {
    const createGist = {
      description: 'this is an example about promise',
      public: true,
      files: {
        'promise.js': {
          content: jsCode
        }
      }
    };

    let newGistQueryStatus;

    before(async () => {
      const parameters = {
        method: 'POST',
        body: JSON.stringify(createGist),
        headers: defaultHeaders
      };

      const response = await isomorphic(`${urlBase}/gists`, parameters);
      newGistQueryStatus = response.status;
      gist = await response.json();
    });

    it('then a new gist should be created', () => {
      expect(newGistQueryStatus).to.equal(statusCode.CREATED);
      expect(gist).to.containSubset(createGist);
    });

    describe('and get the new gist', () => {
      let gistQueryResponse;

      before(async () => {
        gistQueryResponse = await isomorphic(gist.url, {
          method: 'GET',
          headers: {
            Authorization: `token ${process.env.ACCESS_TOKEN}`
          }
        });
      });

      it('then the Gits should be accessible', () => {
        expect(gistQueryResponse.status).to.equal(statusCode.OK);
      });

      describe('when delete a gist', () => {
        let deleteGistQueryResponse;

        before(async () => {
          deleteGistQueryResponse = await isomorphic(gist.url, { method: 'DELETE', headers: defaultHeaders });
        });

        it('then the gist should be deleted', () => expect(deleteGistQueryResponse.status).to.equal(statusCode.NO_CONTENT));
      });

      describe('and try to get the delete gist', () => {
        let gistNotFoundQueryResponse;

        before(async () => {
          gistNotFoundQueryResponse = await isomorphic(gist.url, {
            headers: {
              Authorization: `token ${process.env.ACCESS_TOKEN}`
            }
          });
        });

        it('then the Gits should not be accessible', () => expect(gistNotFoundQueryResponse.status).to.equal(statusCode.NOT_FOUND));
      });
    });
  });
});
