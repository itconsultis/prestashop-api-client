import models from '../../../src/models';
import rest from '../../../src/rest';

const { Model } = models;

describe('models.Model', () => {

  describe('#constructor()', () => {
    it('mass-assigns supplied properties', () => {
      let model = new Model({attrs: {foo: 2}});
      expect(model.attrs.foo).to.equal(2);
    });
  });

  describe('#set()', () => {
    it('mass-assigns supplied properties at arity 1', () => {
      let model = new Model();
      model.set({foo: 2, bar: 3});
      expect(model.attrs.foo).to.equal(2);
      expect(model.attrs.bar).to.equal(3);
    });

    it('assigns a single property at arity 2', () => {
      let model = new Model();
      model.set('foo', 2);
      expect(model.attrs.foo).to.equal(2);
    })

    it('coerces property values via #mutators()', () => {
      let model = new Model();
      model.mutators = stub().returns({foo: [x=>'scooby-doo']});
      model.set('foo', 2);

      expect(model.attrs.foo).to.equal('scooby-doo');
      expect(model.mutators.calledOnce).to.be.ok;
    });
  });

  describe('#mutators()', () => {
    it('returns an object', () => {
      let model = new Model();
      let mutators = model.mutators();

      expect(mutators).to.be.ok;
      expect(mutators).to.be.an.instanceof(Object);
      expect(mutators).not.to.be.an.instanceof(Array)
    });
  });

});
