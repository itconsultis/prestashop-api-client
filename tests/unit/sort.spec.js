import sort from '../../dist/sort';
const noop = () => {};

describe('sort', () => {

  describe('.ascending()', () => {
    it('accepts a value resolver function', () => {
      let invokation = () => sort.ascending(noop);
      expect(sort.ascending(() => {})).not.to.throw();
    })

    it('returns a sort comparator', () => {
      expect(sort.ascending(noop)).to.be.a('function');
    });

    it('comparator sorts in ascending order', () => {
      let values = [{prop: 3}, {prop: 1}, {prop: 2}];
      let evaluate = value => value.prop;
      let comparator = sort.ascending(evaluate);
      let sorted = values.sort(comparator);

      expect(sorted[0].prop).to.equal(1);
      expect(sorted[1].prop).to.equal(2);
      expect(sorted[2].prop).to.equal(3);
    });
  });

  describe('.descending()', () => {
    it('accepts a value resolver function', () => {
      let invokation = () => sort.descending(noop);
      expect(sort.descending(() => {})).not.to.throw();
    })

    it('returns a sort comparator', () => {
      expect(sort.descending(noop)).to.be.a('function');
    });

    it('comparator sorts in descending order', () => {
      let values = [{prop: 3}, {prop: 1}, {prop: 2}];
      let evaluate = value => value.prop;
      let comparator = sort.descending(evaluate);
      let sorted = values.sort(comparator);

      expect(sorted[0].prop).to.equal(3);
      expect(sorted[1].prop).to.equal(2);
      expect(sorted[2].prop).to.equal(1);
    });
  });
});
