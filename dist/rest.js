'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Resource = exports.resources = exports.Client = undefined;

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lang = require('./lang');

var _lang2 = _interopRequireDefault(_lang);

var _lodash = require('lodash');

var _querystring = require('./querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _xml = require('./xml');

var _xml2 = _interopRequireDefault(_xml);

var _models = require('./models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var P = Promise;
var NotImplemented = function (_Error) {
  _inherits(NotImplemented, _Error);

  function NotImplemented() {
    _classCallCheck(this, NotImplemented);

    return _possibleConstructorReturn(this, (NotImplemented.__proto__ || Object.getPrototypeOf(NotImplemented)).apply(this, arguments));
  }

  return NotImplemented;
}(Error);

////////////////////////////////////////////////////////////////////////////////

/**
 * HTTP client
 */
var Client = exports.Client = function () {
  _createClass(Client, [{
    key: 'defaults',


    /**
     * Return instance configuration defaults
     * @param void
     * @return {Object}
     */
    value: function defaults() {
      var location = global.location || {
        protocol: 'https:',
        host: 'localhost'
      };

      var fetch = global.fetch || function () {
        return P.reject(new Error('fetch is not a global symbol'));
      };

      return {
        // ISO language code
        language: 'en',

        // API proxy configuration
        proxy: {
          scheme: location.protocol.slice(0, -1),
          host: location.host,
          root: '/shop/api'
        },

        // Fetch-related options
        fetch: {
          // the fetch function
          algo: fetch,
          // Request options; see https://developer.mozilla.org/en-US/docs/Web/API/Request
          defaults: {
            cache: 'default',
            mode: 'same-origin'
          }
        }
      };
    }

    /**
     * @param {Object} options
     */

  }], [{
    key: 'instance',


    /**
     * @param void
     * @return {rest.Client}
     */
    value: function instance() {
      if (!this.singleton) {
        this.singleton = new this();
      }
      return this.singleton;
    }
  }]);

  function Client() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, Client);

    this.options = _extends({}, this.defaults(), options);
    this.fetch = this.options.fetch.algo;
  }

  /**
   * Send a GET request
   * @async Promise
   * @param {String} url
   * @param {Object} query
   * @return {Response}
   */


  _createClass(Client, [{
    key: 'get',
    value: function get(uri) {
      var _this2 = this;

      var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var url = this.url(uri, options.query);

      var fetchopts = _extends({}, this.options.fetch.defaults, options.fetch, {
        method: 'GET'
      });

      return this.fetch(url, fetchopts).then(function (response) {
        _this2.validateResponse(response);
        return response;
      });
    }

    /**
     * Return a fully qualified API url
     * @param {String} uri
     * @param {String}
     */

  }, {
    key: 'url',
    value: function url(uri) {
      var query = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var proxy = this.options.proxy;
      var fullpath = _path2.default.join(proxy.root, uri);

      if (!_lang2.default.empty(query)) {
        fullpath += '?' + _querystring2.default.stringify(query);
      }

      return proxy.scheme + '://' + proxy.host + fullpath;
    }

    /**
     * @param {Object} augments
     * @return {Object}
     */

  }, {
    key: 'createFetchOptions',
    value: function createFetchOptions() {
      var augments = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      return _extends({ cache: 'default' }, augments);
    }

    /**
     * @param {Response} response
     * @return void
     * @throws Error
     */

  }, {
    key: 'validateResponse',
    value: function validateResponse(response) {
      if (!response.ok) {
        throw new Error('got non-2XX HTTP response status');
      }
    }
  }]);

  return Client;
}();

////////////////////////////////////////////////////////////////////////////////
var resources = exports.resources = {};

/**
 * a REST resource
 */
