import xml from '../../dist/xml';

describe('xml', () => {

  describe('.parse()', () => {
    it('converts XML string to a plain object', (done) => {
      xml.parse(fixture('products.xml'))
      .then((obj) => expect(obj).to.be.ok)
      .then(() => done())
    });
  });
});
