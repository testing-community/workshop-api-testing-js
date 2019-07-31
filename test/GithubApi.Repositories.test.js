const agent = require('superagent');
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
      const userQueryResponse = await agent.get(`${urlBase}/users/${username}`)
        .auth('token', process.env.ACCESS_TOKEN)
        .set('User-Agent', 'agent');

      user = userQueryResponse.body;
    });

    it('then the user should be loaded', () => {
      expect(user.name).to.equal('Alejandro Perdomo');
      expect(user.company).to.equal('PSL');
      expect(user.location).to.equal('Colombia');
    });

    describe('when get his repositories', () => {
      let repositories;
      let repository;
      const expectedRepository = 'jasmine-awesome-report';

      before(async () => {
        const repositoriesQueryResponse = await agent.get(user.repos_url)
          .auth('token', process.env.ACCESS_TOKEN)
          .set('User-Agent', 'agent');

        repositories = repositoriesQueryResponse.body;
        repository = repositories.find(repo => repo.name === expectedRepository);
      });

      it(`then should have ${expectedRepository} repository`, () => {
        assert.exists(repository);
        expect(repository.full_name).to.equal('aperdomob/jasmine-awesome-report');
        expect(repository.private).to.equal(false);
        expect(repository.description).to.equal('An awesome html report for Jasmine');
      });

      describe('when download main branch', () => {
        const noExpectedMd5 = 'd41d8cd98f00b204e9800998ecf8427e';
        let zip;

        before(async () => {
          const downloadQueryResponse = await agent.get(`${repository.svn_url}/archive/${repository.default_branch}.zip`)
            .auth('token', process.env.ACCESS_TOKEN)
            .set('User-Agent', 'agent')
            .buffer(true);

          zip = downloadQueryResponse.text;
        });

        it('then the repository should be downloaded', () => {
          expect(md5(zip)).to.not.equal(noExpectedMd5);
        });
      });

      describe('when get path file list', () => {
        const format = {
          name: 'README.md',
          path: 'README.md',
          sha: 'b9900ca9b34077fe6a8f2aaa37a173824fa9751d'
        };

        let files;
        let readme;

        before(async () => {
          const readmeFileQueryResponse = await agent.get(`${repository.url}/contents`)
            .auth('token', process.env.ACCESS_TOKEN)
            .set('User-Agent', 'agent');

          files = readmeFileQueryResponse.body;
          readme = files.find(file => file.name === 'README.md');
        });

        it('then should have README.md file', () => {
          assert.exists(readme);
          expect(readme).containSubset(format);
        });

        describe('when get the file content', () => {
          const expectedMd5 = '0e62b07144b4fa997eedb864ff93e26b';
          let fileContent;

          before(async () => {
            const downloadReadmeQuery = await agent.get(readme.download_url);
            fileContent = downloadReadmeQuery.text;
          });

          it('then the file should be downloaded', () => {
            expect(md5(fileContent)).to.equal(expectedMd5);
          });
        });
      });
    });
  });
});
