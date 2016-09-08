const sort = {};

/**
 * Return a sort comparator given a function that returns a sortable value.
 * @param {Function} resolve
 * @return {Function}
 */
export const ascending = sort.ascending = (resolve) => {
  return (a, b) => resolve(a) - resolve(b);
};

/**
 * Return a sort comparator given a function that returns a sortable value.
 * @param {Function} resolve
 * @return {Function}
 */
export const descending = sort.descending = (resolve) => {
  return (a, b) => resolve(b) - resolve(a);
};

export default sort;
