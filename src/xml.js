import xmldom from 'xmldom';
import xml2js from 'xml2js';
const P = Promise;

////////////////////////////////////////////////////////////////////////////////
const xml = {};

export default xml;

/**
 * @param {String} xml
 * @return {xmldom.Document}
 */
export const dom = xml.dom = (xml, doctype='text/xml') => {
  let parser = new (global.DOMParser || xmldom.DOMParser)();
  return parser.parseFromString(xml, doctype);
};

/**
 * @async Promise
 * @param {String|Buffer} xml
 * @return {Object}
 */
export const parse = xml.parse = (xml) => {
  return new P((resolve, reject) => {
    xml2js.parseString(xml, (err, result) => {
      err ? reject(err) : resolve(result);
    });
  });
};
