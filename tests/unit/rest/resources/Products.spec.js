import { resources } from '../../../../dist/rest';
import { Product } from '../../../../dist/models';

const { Products } = resources;
const P = Promise;
const error = new Error();

describe('rest.resources.Products', () => {

  describe('#get()', () => {

    it('returns a single Product model', (done) => {
      let client = {get: stub()};
      let resource = new Products({client: client});

      let xml = fixture('product-8.xml');
      let response = {ok: true, text: stub().returns(xml)};

      client.get.withArgs('/products/8').returns(P.resolve(response));

      resource.get(8)

      .then((model) => {
        expect(client.get.calledOnce).to.be.ok;
        expect(response.text.calledOnce).to.be.ok;
        expect(model).to.be.an.instanceof(Product);
      })

      .then(done)
      .catch((e) => done(error));
    });

  });

  describe('#list()', () => {

    it('returns a list of Product models', (done) => {
      let client = {get: stub()};
      let resource = new Products({client: client});

      // the product list response
      let response1 = {ok: true, text: stub().returns(fixture('products.xml'))};
      client.get.withArgs('/products').returns(P.resolve(response1));

      // responses for each product id in the list response
      let response2 = {ok: true, text: stub().returns(fixture('product-8.xml'))};
      let response3 = {ok: true, text: stub().returns(fixture('product-9.xml'))};
      client.get.withArgs('/products/8').returns(P.resolve(response2));
      client.get.withArgs('/products/9').returns(P.resolve(response3));

      resource.list()

      .then((models) => {
        expect(client.get.callCount).to.equal(3);
        expect(models).to.be.an.instanceof(Array);
        expect(models.length).to.equal(2);

        let [product8, product9] = models;

        expect(product8.get('id')).to.equal(8);
        expect(product9.get('id')).to.equal(9);
      })

      .then(done)
      .catch((e) => done(error));
    });
  });

});