var Resource = exports.Resource = resources.Resource = function () {
  _createClass(_class, [{
    key: 'defaults',


    /**
     * Return instance configuration defaults
     * @param void
     * @return {Object}
     */
    value: function defaults() {
      return {
        client: Client.instance(),
        root: '/',
        model: _models2.default.Model
      };
    }

    /**
     * @param {Object} options
     */

  }]);

  function _class() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, _class);

    this.options = _extends({}, this.defaults(), options);
    this.client = this.options.client;
  }

  /**
   * Resolve an array of Model instances
   * @async Promise
   * @param void
   * @return {Array}
   */


  _createClass(_class, [{
    key: 'list',
    value: function list() {
      var _this3 = this;

      return this.client.get(this.options.root).then(function (response) {
        return response.text();
      }).then(function (xml) {
        return _this3.parseModelIds(xml);
      }).then(function (ids) {
        return _this3.createModels(ids);
      });
    }

    /**
     * Resolve a single Model instance
     * @async Promise
     * @param {mixed} id
     * @return {Model}
     */

  }, {
    key: 'get',
    value: function get(id) {
      var _this4 = this;

      return this.client.get(this.options.root + '/' + id).then(function (response) {
        return response.text();
      }).then(function (xml) {
        return _this4.parseModelAttributes(xml);
      }).then(function (attrs) {
        return _this4.createModel(attrs);
      });
    }

    /**
     * Map a list of model ids to model instances.
     * @async Promise
     * @param {Array} ids
     * @return {Array}
     */

  }, {
    key: 'createModels',
    value: function createModels(ids) {
      var _this5 = this;

      return P.all(ids.map(function (id) {
        return _this5.get(id);
      }));
    }

    /**
     * Given an object containing model attributes, return a Model instance.
     * @param {Object} attrs
     * @return {Model}
     */

  }, {
    key: 'createModel',
    value: function createModel(attrs) {
      var constructor = this.options.model;
      return new constructor(attrs);
    }

    /**
     * Given the API response payload for a list of objects, return a list of
     * model ids.
     * @async Promise
     * @param {String} xml
     * @return {Array}
     */

  }, {
    key: 'parseModelIds',
    value: function parseModelIds(xml) {
      throw new NotImplemented();
    }

    /**
     * Given the API response payload for a single domain object, return a plain
     * object that contains model attributes.
     * @param {String} xml
     * @return {Object}
     */

  }, {
    key: 'parseModelAttributes',
    value: function parseModelAttributes(xml) {
      return _xml2.default.parse(xml).then(function (obj) {
        obj = obj.prestashop.product[0];

        return {
          id: obj.id[0].trim()
        };
      });
    }
  }]);

  return _class;
}();

resources.Languages = function (_Resource) {
  _inherits(_class2, _Resource);

  function _class2() {
    _classCallCheck(this, _class2);

    return _possibleConstructorReturn(this, (_class2.__proto__ || Object.getPrototypeOf(_class2)).apply(this, arguments));
  }

  _createClass(_class2, [{
    key: 'defaults',


    /**
     * @inheritdoc
     */
    value: function defaults() {
      return _extends({}, _get(_class2.prototype.__proto__ || Object.getPrototypeOf(_class2.prototype), 'defaults', this).call(this), {
        root: '/languages'
      });
    }
  }]);

  return _class2;
}(Resource);

resources.Products = function (_Resource2) {
  _inherits(_class3, _Resource2);

  function _class3() {
    _classCallCheck(this, _class3);

    return _possibleConstructorReturn(this, (_class3.__proto__ || Object.getPrototypeOf(_class3)).apply(this, arguments));
  }

  _createClass(_class3, [{
    key: 'defaults',


    /**
     * @inheritdoc
     */
    value: function defaults() {
      return _extends({}, _get(_class3.prototype.__proto__ || Object.getPrototypeOf(_class3.prototype), 'defaults', this).call(this), {
        root: '/products',
        model: _models2.default.Product
      });
    }

    /**
     * @inheritdoc
     */

  }, {
    key: 'parseModelIds',
    value: function parseModelIds(xml) {
      return _xml2.default.parse(xml).then(function (obj) {
        var list = obj.prestashop.products[0].product;
        return list.map(function (obj) {
          return obj.$.id;
        });
      });
    }
  }]);

  return _class3;
}(Resource);

resources.Images = function (_Resource3) {
  _inherits(_class4, _Resource3);

  function _class4() {
    _classCallCheck(this, _class4);

    return _possibleConstructorReturn(this, (_class4.__proto__ || Object.getPrototypeOf(_class4)).apply(this, arguments));
  }

  _createClass(_class4, [{
    key: 'defaults',


    /**
     * @inheritdoc
     */
    value: function defaults() {
      return _extends({}, _get(_class4.prototype.__proto__ || Object.getPrototypeOf(_class4.prototype), 'defaults', this).call(this), {
        root: '/images',
        model: _models2.default.Image
      });
    }
  }]);

  return _class4;
}(Resource);

exports.default = { Client: Client, resources: resources };