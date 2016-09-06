import { parse } from '../../dist/xml';

describe('xml', () => {

  describe('.parse()', () => {
    it('converts XML string to a plain object', () => {
      return parse(fixture('products.xml'))
      .then((obj) => expect(obj).to.be.ok)
    });
  });

  describe('.parse.product', () => {
    describe('.properties()', () => {
      it('parses Product model properties', () => {
        let xml = fixture('product-8.xml');

        return parse.product.properties(xml)

        .then((props) => {
          expect(Number(props.id)).to.equal(8);
          expect(props.name).to.equal('product-8-name-en');
          expect(props.description).to.be.ok;
          expect(props.description).to.be.a('string');
          expect(props.description_short).to.equal('');
          expect(props.description_short).to.be.a('string');
          expect(props.related.manufacturer).to.equal(0);
          expect(props.related.combinations).to.include(46, 47, 48, 49, 50, 51, 52, 53);
          expect(props.related.images).to.include(24);
        })
      });
    });

    describe('.ids()', () => {
      it('parses Product ids', () => {
        let xml = fixture('products.xml');

        return parse.product.ids(xml)

        .then((ids) => {
          expect(ids.length).to.equal(2);
          expect(ids).to.include(8, 9);
        });
      });
    });
  });



});
