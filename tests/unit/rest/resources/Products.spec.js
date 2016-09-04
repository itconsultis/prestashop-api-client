import { resources } from '../../../../src/rest';
import { Product } from '../../../../src/models';

const { Products } = resources;
const P = Promise;
const match = sinon.match;

describe('rest.resources.Products', () => {

  describe('#get()', () => {

    it('returns a single Product model', (done) => {
      let client = {get: sinon.stub()};
      let resource = new Products({client: client});

      let xml = fixture('product-8.xml');
      let response = {ok: true, text: sinon.stub().returns(xml)};

      client.get.withArgs('/products/8').returns(P.resolve(response));

      resource.get(8)

      .then((model) => {
        expect(client.get.calledOnce).to.be.ok;
        expect(response.text.calledOnce).to.be.ok;
        expect(model).to.be.an.instanceof(Product);
      })

      .then(done)
      .catch(done);
    });

  });

});

