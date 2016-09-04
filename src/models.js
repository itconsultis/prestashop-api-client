import path from 'path';
import lang from './lang';
import querystring from './querystring';
import xml from './xml';
import rest from './rest';

const P = Promise;
const NotImplemented = class NotImplemented extends Error {}
const { bool, integer, number, string } = lang.coerce;

////////////////////////////////////////////////////////////////////////////////

const models = {};

export default models;

export const Model = models.Model = class {

  static mappings () {
    throw new NotImplemented();
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
    this.attrs = {...this.defaults(), ...attrs};
  }

  /** 
   * Return a single attribute value
   * @param {String} name
   * @param mixed fallback
   * @return mixed
   */
  attr (name, fallback=undefined) {
    let attrs = this.attrs;

    if (!attrs.hasOwnProperty(name)) {
      if (fallback === undefined) {
        throw new Error(`attribute "${name}" is undefined`);
      }
      return fallback;
    }

    return attrs[name];
  }

  related (resource_name) {
    return this.resources()[resource_name];
  }

}

export const Language = models.Language = class extends models.Model {
  // implement me
}

export const Product = models.Product = class extends models.Model {

  static mappings () {
    return {
      /** 
       * attribute-name: [setter] || [setter, getter]
       */
      'id': [integer],
    };
  }

  /**
   * @inheritdoc
   */
  resources () {
    return {
      images: new rest.resources.Images({
        root: `/images/products/${this.attr('id')}`,
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

