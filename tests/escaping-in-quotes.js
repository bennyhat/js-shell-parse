var expect = require('chai').expect;
var parse = require('../parser');

describe("escaping in quotes", () => {
  it("parses and escapes double-quotes", (done) => {
    expect(parse('"An escaped double-quote: \\""', 'argument')).to.deep.equal(
      {
        type:"literal",
        value:"An escaped double-quote: \""
      }
    );
    done();
  });
  it("parses and escapes $", (done) => {
    expect(parse('"An escaped \\$dollar sign"', 'argument')).to.deep.equal(
      {
        type:"literal",
        value:"An escaped $dollar sign"
      }
    );
    done();
  });
});
