const axios = require('axios');
const { expect } = require('chai');
const { StatusCodes } = require('http-status-codes');

describe('First Api Tests', () => {
  it('Consume GET Service', async () => {
    const response = await axios.get('https://httpbin.org/ip');

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data).to.have.property('origin');
  });

  it('Consume GET service with query parameters', async () => {
    const query = {
      name: 'John',
      age: '31',
      city: 'New York'
    };

    const response = await axios.get('https://httpbin.org/get', { query });

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.config.query).to.eql(query);
  });

  it('Consume POST Service', async () => {
    const body = {
      name: 'John',
      age: 31,
      city: 'New York'
    };

    const response = await axios.post('https://httpbin.org/post', body);

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data.json).to.eql(body);
  });

  it('consume HEAD Service', async () => {
    const response = await axios.head('https://httpbin.org/headers');

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.headers).to.have.property('content-type', 'application/json');
    expect(response.data).to.eql('');
  });

  it('Consume PATCH Service', async () => {
    const body = {
      name: 'John',
      age: 31,
      city: 'New York'
    };

    const response = await axios.patch('https://httpbin.org/patch', body);

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data.json).to.eql(body);
  });

  it('Consume PUT Service', async () => {
    const body = {
      name: 'John',
      age: 31,
      city: 'New York'
    };

    const response = await axios.put('https://httpbin.org/put', body);

    expect(response.status).to.equal(StatusCodes.OK);
    expect(response.data.json).to.eql(body);
  });

  it('Consume DELETE Service', async () => {
    const body = {
      name: 'John',
      age: 31,
      city: 'New York'
    };

    const response = await axios.delete('https://httpbin.org/delete', body);
    expect(response.status).to.equal(StatusCodes.OK);
  });
});
