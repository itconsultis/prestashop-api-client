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

    beforeEach(() => lru.flush());
    afterEach(() => lru.flush());

    it('returns an LRUCache instance', () => {
      expect(lru.instance()).to.be.an.instanceof(LRUCache);
    });

    it('returns a named LRUCache instance', () => {
      let cache1 = lru.instance('foo');
      let cache2 = lru.instance('bar');
      expect(cache1).not.to.equal(cache2);
    });

    it('deterministically returns the same LRUCache instance on the same namespace', () => {
      let cache1 = lru.instance('foo');
      let cache2 = lru.instance('foo');
      expect(cache1).to.equal(cache2);  
    });

  });

  describe('.flush()', () => {

    beforeEach(() => lru.flush());
    afterEach(() => lru.flush());

    it('clears all caches', () => {
      let cache1 = lru.instance('foo');
      let cache2 = lru.instance('bar');

      cache1.set('scooby', 'doo');
      cache2.set('shaggy', 'doo');

      expect(cache1.length).to.be.ok;
      expect(cache2.length).to.be.ok;

      lru.flush();

      expect(cache1.length).to.equal(0);
      expect(cache2.length).to.equal(0);
    });
    
  });

});
