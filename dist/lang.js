'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var lang = {};

exports.default = lang;

/**
 * This works like PHP's empty() function. Behaviors:
 *  - return true if value is falsy
 *  - return true if the value is the integer zero
 *  - return true if the value has a length property that is zero
 *  - return true if the value is an object that does not own any properties
 *  - return false for everything else
 * @param mixed value
 * @return {Boolean}
 */

var empty = exports.empty = lang.empty = function (value) {
  if (value === undefined) {
    return true;
  }

  if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) !== 'object' && isNaN(value)) {
    return false;
  }

  // falsy value is always empty
  if (!value) {
    return true;
  }

  // number zero is empty
  if (typeof value === 'number') {
    return value === 0;
  }

  // zero-length anything is empty
  if (typeof value.length === 'number') {
    return !value.length;
  }

  // zero-size anything is empty
  if (typeof value.size === 'number') {
    return !value.size;
  }

  // an object that does not own any properties is empty
  if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
    return Object.getOwnPropertyNames(value).length === 0;
  }

  // default to false
  return false;
};

var coerce = exports.coerce = lang.coerce = {};

coerce.integer = function (v) {
  return parseInt(v, 10);
};
coerce.string = String;
coerce.bool = function (v) {
  return !empty(coerce.integer(v));
};
coerce.number = Number;