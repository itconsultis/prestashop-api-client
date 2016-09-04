import models from '../../src/models';
import rest from '../../src/rest';

describe('models', () => {

  describe('Model', () => {
    describe('#set', () => {

      it('assigns a single attribute at arity 2', () => {
        let model = new models.Model();
        model.set('attribute', 'value');
        expect(model.get('attribute')).to.equal('value');
      });

      it('mass-assigns multiple attributes at arity 1', () => {
        let model = new models.Model();
        model.set({attribute1: 'value', attribute2: 'value'});
        expect(model.get('attribute1')).to.equal('value');
        expect(model.get('attribute2')).to.equal('value');
      });

      it('complains if called with no arguments', () => {
        let model = new models.Model();
        let badcall = () => model.set();
        expect(badcall).to.throw(Error);
      });

      it('complains if called with too many arguments', () => {
        let model = new models.Model();
        let badcall = () => model.set('too', 'many', 'args');
        expect(badcall).to.throw(Error);
      });

      it('coerces id to integer', () => {
        let model = new models.Model();
        model.set('id', '1');
        expect(model.get('id')).to.equal(1);        
      });

    });

    describe('#related', () => {
      it('returns a named resource', () => {
        let model = new models.Model();
        let resources = {images: {}};

        model.resources = sinon.stub().withArgs('images').returns(resources);
        expect(model.related('images')).to.equals(resources.images);
        expect(model.resources.calledOnce).to.be.ok;
      });

      it('complains if there is no match on key', () => {
        let model = new models.Model();
        let resources = {};
        let badcall = () => model.related('notfound');

        model.resources = sinon.stub().withArgs('images').returns(resources);
        expect(badcall).to.throw(Error);;
      });

    });

  });

  describe('Product', () => {

    describe('#related', () => {
      it('provides related images', () => {
        let model = new models.Product({id: 1});
        let resource = model.related('images');

        expect(resource).to.be.an.instanceof(rest.resources.Images);
      });
    });
  });

});
