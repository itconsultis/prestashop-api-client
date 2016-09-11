import { resources } from '../../../../src/rest';
import { Image } from '../../../../src/models';
const { Images } = resources;
const P = Promise;

describe('rest.resources.Images', () => {

  describe('#list()', () => {

    it('returns a list of Image models', (done) => {
      let client = {get: stub()};

      let resource = new Images({
        client: client,
        root: '/images/products/8',
      });

      let text = P.resolve(fixture('product-8-images.xml'));
      let response = {ok: true, text: stub().returns(text), clone: () => response};

      client.get.withArgs('/images/products/8').returns(P.resolve(response));

      resource.list()

      .then((models) => {
        expect(client.get.calledOnce).to.be.ok;
        expect(response.text.calledOnce).to.be.ok;
        expect(models).to.be.an.instanceof(Array);
        expect(models.length).to.equal(1);
        expect(models[0]).to.be.an.instanceof(Image);
        expect(models[0].attrs.src).to.equal('http://localhost/api/images/products/8/24');
      })

      .then(done)
      .catch(done)
    });

  });

});

