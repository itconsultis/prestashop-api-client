import lru from '../../src/lru';
import LRUCache from 'lru-cache';

describe('lru', () => {

  describe('.dummy()', () => {
    it('returns an null object that duck-types LRUCache', () => {
      let dummy = lru.dummy();
      expect(dummy.length).to.equal(0);
      expect(dummy.itemCount).to.equal(0);
      expect(dummy.get).to.be.a('function');
      expect(dummy.set).to.be.a('function');
      expect(dummy.reset).to.be.a('function');
      expect(dummy.peek).to.be.a('function');
      expect(dummy.del).to.be.a('function');
      expect(dummy.has).to.be.a('function');
      expect(dummy.forEach).to.be.a('function');
      expect(dummy.keys).to.be.a('function');
      expect(dummy.values).to.be.a('function');
      expect(dummy.dump).to.be.a('function');
    });
  });

  describe('.instance()', () => {
    it('returns an LRUCache instance', () => {
      expect(lru.instance()).to.be.an.instanceof(LRUCache);
    });
  });

});
