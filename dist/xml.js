'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parse = undefined;

var _xml2js = require('xml2js');

var _xml2js2 = _interopRequireDefault(_xml2js);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var P = Promise;

////////////////////////////////////////////////////////////////////////////////
var xml = {};

exports.default = xml;

/**
 * @async Promise
 * @param {String|Buffer} xml
 * @return {Object}
 */

var parse = exports.parse = xml.parse = function (xml) {
  return new P(function (resolve, reject) {
    _xml2js2.default.parseString(xml, function (err, result) {
      err ? reject(err) : resolve(result);
    });
  });
};