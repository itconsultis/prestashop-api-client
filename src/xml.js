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
    return list.map((obj) => integer(obj.$.id));
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
      'price': base.price[0].trim(),
      'available_for_order': base.available_for_order[0].trim(),
      'related': {
        'manufacturer': integer((base.id_manufacturer[0]||'').trim()),
        'combinations': combos.map(combo => integer(combo.id[0].trim())),
        'images': images.map(image => integer((image.id[0]||'').trim())),
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
    let lang = (attr) => attr.$.id == language;
    let descs = base.description[0].language;

    return {
      'id': base.id[0].trim(),
      'active': base.active[0].trim(),
      'name': base.name[0].trim(),
      'description': (descs.filter(lang).pop()._||'').trim(),
    };
  })
};


parse.stock_available = {};

parse.stock_available.ids = (xml, api, nodetype) => {
  return parse(xml)

  .then((obj) => {
    let list = obj.prestashop.stock_availables[0].stock_available;
    return list.map((obj) => integer(obj.$.id));
  })
};

parse.stock_available.properties = (xml, language=1) => {
  return parse(xml)

  .then((obj) => {
    let base = obj.prestashop.stock_available[0];
    let {id_product_attribute} = base;

    if (typeof id_product_attribute[0] === 'string') {
      id_product_attribute = id_product_attribute[0].trim();
    }
    else {
      id_product_attribute = id_product_attribute[0]._.trim();
    }

    return {
      'id': base.id[0].trim(),
      'id_product': base.id_product[0]._.trim(),
      'id_product_attribute': id_product_attribute,
      'id_shop': base.id_shop[0]._.trim(),
      'id_shop_group': base.id_shop_group[0].trim(),
      'quantity': base.quantity[0].trim(),
      'depends_on_stock': base.depends_on_stock[0].trim(),
      'out_of_stock': base.out_of_stock[0].trim(),
    };
  })
};

parse.product_option_value = {};

parse.product_option_value.properties = (xml, language=1) => {
  return parse(xml)

  .then((obj) => {
    let base = obj.prestashop.product_option_value[0];
    let names = base.name[0].language;
    let lang = (attr) => attr.$.id == language;

    return {
      'id': base.id[0].trim(),
      'id_attribute_group': base.id_attribute_group[0]._.trim(),
      'color': base.color[0].trim(),
      'position': base.position[0].trim(),
      'name': (names.filter(lang).pop()._||'').trim(),
    };
  })
};

