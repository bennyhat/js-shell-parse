var expect = require('chai').expect;
var parse = require('../parser');

describe("globs", () => {
  it("parses * globs", (done) => {
    expect(parse('thing*/**.whatever', 'argument')).to.deep.equal(
      {
        type: 'glob',
        value: 'thing*/**.whatever',
      }
    );
    done();
  });
  it("parses ? globs", (done) => {
    expect(parse('thing-??.txt', 'argument')).to.deep.equal(
      {
        type: 'glob',
        value: 'thing-??.txt',
      }
    );
    done();
  });
  it("parses [] globs", (done) => {
    expect(parse('thing-[1-3][0-9].txt', 'argument')).to.deep.equal(
      {
        type: 'glob',
        value: 'thing-[1-3][0-9].txt',
      }
    );
    done();
  });
});
