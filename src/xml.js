import xml2js from 'xml2js';
import coerce from './lang';
const { bool, number, integer, string } = coerce;
const P = Promise;

////////////////////////////////////////////////////////////////////////////////
const xml = {};

export default xml;

/**
 * Return a plain object representation of the supplied XML payload
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

////////////////////////////////////////////////////////////////////////////////

parse.product = {};

parse.product.properties = (xml, language=1) => {
  return parse(xml).then((obj) => {
    let base = obj.prestashop.product[0];
    let combos = base.associations[0].combinations[0].combination;

    return {
      'id': base.id[0].trim(),
      'id_manufacturer': base.id_manufacturer[0].trim(),
      'id_default_image': base.id_default_image[0]._.trim(),
      'related': {
        manufacturer: base.id_manufacturer[0].trim(),
        combinations: combos.map(combo => combo.id[0].trim()),
      },
    };
  });
};

parse.product.ids = (xml, language=1) => {
  return parse(xml)

  .then((obj) => {
    let list = obj.prestashop.products[0].product;
    return list.map((obj) => obj.$.id);
  });
};

////////////////////////////////////////////////////////////////////////////////

parse.image = {};

parse.image.properties = (xml) => {
  return parse(xml)

  .then((obj) => {
    let decs = obj.prestashop.image[0].declination;

    return decs.map((dec) => {
      return {
        id: dec.$.id,
        src: dec.$['xlink:href'],
      };
    });
  })
};
