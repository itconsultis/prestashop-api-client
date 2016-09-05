import { empty } from '../../dist/lang';
import assert from 'assert';

describe('lang', () => {

  describe('.empty()', () => {

    const TestClass = function() {};
    TestClass.prototype = {constructor: TestClass, foo: 1};

    it('false is empty', () => expect(empty(false)).to.equal(true));
    it('true is not empty', () => expect(empty(true)).to.equal(false));

    it('null is empty', () => expect(empty(null)).to.equal(true));
    it('undefined is empty', () => expect(empty(undefined)).to.equal(true));

    it('zero-length string is empty', () => expect(empty('')).to.equal(true));
    it('non-zero length string is not empty', () => expect(empty(' ')).to.equal(false));

    it('zero-length array is empty', () => expect(empty([])).to.equal(true));
    it('non-zero length array is not empty', () => expect(empty([0])).to.equal(false));

    it('integer zero is empty', () => expect(empty(0)).to.equal(true));
    it('number other than integer zero is not empty', () => expect(empty(-1)).to.equal(false));
    it('NaN is not empty', () => expect(empty(NaN)).to.equal(false));

    it('Map with no keys is empty', () => expect(empty(new Map())).to.equal(true));
    it('Set with no values is empty', () => expect(empty(new Set())).to.equal(true));

    it('object that owns no properties is empty', () => {
      assert(Object.getOwnPropertyNames({}).length === 0);
      expect(empty({})).to.equal(true);
    });

    it('object that owns at least one property is not empty', () => {
      let TestClass = function() {};

      TestClass.prototype = {constructor: TestClass};

      let obj = new TestClass();
      obj.bar = 2;
      expect(empty(obj)).to.equal(false);
    });

    it('Map with at least one key is not empty', () => {
      let map = new Map([['foo', 1]]);
      expect(empty(map)).to.equal(false);
    });

    it('Set with at least one value is not empty', () => {
      let set = new Set(['foo']);
      expect(empty(set)).to.equal(false);
    });
  });

});
