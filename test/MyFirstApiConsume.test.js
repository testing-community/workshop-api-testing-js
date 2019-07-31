const agent = require('superagent');
const statusCode = require('http-status-codes');
const { expect } = require('chai');

describe('First Api Tests', () => {
  it('Consume GET Service', async () => {
    const response = await agent.get('https://httpbin.org/ip');

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body).to.have.property('origin');
  });

  it('Consume GET Service with query parameters', async () => {
    const query = {
      name: 'John',
      age: '31',
      city: 'New York'
    };

    const response = await agent.get('https://httpbin.org/get').query(query);

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.args).to.eql(query);
  });

  it('Consume POST Service', async () => {
    const body = {
      name: 'John',
      age: 31,
      city: 'New York'
    };

    const response = await agent
      .post('https://httpbin.org/post')
      .send(body);

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.json).to.eql(body);
  });

  it('consume HEAD Service', async () =>{
    const response = await agent.head('https://httpbin.org/headers');

    expect(response.status).to.equal(statusCode.OK);
    expect(response.headers).to.have.property('content-type', 'application/json');
    expect(response.body).to.eql({});
  });

  it('Consume PATCH Service', async () => {
    const body = {
      name: 'John',
      age: 31,
      city: 'New York'
    };

    const response = await agent
      .patch('https://httpbin.org/patch')
      .send(body);

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.json).to.eql(body);
  });

  it('Consume PUT Service', async () => {
    const body = {
      name: 'John',
      age: 31,
      city: 'New York'
    };

    const response = await agent
      .put('https://httpbin.org/put')
      .send(body);

    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.json).to.eql(body);
  });

  it('Consume DELETE Service', async () => {
    const body = {
      name: 'John',
      age: 31,
      city: 'New York'
    };

    const response = await agent
      .del('https://httpbin.org/delete')
      .send(body);
    expect(response.status).to.equal(statusCode.OK);
    expect(response.body.json).to.eql(body);
  });
});
