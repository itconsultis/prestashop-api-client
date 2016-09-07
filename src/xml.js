import xml2js from 'xml2js';
import { coerce } from './lang';
import clean from 'strip-bom';
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
    xml2js.parseString(clean(String(xml)), (err, result) => {
      err ? reject(err) : resolve(result);
    });
  })

  .catch((e) => {
    console.log(String(xml));
    throw e;
  })
};

////////////////////////////////////////////////////////////////////////////////

parse.product = {};

/**
 * @async Promise
 * @param {String} xml
 * @return {Object}
 */
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

/**
 * @async Promise
 * @param {String} xml
 * @return {Array}
 */
parse.product.ids = (xml, language=1) => {
  return parse(xml)

  .then((obj) => {
    let list = obj.prestashop.products[0].product;
    return list.map((obj) => integer(obj.$.id));
  });
};

////////////////////////////////////////////////////////////////////////////////

parse.combination = {};

/**
 * @async Promise
 * @param {String} xml
 * @return {Object}
 */
parse.combination.properties = (xml) => {
  return parse(xml)

  .then((obj) => {
    let base = obj.prestashop.combination[0];
    let assocs = base.associations[0];
    let povs = assocs.product_option_values;

    return {
      'id': base.id[0].trim(),
      'id_product': base.id_product[0]._.trim(),
      'location': base.location[0].trim(),
      'ean13': base.ean13[0].trim(),
      'upc': base.upc[0].trim(),
      'quantity': base.quantity[0].trim(),
      'reference': base.reference[0].trim(),
      'supplier_reference': base.supplier_reference[0].trim(),
      'wholesale_price': base.wholesale_price[0].trim(),
      'price': base.price[0].trim(),
      'ecotax': base.ecotax[0].trim(),
      'weight': base.weight[0].trim(),
      'unit_price_impact': base.unit_price_impact[0].trim(),
      'minimal_quantity': base.minimal_quantity[0].trim(),
      'default_on': base.default_on[0].trim(),
      'available_date': base.available_date[0].trim(),
      'related': {
        'product': integer(base.id_product[0]._.trim()),
        'product_option_values': povs.map((pov) => {
          return integer(pov.product_option_value[0].id[0].trim());
        }),
      },
    };
  })
}

////////////////////////////////////////////////////////////////////////////////

parse.image = {};

/**
 * @async Promise
 * @param {String} xml
 * @return {Object}
 */
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

