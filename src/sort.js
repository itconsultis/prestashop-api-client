const sort = {};

/**
 * @param {Function} evaluate
 * @return {Function}
 */
export const ascending = sort.ascending = (evaluate) => {
  return (a, b) => evaluate(a) - evaluate(b);
};

/**
 * @param {Function} evaluate
 * @return {Function}
 */
export const descending = sort.descending = (evaluate) => {
  return (a, b) => evaluate(b) - evaluate(a);
};

export default sort;
