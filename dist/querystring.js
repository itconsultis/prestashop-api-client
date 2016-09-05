'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringify = undefined;

var _lodash = require('lodash');

////////////////////////////////////////////////////////////////////////////////
var querystring = {};

exports.default = querystring;

/**
 * Stringify a query per RFC 3986
 * @param {Object} query
 * @return {String}
 */

var stringify = exports.stringify = querystring.stringify = function (query) {
  var encode = encodeURIComponent;
  return (0, _lodash.map)(query, function (v, k) {
    return encode(k) + '=' + encode(v);
  }).join('&');
};