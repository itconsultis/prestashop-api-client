import { resources } from '../../../../dist/rest';
const { Resource } = resources;
const P = Promise;
const DummyModel = class {};

describe('rest.resources.Resource', () => {

  describe ('#language property', () => {
    it('reflects the client language', () => {
      let client = {language: 2};
      let resource = new Resource({client});

      expect(resource.language).to.equal(client.language);

      client.language = 3;
      expect(resource.language).to.equal(client.language);
    });
  });
});

