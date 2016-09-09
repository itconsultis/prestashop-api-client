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
 * Extract an attribute value on a node
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
parse.product.properties = (xml, language=1) => {
  return parse(xml)

  .then((obj) => {
    let base = obj.prestashop.product[0];
    let assocs = base.associations[0];
    let lang = (obj) => attr(obj, 'id') == language;

    let names = base.name[0].language;
    let descs = base.description[0].language;
    let shortdescs = base.description_short[0].language;
    let combos = assocs.combinations[0].combination;
    let images = assocs.images[0].image;

    return {
      'id': text(base.id),
      'name': text(names.filter(lang).pop()),
      'description': text(descs.filter(lang).pop()),
      'description_short': text(shortdescs.filter(lang).pop()),
      'price': text(base.price),
      'available_for_order': text(base.available_for_order),
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

////////////////////////////////////////////////////////////////////////////////

parse.manufacturer = {};

parse.manufacturer.properties = (xml, language=1) => {
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

parse.stock_available.properties = (xml, language=1) => {
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

parse.product_option_value.properties = (xml, language=1) => {
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

