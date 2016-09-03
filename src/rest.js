import _ from 'lodash';
import path from 'path';
import lang from './lang';
import xml2js from 'xml2js';
import { LocalCache as LocalStorageCache } from 'localcache';
import { querystring, XML } from './support';

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
    return {
      // prestashop language id
      language: 'en',

      // API proxy configuration
      proxy: {
        scheme: window.location.protocol.slice(0, -1),
        host: window.location.host,
        path: '/shop/api',
      },

      // Fetch-related options
      fetch: {
        // the fetch function; mainly to make unit testing easier
        algo: fetch,
        // Request options
        defaults: {
          // https://developer.mozilla.org/en-US/docs/Web/API/Request/cache
          cache: 'default',
          // https://developer.mozilla.org/en-US/docs/Web/API/Request/mode
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
    let fullpath = path.join(proxy.path, uri);

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
      client: rest.Client.instance(),
      root: '/',
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
    .then((response) => XML.parse(response.text()))
    .then((objects) => this.createModels(payload))
  }

  /**
   * Resolve a single Model instance
   * @async Promise
   * @param {mixed} id
   * @return {Model}
   */
  get (id) {
    return this.client.get(`${this.options.root}/${id}`)
    .then((object) => this.createModel(object));
  }

  /**
   * Given an API response payload that contains a collection of domain
   * objects, map the collection to an Array containing Model instances.
   * @async Promise
   * @param {Array} objects
   * @return {Array}
   */
  createModels (payload) {
    throw new NotImplemented();
  }

  /**
   * Given an API response payload that contains a single domain object,
   * return a Model instance.
   * @async Promise
   * @param {Object} payload
   * @return {Model}
   */
  createModel (payload) {
    throw new NotImplemented();
  }

}

resources.Languages = class extends resources.Resource {

  /**
   * @inheritdoc
   */
  defaults () {
    return {
      ...super.defaults(),
      path: '/languages',  
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
      path: '/products',
    };
  }

  /**
   * {@inheritdoc}
   */
  createModels (payload) {

  }

  /**
   * {@inheritdoc}
   */
  createModel (payload) {

  }

}

resources.Images = class extends resources.Resource {

  /**
   * @inheritdoc
   */
  defaults () {
    return {
      ...super.defaults(),
      path: '/images',
    };
  }

  /**
   * {@inheritdoc}
   */
  createModels (payload) {

  }

  /**
   * {@inheritdoc}
   */
  createModel (payload) {

  }

}
