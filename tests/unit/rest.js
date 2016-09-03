import rest from '../../src/rest';
console.log(rest);

describe('rest', () => {

  describe('.Client', () => {

    describe('#url()', () => {
      it('correctly derives proxy url', () => {

        let client = new rest.Client({
          proxy: {scheme: 'https', host: 'api.local:3000', path: '/api'},
        });

        let expected = 'https://api.local:3000/api/foo/bar?a=1&b=2';
        let actual = client.url('/foo/bar', {a: 1, b: 2});

        expect(actual).to.equal(expected);
      });
    });
  });
});

