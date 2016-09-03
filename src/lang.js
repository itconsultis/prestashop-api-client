const lang = {};

export default lang;

/**
 * This works like PHP's empty() function. Behaviors:
 *  - return true if value is falsy
 *  - return true if the value is the integer zero
 *  - return true if the value has a length property that is zero
 *  - return true if the value is an object that does not own any properties
 *  - return false for everything else
 * @param mixed value
 * @return {Boolean}
 */
export const empty = lang.empty = (value) => {
  if (value === undefined) {
    return true;
  }

  if (typeof value !== 'object' && isNaN(value)) {
    return false;
  }

  // falsy value is always empty
  if (!value) {
    return true;
  }

  // number zero is empty
  if (typeof value === 'number') {
    return value === 0;
  }

  // zero-length anything is empty
  if (typeof value.length === 'number') {
    return !value.length;
  }

  // zero-size anything is empty
  if (typeof value.size === 'number') {
    return !value.size;
  }

  // an object that does not own any properties is empty
  if (typeof value === 'object') {
    return Object.getOwnPropertyNames(value).length === 0;
  }

  // default to false
  return false;
};

