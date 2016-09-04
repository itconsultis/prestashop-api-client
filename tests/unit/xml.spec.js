import xml from '../../src/xml';

describe('xml', () => {
  describe('.dom()', () => {
    it('converts XML string to a DOMDocument', () => {
      expect(xml.dom(fixture('products.xml'))).to.be.ok;
    });
  });

  describe('.parse()', () => {
    it('converts XML string to a plain object', (done) => {
      xml.parse(fixture('products.xml'))
      .then((obj) => expect(obj).to.be.ok)
      .then(() => done())
    });
  });
});
