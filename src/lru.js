import LRU from 'lru-cache';

/**
 * @param {String} ns
 * @return {LRU}
 */
export const instance = (options={}) => {
  return new LRU({
    max: 1000,
    maxAge: 15 * 60 * 1000,
    ...options,
  });
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

export default { instance, dummy };
