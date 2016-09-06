import xml2js from 'xml2js';
import { coerce } from './lang';
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
  return parse(xml)

  .then((obj) => {
    let base = obj.prestashop.product[0];
    let assocs = base.associations[0];
    let lang = (attr) => attr.$.id == language;

    let names = base.name[0].language;
    let descs = base.description[0].language;
    let shortdescs = base.description_short[0].language;
    let combos = assocs.combinations[0].combination;
    let images = assocs.images[0].image;

    return {
      'id': base.id[0].trim(),
      'name': (names.filter(lang).pop()._||'').trim(),
      'description': (descs.filter(lang).pop()._||'').trim(),
      'description_short': (shortdescs.filter(lang).pop()._||'').trim(),
      'related': {
        'manufacturer': integer((base.id_manufacturer[0]||'').trim()),
        'combinations': combos.map(combo => integer(combo.id[0].trim())),
        'images': images.map(image => integer((image.id[0]||'').trim())),
      },
    };
  });
};


parse.product.ids = (xml, language=1) => {
  return parse(xml)

  .then((obj) => {
    let list = obj.prestashop.products[0].product;
    return list.map((obj) => integer(obj.$.id));
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
        'id': dec.$.id,
        'src': dec.$['xlink:href'],
      };
    });
  })
};
