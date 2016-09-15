import { resources } from '../../../../src/rest';
import { Manufacturer } from '../../../../src/models';

const { Manufacturers } = resources;
const P = Promise;
const error = () => new Error();

describe('rest.resources', () => {
  describe('Manufacturers', () => {

    describe('#get()', () => {

      it('returns a single Manufacturer model', (done) => {
        let client = {get: stub()};
        let resource = new Manufacturers({client});

        let text = P.resolve(fixture('manufacturer-1.xml'));
        let response = {ok: true, text: stub().returns(text), clone: () => response};

        client.get.withArgs('/manufacturers/1').returns(P.resolve(response));

        resource.get(1)

        .then((model) => {
          expect(client.get.calledOnce).to.be.ok;
          expect(response.text.calledOnce).to.be.ok;
          expect(model).to.be.an.instanceof(Manufacturer);
        })

        .then(done)
        .catch(done)
      });

    });

    describe('#list()', () => {

      it('returns a list of Manufacturer models', (done) => {
        let client = {get: stub()};
        let resource = new Manufacturers({client: client});

        // the manufacturer list response
        let response1 = {ok: true, text: stub().returns(fixture('manufacturers.xml')), clone: () => response1};
        client.get.withArgs('/manufacturers').returns(P.resolve(response1));

        // responses for each manufacturer id in the list response
        let response2 = {ok: true, text: stub().returns(fixture('manufacturer-1.xml')), clone: () => response2};
        client.get.withArgs('/manufacturers/1').returns(P.resolve(response2));

        resource.list()

        .then((models) => {
          expect(client.get.callCount).to.equal(2);
          expect(models).to.be.an.instanceof(Array);
          expect(models.length).to.equal(1);

          let [manufacturer1] = models;

          expect(manufacturer1.attrs.id).to.equal(1);
        })

        .then(done)
        .catch(done)
      });
    });
  });
});

