import path from 'path';
import lang from './lang';
import { each } from 'lodash';
import querystring from './querystring';
import xml from './xml';
import xpath from 'xpath';
import models from './models';

const P = Promise;
const NotImplemented = class NotImplemented extends Error {}

////////////////////////////////////////////////////////////////////////////////

export const Client = class {

  /**
   * @param void
   * @return {rest.Client}
   */
  static instance () {
    if (!this.singleton) {
      this.singleton = new this();
    }
    return this.singleton;
  }

  /**
   * Return instance configuration defaults
   * @param void
   * @return {Object}
   */
  defaults () {
    let location = global.location || {
      protocol: 'https:',
      host: 'localhost',
    };

    let fetch = global.fetch || (() => {
      return P.reject(new Error('fetch is not a global symbol'));
    });

    return {
      // ISO language code
      language: 'en',

      // API proxy configuration
      proxy: {
        scheme: location.protocol.slice(0, -1),
        host: location.host,
        root: '/shop/api',
      },

      // Fetch-related options
      fetch: {
        // the fetch function
        algo: fetch,
        // Request options; see https://developer.mozilla.org/en-US/docs/Web/API/Request
        defaults: {
          cache: 'default',
          mode: 'same-origin',
        },
      },
    };
  }

  /**
   * @param {Object} options
   */
  constructor (options={}) {
    this.options = {...this.defaults(), ...options};
    this.fetch = this.options.fetch.algo;
  }

  /**
   * Send a GET request
   * @async Promise
   * @param {String} url
   * @param {Object} query
   * @return {Response}
   */
  get (uri, options={}) {
    let url = this.url(uri, options.query);

    let fetchopts = {
      ...this.options.fetch.defaults, 
      ...options.fetch,
      method: 'GET',
    };

    return this.fetch(url, fetchopts).then((response) => {
      this.validateResponse(response);
      return response;
    });
  }

  /**
   * Return a fully qualified API url
   * @param {String} uri
   * @param {String}
   */
  url (uri, query={}) {
    let proxy = this.options.proxy;
    let fullpath = path.join(proxy.root, uri);

    if (!lang.empty(query)) {
      fullpath += '?' + querystring.stringify(query);
    }

    return `${proxy.scheme}://${proxy.host}${fullpath}`;
  }

  /**
   * @param {Object} augments
   * @return {Object}
   */
  createFetchOptions (augments={}) {
    return {cache: 'default', ...augments};
  }

  /**
   * @param {Response} response
   * @return void
   * @throws Error
   */
  validateResponse (response) {
    if (!response.ok) {
      throw new Error('got non-2XX HTTP response status');
    }
  }

}

////////////////////////////////////////////////////////////////////////////////
export const resources = {};

/**
 * a REST resource
 */
resources.Resource = class {

  /**
   * Return instance configuration defaults
   * @param void
   * @return {Object}
   */
  defaults () {
    return {
      client: Client.instance(),
      root: '/',
      model: models.Model,
    };
  }

  /**
   * @param {Object} options
   */
  constructor (options={}) {
    this.options = {...this.defaults(), ...options};
    this.client = this.options.client;
  }

  /**
   * Resolve an array of Model instances
   * @async Promise
   * @param void
   * @return {Array}
   */
  list () {
    return this.client.get(this.options.root)
    .then((response) => xml.dom(response.text()))
    .then((dom) => this.createModels(dom))
  }

  /**
   * Resolve a single Model instance
   * @async Promise
   * @param {mixed} id
   * @return {Model}
   */
  get (id) {
    return this.client.get(`${this.options.root}/${id}`)
    .then((response) => xml.dom(response.text()))
    .then((xml) => this.parseModelAttributes(xml))
    .then((attrs) => this.createModel(attrs))
  }

  /**
   * Given the API response payload for a single domain object, return a plain
   * object that contains model attributes.
   * @param {xmldom.Document} dom
   * @return {Object}
   */
  parseModelAttributes (dom) {
    throw new NotImplemented();
  }

  /**
   * Given an API response payload that contains a collection of domain
   * objects, map the collection to an Array containing Model instances.
   * @async Promise
   * @param {xmldom.Document} dom
   * @return {Array}
   */
  createModels (dom) {
    throw new NotImplemented();
  }

  /**
   * Given an object containing model attributes, return a Model instance.
   * @async Promise
   * @param {Object} attrs
   * @return {Model}
   */
  createModel (attrs) {
    let constructor = this.options.model;
    return new constructor(attrs);
  }

}

resources.Languages = class extends resources.Resource {

  /**
   * @inheritdoc
   */
  defaults () {
    return {
      ...super.defaults(),
      root: '/languages',  
    };
  }

}

resources.Products = class extends resources.Resource {

  /**
   * @inheritdoc
   */
  defaults () {
    return {
      ...super.defaults(),
      root: '/products',
      model: models.Product,
    };
  }

  resources () {
    return {
      images: new rest.resources.Images({
        root: `/images/products/${this.attr('id')}`,
      }),
    };
  }

  /**
   * {@inheritdoc}
   */
  parseModelAttributes (xmlstr) {
    return xml.parse(xmlstr)
    .then((obj) => {
      obj = obj.prestashop.product[0];

      return {
        id: obj.id[0].trim(),
      }
    });
  }
}

resources.Images = class extends resources.Resource {

  /**
   * @inheritdoc
   */
  defaults () {
    return {
      ...super.defaults(),
      root: '/images',
    };
  }

}

export default { Client, resources };
