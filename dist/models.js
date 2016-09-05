'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Image = exports.Product = exports.Language = exports.Model = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _lang = require('./lang');

var _lang2 = _interopRequireDefault(_lang);

var _querystring = require('./querystring');

var _querystring2 = _interopRequireDefault(_querystring);

var _rest = require('./rest');

var _rest2 = _interopRequireDefault(_rest);

var _lodash = require('lodash');

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
var _lang$coerce = _lang2.default.coerce;
var bool = _lang$coerce.bool;
var integer = _lang$coerce.integer;
var number = _lang$coerce.number;
var string = _lang$coerce.string;

////////////////////////////////////////////////////////////////////////////////

var models = {};

exports.default = models;
var Model = exports.Model = models.Model = function () {
  _createClass(_class, [{
    key: 'defaults',


    /**
     * Return default model attributes
     * @param void
     * @return {Object}
     */
    value: function defaults() {
      return {};
    }

    /**
     * Return a dictionary of related rest.Resource instances
     * @param void
     * @return {Object}
     */

  }, {
    key: 'resources',
    value: function resources() {
      return {};
    }

    /**
     * @param {Object} attrs - initial model attributes
     */

  }], [{
    key: 'mutators',


    /**
     * Define attribute mutators
     * @param void
     * @return {Object}
     */
    value: function mutators() {
      return {
        // attribute: [set-mutator, get-mutator],
        // 'active': [integer, bool],
        id: [integer]
      };
    }
  }]);

  function _class() {
    var attrs = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    _classCallCheck(this, _class);

    this.attrs = {};
    this.set(_extends({}, this.defaults(), attrs));
  }

  /** 
   * Return a single attribute value
   * @param {String} attr
   * @param mixed fallback
   * @return mixed
   */


  _createClass(_class, [{
    key: 'get',
    value: function get(attr) {
      var fallback = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

      var attrs = this.attrs;

      if (!attrs.hasOwnProperty(attr)) {
        if (fallback === undefined) {
          throw new Error('attribute "' + attr + '" is undefined');
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

  }, {
    key: 'set',
    value: function set() {
      var _this2 = this;

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var arity = args.length;

      if (arity === 0) {
        throw new Error('expected at least one argument');
      }
      if (arity > 2) {
        throw new Error('expected no more than two arguments');
      }

      var mutators = this.constructor.mutators();

      var assign = function assign(value, attr) {
        var _ref = mutators[attr] || [function (v) {
          return v;
        }];

        var _ref2 = _slicedToArray(_ref, 1);

        var set = _ref2[0];

        _this2.attrs[attr] = set(value);
      };

      if (arity === 1) {
        var attrs = args[0];

        (0, _lodash.each)(attrs, assign);
        return;
      }

      var attr = args[0];
      var value = args[1];

      assign(value, attr);
    }

    /**
     * Return a related resource
     * @see #resources()
     * @param {String} key
     * @return {rest.resources.Resource}
     */

  }, {
    key: 'related',
    value: function related(key) {
      var resources = this.resources();
      var resource = resources[key];

      if (!resource) {
        throw new Error('related resource not found on key ' + key);
      }

      return resource;
    }
  }]);

  return _class;
}();

var Language = exports.Language = models.Language = function (_models$Model) {
  _inherits(_class2, _models$Model);

  function _class2() {
    _classCallCheck(this, _class2);

    return _possibleConstructorReturn(this, (_class2.__proto__ || Object.getPrototypeOf(_class2)).apply(this, arguments));
  }

  return _class2;
}(models.Model);

var Product = exports.Product = models.Product = function (_models$Model2) {
  _inherits(_class3, _models$Model2);

  function _class3() {
    _classCallCheck(this, _class3);

    return _possibleConstructorReturn(this, (_class3.__proto__ || Object.getPrototypeOf(_class3)).apply(this, arguments));
  }

  _createClass(_class3, [{
    key: 'resources',


    /**
     * @inheritdoc
     */
    value: function resources() {
      return {
        images: new _rest2.default.resources.Images({
          root: '/images/products/' + this.get('id')
        })
      };
    }
  }]);

  return _class3;
}(models.Model);

var Image = exports.Image = models.Image = function (_models$Model3) {
  _inherits(_class4, _models$Model3);

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
      return {
        url: ''
      };
    }
  }]);

  return _class4;
}(models.Model);