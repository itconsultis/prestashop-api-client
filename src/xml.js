import xml2js from 'xml2js';
const P = Promise;

////////////////////////////////////////////////////////////////////////////////
const xml = {};

export default xml;

  /**
   * @async Promise
   * @param {String} xml
   * @return {Object}
   */
export const parse = xml.parse = (xml) => {
  return new P((resolve, reject) => {
    xml2js.parseString(xml, (err, result) => {
      err ? reject(err) : resolve(result);
    });
  });
};

