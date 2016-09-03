import map from 'lodash/map';

////////////////////////////////////////////////////////////////////////////////
const querystring = {};

export default querystring;


/**
 * Stringify a query per RFC 3986
 * @param {Object} query
 * @return {String}
 */
export const stringify = querystring.stringify = (query) => {
  let encode = encodeURIComponent;
  return map(query, (v, k) => `${encode(k)}=${encode(v)}`).join('&');
};
