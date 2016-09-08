import { parse } from '../../src/xml';

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

  });

  describe('.parse.combination', () => {
    describe('.properties()', () => {
      it('parses Combination properties', () => {
        let xml = fixture('combination-47.xml');

        return parse.combination.properties(xml)

        .then((props) => {
          let floatzero = 0.000000;

          expect(Number(props.id)).to.equal(47);
          expect(Number(props.id_product)).to.equal(8);
          expect(props.location).to.equal('');
          expect(props.ean13).to.equal('');
          expect(props.upc).to.equal('');
          expect(Number(props.quantity)).to.equal(1);
          expect(props.reference).to.equal('001');
          expect(props.supplier_reference).to.equal('');
          expect(Number(props.wholesale_price)).to.equal(floatzero);
          expect(Number(props.price)).to.equal(floatzero);
          expect(Number(props.ecotax)).to.equal(floatzero);
          expect(Number(props.weight)).to.equal(floatzero);
          expect(Number(props.unit_price_impact)).to.equal(floatzero);
          expect(Number(props.minimal_quantity)).to.equal(1);
          expect(props.default_on).to.equal('');
          expect(props.available_date).to.equal('0000-00-00');
          expect(props.related.product).to.equal(8);
          expect(props.related.product_option_values).to.be.an.instanceof(Array);
          expect(props.related.product_option_values.length).to.equal(1);
          expect(props.related.product_option_values).to.include(26);
        });
      });
    });
  });

  describe('.parse.manufacturer', () => {
    describe('.properties()', () => {
      let xml = fixture('manufacturer-1.xml');

      return parse.manufacturer.properties(xml)

      .then((props) => {
        
      });
    });
  });

});
