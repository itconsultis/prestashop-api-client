import path from 'path';
import lang from './lang';
import querystring from './querystring';
import { resources } from './rest';
import { each, merge } from 'lodash';
import { NotImplemented } from './exceptions';
import sort from './sort';

const P = Promise;
const { bool, integer, number, string } = lang.coerce;

////////////////////////////////////////////////////////////////////////////////

const models = {};

export default models;

export const Model = models.Model = class {

  /**
   * Return default model attributes
   * @param void
   * @return {Object}
   */
  defaults () {
    return {
      // the resource that created the model
      resource: null,

      // rest.Client instance
      client: null,

      // model attributes
      attrs: {
        related: {},   
      },
    };
  }

  /**
   * Define attribute mutators
   * @param void
   * @return {Object}
   */
  mutators () {
    return {
      // attribute: [set-mutator, get-mutator],
      id: [integer],
      quantity: [integer],
      position: [integer],
    };
  }

  /**
   * @param {Object} attrs - initial model attributes
   */
  constructor (options={}) {
    this.options = merge(this.defaults(), options);
    this.attrs = {};
    this.set(this.options.attrs);
    delete this.options.attrs;
  }

  /**
   * Assign a single attribute or mass-assign multiple attribute. Map
   * attribute values through the dictionary returned by mutators().
   * @param ...mixed args
   * @return void
   */
  set (...args) {
    let arity = args.length;
    let mutators = this.mutators();
    let defaults = [v=>v];

    let assign = (value, attr) => {
      let [set] = mutators[attr] || defaults;
      this.attrs[attr] = set(value);
    };

    if (arity < 1) {
      throw new Error('expected at least one argument');
    }
    if (arity > 2) {
      throw new Error('expected no more than two arguments');
    }

    if (arity === 1) {
      each(args[0], assign);
      return;
    }

    let [attr, value] = args;
    assign(value, attr);
  }

  /**
   * @param void
   * @return {Object}
   */
  attributes () {
    return {...this.attrs};
  }

  /**
   * @param void
   * @return {Object}
   */
  toJSON () {
    return this.attributes();  
  }

}

export const Language = models.Language = class extends Model {
  // implement me
}

export const Product = models.Product = class extends Model {

  /**
   * @inheritdoc
   */
  mutators () {
    return {
      ...super.mutators(),
      price: [number],
      available_for_order: [integer, bool],
    };
  }

  /**
   * Return a rest.Resource that provides access to the related Manufacturer
   * @param void
   * @return {rest.resources.Combinations}
   */
  manufacturer () {
    let related = this.attrs.related;

    return new resources.Manufacturers({
      client: this.options.client,
      filter: (manufacturer) => related.manufacturer == manufacturer.attrs.id,
    });
  }

  /**
   * Return a rest.Resource that provides access to related Images
   * @param void
   * @return {rest.resources.Images}
   */
  images () {
    return new resources.Images({
      client: this.options.client,
      root: `/images/products/${this.attrs.id}`,
    });
  }

  /**
   * Return a rest.Resource that provides access to related Combinations
   * @param void
   * @return {rest.resources.Combinations}
   */
  combinations () {
    let related = this.attrs.related;

    return new resources.Combinations({
      client: this.options.client,
      filter: (combo) => related.combinations.indexOf(combo.attrs.id) > -1,
    });
  }
}

export const Image = models.Image = class extends Model {
  // implement me
}

export const Combination = models.Combination = class extends Model {

  /**
   * Define property mutators
   * @param void
   * @return {Object}
   */
  mutators () {
    return {
      // property: [set-mutator, get-mutator],
      ...super.mutators(),
      id_product: [integer],
      quantity: [integer],
      price: [number],
      ecotax: [number],
      weight: [number],
      unit_price_impact: [number],
      minimal_quantity: [number],
    };
  }

  /**
   * Return a rest.Resource that provides access to the parent Product
   * models.
   * @param void
   * @return {rest.resources.Products}
   */
  product () {
    return new resources.Product({
      client: this.options.client,
      filter: (product) => this.attrs.related.product == product.attrs.id,
    });
  }

  /**
   * Return a rest.Resource that provides access to related ProductOptionValue
   * models.
   * @param void
   * @return {rest.resources.ProductOptionvalues}
   */
  product_option_values () {
    return new resources.ProductOptionValues({
      client: this.options.client,
      filter: (pov) => {
        return this.attrs.related.product_option_values == pov.attrs.id;
      },
    });
  }

  /**
   * Return a rest.Resource that provides access to related StockAvailable
   * models.
   * @param void
   * @return {rest.resources.ProductOptionvalues}
   */
  stock_availables () {
    return new resources.StockAvailables({
      client: this.options.client,
      filter: (stock) => {
        return this.attrs.id == stock.attrs.id_product_attribute;
      },
    });
  }
}

export const StockAvailable = models.StockAvailable = class extends Model {

  /**
   * @inheritdoc
   */
  mutators () {
    return {
      ...super.mutators(),
      id_product: [integer],
      id_product_attribute: [integer],
      id_shop: [integer],
      id_shop_group: [integer],
      quantity: [integer],
      depends_on_stock: [integer],
      out_of_stock: [integer],
    };
  }
}

export const Manufacturer = models.Manufacturer = class extends Model {
  // implement me
}

export const ProductOptionValue = models.ProductOptionValue = class extends Model {
  // implement me  
}

