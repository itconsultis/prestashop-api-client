import xml from '../../src/xml';

describe('xml', () => {
  describe('.dom()', () => {
    it('converts XML string to an xmldom.Document', () => {
      expect(xml.dom(fixture('products.xml')));
    });
  });
});
