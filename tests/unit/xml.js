import xml from '../../src/xml';

describe('xml', () => {
  describe('.parse()', () => {
    it('converts XML to a plain Object', (done) => {
      xml.parse(fixture('products.xml'))
      .then((output) => expect(output.prestashop).to.be.object)
      .then(() => done());
    });
  });
});
