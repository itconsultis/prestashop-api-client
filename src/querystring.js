import { map } from 'lodash';

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
  let serialize = (k, v) => `${encode(k)}=${encode(v)}`;

  if (Array.isArray(query)) {
    return map(query, (tuple) => serialize(...tuple)).join('&');
  }

  return map(query, (v, k) => serialize(k, v)).join('&');
};
