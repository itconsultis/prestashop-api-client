import {HttpException} from '../../src/exceptions';

describe('exceptions', () => {
  describe('HttpException', () => {
    describe('#constructor', () => {
      it('accepts a status argument', () => {
        let invokation = () => new HttpException('not found', null, null, 404);
        expect(invokation).not.to.throw();
      });

      it('assigns the #status property', () => {
        let e = new HttpException('not found', null, null, 404);
        expect(e.status).to.equal(404);
      });
    });
  });
});

