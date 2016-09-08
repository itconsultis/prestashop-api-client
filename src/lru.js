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

/**
 * @param void
 * @return {Object}
 */
export const dummy = () => {
  let noop = () => {};

  return {
    length: 0,
    itemCount: 0,
    get: noop,
    set: noop,
    reset: noop,
    peek: noop,
    del: noop,
    has: () => false,
    forEach: noop,
    rforEach: noop,
    keys: () => [],
    values: () => [],
    dump: () => [],
  };
};

export default { instance, flush, dummy };
