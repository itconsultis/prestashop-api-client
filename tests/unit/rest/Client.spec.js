import { Client } from '../../../src/rest';
const P = Promise;
const error = new Error();
const pass = () => P.resolve();
const fail = () => P.reject();

describe('rest.Client', () => {

  describe('#language property', () => {
    it('is a language id', () => {
      let client = new Client({
        language: 'es',
        languages: {
          'en': 1,
          'es': 2,
        },
      });

      expect(client.language).to.equal(2);
    });
  });

  describe('#url()', () => {
    it('derives a web service url', () => {
      let client = new Client({
        webservice: {scheme: 'https', host: 'api.local:3000', root: '/api'},
      });

      let expected = 'https://api.local:3000/api/foo/bar';
      let actual = client.url('/foo/bar');

      expect(actual).to.equal(expected);
    });

    it('derives a web service url with query parameters', () => {
      let client = new Client({
        webservice: {scheme: 'https', host: 'api.local:3000', root: '/api'},
      });

      let expected = 'https://api.local:3000/api/foo/bar?a=1&b=2';
      let actual = client.url('/foo/bar', {a: 1, b: 2});

      expect(actual).to.equal(expected);
    });
  });

  describe('#get()', () => {
    it('sends a GET request', () => {
      let fetch = stub();
      let response = {ok: true, clone: () => response};
      let promise = P.resolve(response);
      let client = new Client({fetch: {algo: fetch}});

      fetch.withArgs(match.string, match.object).returns(promise);

      return client.get('/foo/bar')

      .then((res) => {
        expect(fetch.calledOnce).to.be.ok;
        expect(res).to.equal(response);
      })
    });

    it('throws an Error on non-OK response', () => {
      let fetch = stub();
      let response = {ok: false, clone: () => response};
      let promise = P.resolve(response);
      let client = new Client({fetch: {algo: fetch}});

      fetch.withArgs(match.string, match.object).returns(promise);

      return client.get('/foo/bar')
      .then(fail)
      .catch(pass);
    });

    it('caches responses', () => {
      let text = P.resolve(fixture('products.xml'));
      let response = {ok: true, clone: () => response, text: stub().returns(text)};
      let fetch = stub().returns(P.resolve(response));
      let cache = {get: stub(), set: stub()};

      let client = new Client({
        language: 'en',
        server: {scheme: 'https', host: 'api.local:3000', root: '/api'},
        fetch: {algo: fetch},
        cache: cache,
      });

      cache.get.onCall(0).returns(null);
      cache.get.onCall(1).returns(response);

      fetch.withArgs(match.string, match.object).returns(P.resolve(response));

      return client.get('/foo/bar')

      .then((res) => {
        expect(res).to.equal(response);
        expect(fetch.calledOnce).to.be.ok;
        expect(cache.get.calledOnce).to.be.ok;
        expect(cache.set.calledOnce).to.be.ok;

        return client.get('/foo/bar'); 
      })

      .then((res) => {
        expect(res).to.equal(response);
        expect(fetch.calledOnce).to.be.ok;
        expect(cache.get.calledTwice).to.be.ok;
        expect(cache.set.calledOnce).to.be.ok;
      })
    });

  });

  describe('root resource access', () => {
    let client = new Client();

    describe('#resource()', () => {
      it('returns Products resource on key "products"', () => {
        expect(client.resource('products')).to.be.ok;
      });
      it('returns Combinations resource on key "combinations"', () => {
        expect(client.resource('combinations')).to.be.ok;
      });
      it('returns Manufacturers resource on key "manufacturers"', () => {
        expect(client.resource('manufacturers')).to.be.ok;
      });
      it('returns Images resource on key "images"', () => {
        expect(client.resource('images')).to.be.ok;
      });
    })
  });

  describe('#createAuthorizationHeader()', () => {
    it('returns Authorization header value', () => {
      let client = new Client();
      let key = 'IW6SQL9FICVWMJ6BWBASP24ABCNSSEZW';
      let expected = 'Basic SVc2U1FMOUZJQ1ZXTUo2QldCQVNQMjRBQkNOU1NFWlc6';
      let actual = client.createAuthorizationHeader(key);

      expect(actual).to.equal(expected);
    });
  });

  describe('#createFetchOptions()', () => {
    it('return value includes #headers property containing the Authorization header', () => {
      let client = new Client({webservice: {key: 'foo'}});
      let Authorization = 'Basic SVc2U1FMOUZJQ1ZXTUo2QldCQVNQMjRBQkNOU1NFWlc6';

      client.createAuthorizationHeader = stub().returns(Authorization);

      let fetchopts = client.createFetchOptions();
      expect(fetchopts.headers).to.be.an('object');
      expect(fetchopts.headers['Authorization']).to.equal(Authorization);
    });
  });

});

