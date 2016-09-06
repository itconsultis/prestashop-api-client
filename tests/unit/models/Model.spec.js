import models from '../../../dist/models';
import rest from '../../../dist/rest';

const { Model } = models;

describe('models.Model', () => {

  describe('#constructor()', () => {
    it('mass-assigns supplied properties', () => {
      let model = new Model({props: {foo: 2}});
      expect(model.foo).to.equal(2);
    });
  });

  describe('#set()', () => {
    it('mass-assigns supplied properties at arity 1', () => {
      let model = new Model();
      model.set({foo: 2, bar: 3});
      expect(model.foo).to.equal(2);
      expect(model.bar).to.equal(3);
    });

    it('assigns a single property at arity 2', () => {
      let model = new Model();
      model.set('foo', 2);
      expect(model.foo).to.equal(2);
    })

    it('coerces property values via #mutators()', () => {
      let model = new Model();
      model.mutators = stub().returns({foo: [x=>'scooby-doo']});
      model.set('foo', 2);

      expect(model.foo).to.equal('scooby-doo');
      expect(model.mutators.calledOnce).to.be.ok;
    });
  });

});
