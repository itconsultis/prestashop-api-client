import path from 'path';
import lang from './lang';
import querystring from './querystring';
import { resources } from './rest';
import { each } from 'lodash';
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

      // model properties
      props: {},
    };
  }

  /**
   * Define property mutators
   * @param void
   * @return {Object}
   */
  mutators () {
    return {
      // property: [set-mutator, get-mutator],
      id: [integer],
      quantity: [integer],
      position: [integer],
    };
  }

  /**
   * @param {Object} attrs - initial model attributes
   */
  constructor (options={}) {
    this.options = {
      ...this.defaults(),
      ...options,
    };

    let props = options.props || {};
    this.set({...this.options.props, ...props});
  }

  /**
   * Assign a single property or mass-assign multiple properties. Map
   * property values through the dictionary returned by mutators().
   * @param ...mixed args
   * @return void
   */
  set (...args) {
    let arity = args.length;
    let mutators = this.mutators();
    let defaults = [v=>v];

    let assign = (value, prop) => {
      let [set] = mutators[prop] || defaults;
      this[prop] = set(value);
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

    let [prop, value] = args;
    assign(value, prop);
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
    return new resources.Manufacturers({
      client: this.options.client,
      filter: (manufacturer) => {
        return this.related.manufacturer == manufacturer.id;
      },
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
      root: `/images/products/${this.id}`,
    });
  }

  /**
   * Return a rest.Resource that provides access to related Combinations
   * @param void
   * @return {rest.resources.Combinations}
   */
  combinations () {
    return new resources.Combinations({
      client: this.options.client,
      filter: (combo) => {
        return this.related.combinations.indexOf(combo.id) > -1;
      },
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
   * @param void
   * @return {rest.resources.Products}
   */
  product () {
    return new resources.Product({
      client: this.options.client,
      filter: (product) => this.related.product == product.id,
    });
  }

  /**
   * Return a rest.Resource that provides access to related ProductOptionValues
   * @param void
   * @return {rest.resources.ProductOptionvalues}
   */
  product_option_values () {
    return new resources.ProductOptionValues({
      client: this.options.client,
      filter: (pov) => {
        return this.related.product_option_values.indexOf(pov.id) > -1;
      },
    });
  }

  stock_availables () {
    return new resources.StockAvailables({
      client: this.options.client,
      filter: (stock) => {
        return stock.id_product_attribute == this.id;
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

