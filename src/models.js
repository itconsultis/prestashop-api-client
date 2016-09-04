import path from 'path';
import lang from './lang';
import querystring from './querystring';
import rest from './rest';
import each from 'lodash/each';

const P = Promise;
const NotImplemented = class NotImplemented extends Error {}
const { bool, integer, number, string } = lang.coerce;

////////////////////////////////////////////////////////////////////////////////

const models = {};

export default models;

export const Model = models.Model = class {

  /**
   * Define attribute mutators
   * @param void
   * @return {Object}
   */
  static mutators () {
    return {
      // attribute: [set-mutator, get-mutator],
      // 'active': [integer, bool],
      id: [integer],
    };
  }

  /**
   * Return default model attributes
   * @param void
   * @return {Object}
   */
  defaults () {
    return {};
  }

  /**
   * Return a dictionary of related rest.Resource instances
   * @param void
   * @return {Object}
   */
  resources () {
    return {};
  }

  /**
   * @param {Object} attrs - initial model attributes
   */
  constructor (attrs={}) {
    this.attrs = {};
    this.set({...this.defaults(), ...attrs});
  }

  /** 
   * Return a single attribute value
   * @param {String} attr
   * @param mixed fallback
   * @return mixed
   */
  get (attr, fallback=undefined) {
    let attrs = this.attrs;

    if (!attrs.hasOwnProperty(attr)) {
      if (fallback === undefined) {
        throw new Error(`attribute "${attr}" is undefined`);
      }
      return fallback;
    }

    return attrs[attr];
  }

  /**
   * Set a single attribute, or mass-assign multiple attributes
   * @param {...*} args
   * @return void
   */
  set (...args) {
    let arity = args.length;

    if (arity === 0) {
      throw new Error('expected at least one argument');
    }
    if (arity > 2) {
      throw new Error('expected no more than two arguments');
    }

    let mutators = this.constructor.mutators();

    let assign = (value, attr) => {
      let [set] = mutators[attr] || [v=>v];
      this.attrs[attr] = set(value);
    };

    if (arity === 1) {
      let [attrs] = args;
      each(attrs, assign);
      return;
    }

    let [attr, value] = args;
    assign(value, attr);
  }

  /**
   * Return a related resource
   * @see #resources()
   * @param {String} key
   * @return {rest.resources.Resource}
   */
  related (key) {
    let resources = this.resources();
    let resource = resources[key];

    if (!resource) {
      throw new Error('related resource not found on key '+key);
    }

    return resource;
  }

}

export const Language = models.Language = class extends models.Model {
  // implement me
}

export const Product = models.Product = class extends models.Model {

  /**
   * @inheritdoc
   */
  resources () {
    return {
      images: new rest.resources.Images({
        root: `/images/products/${this.get('id')}`,
      }),
    };
  }

}

export const Image = models.Image = class extends models.Model {

  /**
   * @inheritdoc
   */
  defaults () {
    return {
      url: '',
    };
  }

}

