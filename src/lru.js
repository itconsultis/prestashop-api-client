import LRU from 'lru-cache';

let caches;

/**
 * @param {String} ns
 * @return {LRU}
 */
export const instance = (ns='default') => {
  if (!caches) {
     caches = new Map();
  }

  if (!caches.has(ns)) {
    caches.set(ns, new LRU({
      max: 100,
      maxAge: 900 * 1000,
    }));
  }

  return caches.get(ns);
};

/**
 * @param void
 * @return void
 */
export const flush = () => {
  if (!caches) {
     caches = new Map();
  }

  for (let [ns, cache] of caches.entries()) {
    cache.reset();
    caches.delete(ns);
  }
};

export default { instance, flush };
