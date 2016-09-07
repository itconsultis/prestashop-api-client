import LRU from 'lru-cache';

let caches;

const init = () => {
  if (!caches) {
    caches = new Map();
  }
};

/**
 * @param {String} ns
 * @return {LRU}
 */
export const instance = (ns='default') => {
  init();

  if (!caches.has(ns)) {
    caches.set(ns, new LRU({
      max: 256,
      maxAge: 15 * 60 * 1000, // 15 minutes
    }));
  }

  return caches.get(ns);
};

/**
 * @param void
 * @return void
 */
export const flush = () => {
  init();

  for (let [ns, cache] of caches.entries()) {
    cache.reset();
    caches.delete(ns);
  }
};

export default { instance, flush };
