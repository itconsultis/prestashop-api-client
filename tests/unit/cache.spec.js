import lru from '../../dist/lru';
import LRUCache from 'lru-cache';

describe('lru', () => {

  describe('.instance()', () => {

    beforeEach(() => lru.flush());
    afterEach(() => lru.flush());

    it('returns an LRUCache instance', () => {
      expect(lru.instance()).to.be.an.instanceof(LRUCache);
    });

    it('return a named LRUCache instance', () => {
      let cache1 = lru.instance('foo');
      let cache2 = lru.instance('bar');
      expect(cache1).not.to.equal(cache2);
    });

    it('returns the same LRUCache instance on a single namespace', () => {
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

      lru.flush();

      expect(cache1.length).to.equal(0);
      expect(cache2.length).to.equal(0);
    });
    
  });

});
