import { Client } from '../../../src/rest';

const P = Promise;

describe('rest.Client', () => {

  describe('#url()', () => {
    it('derives a proxy url', () => {
      let client = new Client({
        proxy: {scheme: 'https', host: 'api.local:3000', root: '/api'},
      });

      let expected = 'https://api.local:3000/api/foo/bar';
      let actual = client.url('/foo/bar');

      expect(actual).to.equal(expected);
    });

    it('derives a proxy url with query parameters', () => {
      let client = new Client({
        proxy: {scheme: 'https', host: 'api.local:3000', root: '/api'},
      });

      let expected = 'https://api.local:3000/api/foo/bar?a=1&b=2';
      let actual = client.url('/foo/bar', {a: 1, b: 2});

      expect(actual).to.equal(expected);
    });
  });

  describe('#get()', () => {
    it('sends a GET request', (done) => {
      let fetch = stub();
      let response = {ok: true};
      let promise = P.resolve(response);
      let client = new Client({fetch: {algo: fetch}});

      fetch.withArgs(match.string, match.object).returns(promise);

      client.get('/foo/bar').then((res) => {
        expect(res).to.equal(response);
        done();
      });
    });

    it('throws an Error on non-OK response', (done) => {
      let fetch = stub();
      let response = {ok: false};
      let promise = P.resolve(response);
      let client = new Client({fetch: {algo: fetch}});

      fetch.withArgs(match.string, match.object).returns(promise);

      client.get('/foo/bar')
      .then((res) => expect.fail())
      .catch((e) => done());
    });

  });

});

