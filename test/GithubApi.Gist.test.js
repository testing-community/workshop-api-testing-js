const axios = require('axios');
const chai = require('chai');
const { StatusCodes } = require('http-status-codes');

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

    let newGistQueryResponse;

    before(async () => {
      newGistQueryResponse = await axios.post(`${urlBase}/gists`, createGist, {
        headers: {
          Authorization: `token ${process.env.ACCESS_TOKEN}`
        }
      });

      gist = newGistQueryResponse.data;
    });

    it('then a new gist should be created', () => {
      expect(newGistQueryResponse.status).to.equal(StatusCodes.CREATED);
      expect(gist).to.containSubset(createGist);
    });

    describe('and get the new gist', () => {
      let gistQueryResponse;

      before(async () => {
        gistQueryResponse = await axios.get(gist.url, {
          headers: {
            Authorization: `token ${process.env.ACCESS_TOKEN}`
          }
        });
      });

      it('then the Gits should be accessible', () => expect(gistQueryResponse.status).to.equal(StatusCodes.OK));

      describe('when delete a gist', () => {
        let deleteGistQuery;

        before(async () => {
          deleteGistQuery = await axios.delete(gist.url, {
            headers: {
              Authorization: `token ${process.env.ACCESS_TOKEN}`
            }
          });
        });

        it('then the gist should be deleted', () => expect(deleteGistQuery.status).to.equal(StatusCodes.NO_CONTENT));
      });

      describe('and try to get the delete gist', () => {
        let responseStatus;

        before(async () => {
          try {
            await axios.get(gist.url, {
              headers: {
                Authorization: `token ${process.env.ACCESS_TOKEN}`
              }
            });
          } catch (response) {
            responseStatus = response.response.status;
          }
        });

        it('then the Gits should not be accessible', () => {
          expect(responseStatus).to.equal(StatusCodes.NOT_FOUND);
        });
      });
    });
  });
});
