import path from 'path';
import lang from './lang';
import { each } from 'lodash';
import querystring from './querystring';
import { NotImplemented } from './exceptions';
import { parse } from './xml';
import models from './models';
import { coerce } from './lang';
import sort from './sort';
import lru from './lru';

const { integer } = coerce;
const P = Promise;

////////////////////////////////////////////////////////////////////////////////

/**
 * HTTP client
 */
export const Client = class {

  /**
   * @param void
   * @return {rest.Client}
   */
  static instance (options={}) {
    return new this(options);
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
      language: 'en',

      // these must match your PrestaShop backend languages
      languages: {
        // ISO code => PrestaShop language id
        'en': 1,
      },

      // API proxy configuration
      proxy: {
        scheme: location.protocol.slice(0, -1),
        host: location.host,
        root: '/shop/api',
      },

      // LRU instance; see https://www.npmjs.com/package/lru-cache
      cache: lru.instance(),

      // Fetch-related options
      fetch: {
        // the actual fetch function; facilitates testing
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
    this.cache = this.options.cache;
  }

  /**
   * Return a Prestashop API language id
   * @property
   * @type {Number}
   */
  get language () {
    let opts = this.options;
    return opts.languages[opts.language];
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
    let cachekey = `${this.options.language}:${url}`;
    let response = this.cache.get(cachekey);
console.log(url);
    if (response) {
      return P.resolve(response);
    }

    let fetchopts = {
      ...this.options.fetch.defaults, 
      ...options.fetch,
      method: 'GET',
    };

    return this.fetch(url, fetchopts).then((response) => {
      this.validateResponse(response);
      this.cache.set(cachekey, response);
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
      query = lang.tuples(query).sort(sort.ascending(pair => pair[0]));
      fullpath += '?' + querystring.stringify(query);
    }

    return `${proxy.scheme}://${proxy.host}${fullpath}`;
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

  /**
   * @param {String} key
   * @param {Object} options
   * @return {rest.Resource}
   */
  resource (key, options={}) {
    let dict = {
      products: resources.Products,
      manufacturers: resources.Manufacturers,
      combinations: resources.Combinations,
      images: resources.Images,
    };

    let constructor = dict[key];

    if (!constructor) {
      throw new Error(`root resource not found: "${key}"`);
    }

    return new constructor({...options, client: this});
  }

}

////////////////////////////////////////////////////////////////////////////////
export const resources = {};

/**
 * a REST resource
 */
export const Resource = resources.Resource = class {

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

      // model list filter function
      filter: null,

      // model list sort function
      sort: null,
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
   * Return a PrestaShop language id
   * @property
   * @type {Number}
   */
  get language () {
    return this.client.language;
  }

  /**
   * Resolve an array of Model instances
   * @async Promise
   * @param void
   * @return {Array}
   */
  list () {
    return this.client.get(this.options.root)
    .then((response) => response.text())
    .then((xml) => this.parseModelIds(xml))
    .then((ids) => this.createModels(ids))
    .then((models) => {
      let {sort, filter} = this.options;

      if (filter) {
        models = models.filter(filter);
      }

      if (sort) {
        models = models.sort(sort);
      }

      return models;
    });
  }

  /**
   * Return the first member of a list() result
   * @param void
   * @return {models.Model}
   */
  first () {
    return this.list().then(models => models[0] || null);
  }

  /**
   * Resolve a single Model instance
   * @async Promise
   * @param {mixed} id
   * @return {Model}
   */
  get (id) {
    return this.client.get(`${this.options.root}/${id}`)
    .then((response) => response.text())
    .then((xml) => this.parseModelProperties(xml))
    .then((props) => this.createModel(props));
  }

  /**
   * Map a list of model ids to model instances.
   * @async Promise
   * @param {Array} ids
   * @return {Array}
   */
  createModels (ids) {
    return P.all(ids.map((id) => this.get(id)));
  }

  /**
   * Given an object containing model properties, return a Model instance.
   * @param {Object} props
   * @return {Model}
   */
  createModel (props) {
    let constructor = this.options.model;
    return new constructor({client: this, props: props});
  }

  /**
   * Given the API response payload for a list of objects, return a list of
   * model ids.
   * @async Promise
   * @param {String} xml
   * @return {Array}
   */
  parseModelIds (xml) {
    throw new NotImplemented();
  }

  /**
   * Given the API response payload for a single domain object, return a plain
   * object that contains model properties.
   * @param {String} xml
   * @return {Object}
   */
  parseModelProperties (xml) {
    throw new NotImplemented();
  }

}

resources.Products = class extends Resource {

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

  /**
   * @inheritdoc
   */
  parseModelIds (xml) {
    return parse.product.ids(xml);
  }

  /**
   * @inheritdoc
   */
  parseModelProperties (xml) {
    return parse.product.properties(xml);
  }

}

resources.Images = class extends Resource {

  /**
   * @inheritdoc
   */
  defaults () {
    return {
      ...super.defaults(),
      root: '/images',
      model: models.Image,
    };
  }

  /**
   * @inheritdoc
   */
  list () {
    return this.client.get(this.options.root)
    .then((response) => response.text())
    .then((xml) => this.parseImageProperties(xml))
    .then((propsets) => propsets.map((props) => this.createModel(props)));
  }

  /**
   * @inheritdoc
   */
  get (id) {
    throw new NotImplemented();
  }

  /**
   * Return a list of urls given an XML payload
   * @async Promise
   * @param {String} xml
   * @return {Array}
   */
  parseImageProperties (xml) {
    return parse.image.properties(xml);
  }
}


resources.Manufacturers = class extends Resource {

  /**
   * @inheritdoc
   */
  defaults () {
    return {
      ...super.defaults(),
      root: '/manufacturers',
      model: models.Manufacturer,
    };
  }
}

resources.Combinations = class extends Resource {

  /**
   * @inheritdoc
   */
  defaults () {
    return {
      ...super.defaults(),
      root: '/combinations',
      model: models.Combination,
    };
  }
}

resources.ProductOptionValues = class extends Resource {

  /**
   * @inheritdoc
   */
  defaults () {
    return {
      ...super.defaults(),
      root: '/product_option_values',
      model: models.ProductOptionValue,
      sort: sort.ascending(model => model.position),
    };
  }
}


export default { Client, resources };
