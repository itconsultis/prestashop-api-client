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
    xml2js.parseString(String(xml), (err, result) => {
      err ? reject(err) : resolve(result);
    });
  })
};

/**
 * Extract the text value from a node 
 * @param mixed input
 * @return {String}
 */
const text = (input) => {
  let raw = Array.isArray(input) ? input[0] : input;

  if (typeof raw == 'object') {
    raw = raw._ || '';
  }

  return String(raw).trim();
};

/**
 * Extract a node attribute value
 * @param {mixed} input
 * @return {String}
 */
const attr = (input, name) => {
  let raw = input;
  
  if (Array.isArray(raw)) {
    raw = raw[0];
  } 

  if (raw.$ && raw.$[name] !== undefined) {
    raw = raw.$[name];
  }

  return String(raw).trim();
};

////////////////////////////////////////////////////////////////////////////////

parse.model = {};

/**
 * Parse the supplied XML payload and return an array of model ids.
 * @async Promise
 * @param {String|Buffer} xml
 * @param {String} api
 * @param {String} nodetype
 * @return {Array} 
 */
parse.model.ids = (xml, api, nodetype) => {
  return parse(xml)

  .then((obj) => {
    let list = obj.prestashop[api][0][nodetype];
    return list.map((obj) => integer(attr(obj, 'id')));
  });
};

////////////////////////////////////////////////////////////////////////////////

parse.product = {};

/**
 * @async Promise
 * @param {String} xml
 * @return {Object}
 */
parse.product.attributes = (xml, language=1) => {
  return parse(xml)

  .then((obj) => {
    let base = obj.prestashop.product[0];
    let assocs = base.associations[0] || {};
    let lang = (obj) => attr(obj, 'id') == language;

    let names = base.name[0].language;
    let descs = base.description[0].language;
    let shortdescs = base.description_short[0].language;
    let combos = assocs.combinations[0].combination || [];
    let images = assocs.images[0].image || [];;

    return {
      'id': text(base.id),
      'name': text(names.filter(lang).pop()),
      'description': text(descs.filter(lang).pop()),
      'description_short': text(shortdescs.filter(lang).pop()),
      'price': text(base.price),
      'available_for_order': text(base.available_for_order),
      'manufacturer_name': text(base.manufacturer_name),
      'related': {
        'manufacturer': integer(text(base.id_manufacturer)),
        'combinations': combos.map(combo => integer(text(combo.id))),
        'images': images.map(image => integer(text(image.id))),
      },
    };
  });
};

////////////////////////////////////////////////////////////////////////////////

parse.combination = {};

/**
 * @async Promise
 * @param {String} xml
 * @return {Object}
 */
parse.combination.attributes = (xml) => {
  return parse(xml)

  .then((obj) => {
    let base = obj.prestashop.combination[0];
    let assocs = base.associations[0] || {};
    let povs = assocs.product_option_values || [];

    return {
      'id': text(base.id),
      'id_product': text(base.id_product),
      'location': text(base.location),
      'ean13': text(base.ean13),
      'upc': text(base.upc),
      'quantity': text(base.quantity),
      'reference': text(base.reference),
      'supplier_reference': text(base.supplier_reference),
      'wholesale_price': text(base.wholesale_price),
      'price': text(base.price),
      'ecotax': text(base.ecotax),
      'weight': text(base.weight),
      'unit_price_impact': text(base.unit_price_impact),
      'minimal_quantity': text(base.minimal_quantity),
      'default_on': text(base.default_on),
      'available_date': text(base.available_date),
      'related': {
        'product': integer(text(base.id_product)),
        'product_option_values': integer(text(povs[0].product_option_value[0].id)),
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
parse.image.attributes = (xml) => {
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

////////////////////////////////////////////////////////////////////////////////

parse.manufacturer = {};

parse.manufacturer.attributes = (xml, language=1) => {
  return parse(xml)

  .then((obj) => {
    let base = obj.prestashop.manufacturer[0];
    let lang = (obj) => attr(obj, 'id') == language;
    let descs = base.description[0].language;

    return {
      'id': text(base.id),
      'active': text(base.active),
      'name': text(base.name),
      'description': text(descs.filter(lang).pop()),
    };
  })
};

////////////////////////////////////////////////////////////////////////////////

parse.stock_available = {};

parse.stock_available.attributes = (xml, language=1) => {
  return parse(xml)

  .then((obj) => {
    let base = obj.prestashop.stock_available[0];

    return {
      'id': text(base.id),
      'id_product': text(base.id_product),
      'id_product_attribute': text(base.id_product_attribute),
      'id_shop': text(base.id_shop),
      'id_shop_group': text(base.id_shop_group),
      'quantity': text(base.quantity),
      'depends_on_stock': text(base.depends_on_stock),
      'out_of_stock': text(base.out_of_stock),
    };
  })
};

////////////////////////////////////////////////////////////////////////////////

parse.product_option_value = {};

parse.product_option_value.attributes = (xml, language=1) => {
  return parse(xml)

  .then((obj) => {
    let base = obj.prestashop.product_option_value[0];
    let names = base.name[0].language;
    let lang = (obj) => attr(obj, 'id') == language;

    return {
      'id': text(base.id),
      'id_attribute_group': text(base.id_attribute_group),
      'color': text(base.color),
      'position': text(base.position),
      'name': text(names.filter(lang).pop()),
    };
  })
};

