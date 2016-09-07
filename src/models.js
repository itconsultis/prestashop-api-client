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
      client: null,
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
      id: [integer]
    };
  }

  /**
   * @param {Object} attrs - initial model attributes
   */
  constructor (options={}) {
    let defaults = this.defaults();
    let props = options.props || {};

    this._client = options.client || defaults.client;

    this.set({...defaults.props, ...props});
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
    let raw = v => v;

    let assign = (value, prop) => {
      let [set] = mutators[prop] || [raw];
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
   * Return a rest.Resource that provides access to the related Manufacturer
   * @param void
   * @return {rest.resources.Combinations}
   */
  manufacturer () {
    return new resources.Manufacturers({
      client: this._client,
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
      client: this._client,
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
      client: this._client,
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
   * Return a rest.Resource that provides access to the parent Product
   * @param void
   * @return {rest.resources.Products}
   */
  product () {
    return new resources.Product({
      client: this._client,
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
      client: this._client,
      filter: (pov) => {
        return this.related.product_option_values.indexOf(pov.id) > -1;
      }
    });
  }
}

export const Manufacturer = models.Manufacturer = class extends Model {
  // implement me
}

export const ProductOptionValue = models.ProductOptionValue = class extends Model {
  // implement me  
}
