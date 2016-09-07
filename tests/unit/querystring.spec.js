import querystring from '../../dist/querystring';

describe('querystring', () => {
  describe('.stringify()', () => {
    it('converts an Object to a query string', () => {
      let input = {foo: 'one', bar: 2};
      let expected = 'foo=one&bar=2';
      let actual = querystring.stringify(input);

      expect(actual).to.equal(expected);
    });

    it('converts a list of tuples to a query string', () => {
      let input = [['foo', 'one'], ['bar', 2]];
      let expected = 'foo=one&bar=2';
      let actual = querystring.stringify(input);

      expect(actual).to.equal(expected);
    });

  });
});
