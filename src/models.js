import path from 'path';
import lang from './lang';
import React from 'react';
import xml2js from 'xml2js';
import { LocalCache as LocalStorageCache } from 'localcache';
import { querystring, XML } from './support';
import rest from './rest';
const P = Promise;
const NotImplemented = class NotImplemented extends Error {}

////////////////////////////////////////////////////////////////////////////////

export const Model = class {

  /**
   * Return default model attributes
   * @param void
   * @return {Object}
   */
  defaults () {
    return {};
  }

  /**
   * Return a dictionary containing rest.Resource instances that "belong" to
   * the model.
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
    Object.assign(this, ...this.resources());
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
}

export const Language = class extends models.Model {
  // implement me
}

export const Product = class extends models.Model {

  /**
   * @inheritdoc
   */
  resources () {
    {
      images: rest.resources.Images({
        root: `/images/products/${this.attr('id')}`,
      }),
    },
  }

}

export const Image = class extends models.Model {

  /**
   * @inheritdoc
   */
  defaults () {
    return {
      url: '',
    };
  }
}

