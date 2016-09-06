import models from '../../../dist/models';
import { resources } from '../../../dist/rest';
const { Product } = models;

describe('models.Product', () => {

  describe('#images()', () => {
    it('returns a rest.resources.Images instance', () => {
      let model = new Product({props: {id: 8}});
      expect(model.images()).to.be.an.instanceof(resources.Images);
    });
  })

  describe('#combinations()', () => {
    it('returns a rest.resources.Combinations instance', () => {
      let model = new Product({props: {id: 8}});
      expect(model.combinations()).to.be.an.instanceof(resources.Combinations);
    });
  });

});
