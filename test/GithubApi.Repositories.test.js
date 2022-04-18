const axios = require('axios');
const chai = require('chai');
const md5 = require('md5');

chai.use(require('chai-subset'));

const { expect, assert } = chai;

const urlBase = 'https://api.github.com';

describe('Given a user logged in github', () => {
  const username = 'aperdomob';

  describe(`when get ${username} user`, () => {
    let user;

    before(async () => {
      const userQueryResponse = await axios.get(`${urlBase}/users/${username}`, {
        headers: {
          Authorization: `token ${process.env.ACCESS_TOKEN}`
        }
      });

      user = userQueryResponse.data;
    });

    it('then the user should be loaded', () => {
      expect(user.name).to.equal('Alejandro Perdomo');
      expect(user.company).to.equal('Perficient Latam');
      expect(user.location).to.equal('Colombia');
    });

    describe('when get his repositories', () => {
      let repositories;
      let repository;
      const expectedRepository = 'jasmine-json-report';

      before(async () => {
        const repositoriesQueryResponse = await axios.get(user.repos_url, {
          headers: {
            Authorization: `token ${process.env.ACCESS_TOKEN}`
          }
        });

        repositories = repositoriesQueryResponse.data;
        repository = repositories.find((repo) => repo.name === expectedRepository);
      });

      it(`then should have ${expectedRepository} repository`, () => {
        assert.exists(repository);
        expect(repository.full_name).to.equal('aperdomob/jasmine-json-report');
        expect(repository.private).to.equal(false);
        expect(repository.description).to.equal('A Simple Jasmine JSON Report');
      });

      describe('when download main branch', () => {
        const noExpectedMd5 = 'd41d8cd98f00b204e9800998ecf8427e';
        let zip;

        before(async () => {
          const downloadQueryResponse = await axios
            .get(`${repository.svn_url}/archive/${repository.default_branch}.zip`, {
              headers: {
                Authorization: `token ${process.env.ACCESS_TOKEN}`
              }
            });
          zip = downloadQueryResponse.data;
        });

        it('then the repository should be downloaded', () => {
          expect(md5(zip)).to.not.equal(noExpectedMd5);
        });
      });

      describe('when get path file list', () => {
        const format = {
          name: 'README.md',
          path: 'README.md',
          sha: '360eee6c223cee31e2a59632a2bb9e710a52cdc0'
        };

        let files;
        let readme;

        before(async () => {
          const readmeFileQueryResponse = await axios
            .get(`${repository.url}/contents`, {
              headers: {
                Authorization: `token ${process.env.ACCESS_TOKEN}`
              }
            });

          files = readmeFileQueryResponse.data;
          readme = files.find((file) => file.name === 'README.md');
        });

        it('then should have README.md file', () => {
          assert.exists(readme);
          expect(readme).containSubset(format);
        });

        describe('when get the file content', () => {
          const expectedMd5 = '497eb689648cbbda472b16baaee45731';
          let fileContent;

          before(async () => {
            const downloadReadmeQuery = await axios.get(readme.download_url);
            fileContent = downloadReadmeQuery.data;
          });

          it('then the file should be downloaded', () => {
            expect(md5(fileContent)).to.equal(expectedMd5);
          });
        });
      });
    });
  });
});
