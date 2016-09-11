import { map } from 'lodash';

////////////////////////////////////////////////////////////////////////////////
const querystring = {};

export default querystring;

/**
 * Stringify a query per RFC 3986
 * @usage
 *
 *  // serialize a dictionary
 *  stringify({foo: 1, bar: 2})
 *  >>> foo=1&bar=2
 *
 *  // serialize an array of key-value tuples
 *  stringify([['foo', 1], ['bar', 2]])
 *  >>> foo=1&bar=2
 *
 * @param {Object|Array} query - a dictionary or an array of key-value tuples
 * @return {String}
 */
export const stringify = querystring.stringify = (query) => {
  let encode = encodeURIComponent;
  let serialize = (k, v) => `${encode(k)}=${encode(v)}`;

  if (Array.isArray(query)) {
    return map(query, (tuple) => serialize(...tuple)).join('&');
  }

  return map(query, (v, k) => serialize(k, v)).join('&');
};
