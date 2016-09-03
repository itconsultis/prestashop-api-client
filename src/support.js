import map from 'lodash/map';
import xml2js from 'xml2js';
const P = Promise;

////////////////////////////////////////////////////////////////////////////////
export const querystring = {

  /**
   * Stringify a query per RFC 3986
   * @param {Object} query
   * @return {String}
   */
  stringify: (query) => {
    let encode = encodeURIComponent;
    return map(query, (v, k) => `${encode(k)}=${encode(v)}`).join('&');
  },

};

////////////////////////////////////////////////////////////////////////////////
export const XML = {

  /**
   * @async Promise
   * @param {String} xml
   * @return {Object}
   */
  parse: (xml) => {
    return new P((resolve, reject) => {
      xml2js.parseString(xml, (err, result) => {
        err ? reject(err) : resolve(result);
      });
    });
  },
};

