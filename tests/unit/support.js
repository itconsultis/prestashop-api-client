import { querystring, XML } from '../../src/support';

describe('support.XML', () => {
  describe('.parse()', () => {
    it('converts XML to a plain Object', (done) => {
      let xml = fixture('products.xml');

      XML.parse(xml)
      .then((output) => expect(output.prestashop).to.be.object)
      .then(() => done());
    });
  });
});

describe('support.querystring', () => {
  describe('.stringify()', () => {
    it('converts an Object to a query string', () => {
      let input = {foo: 'one', bar: 2};
      let expected = 'foo=one&bar=2';
      let actual = querystring.stringify(input);

      expect(actual).to.equal(expected);
    });
  });
});
