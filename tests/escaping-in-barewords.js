var expect = require('chai').expect;
var parse = require('../parser');

describe("escaping meta characters in barewords", () => {
  it("parses and escapes spaces", (done) => {
    expect(parse('I\\ am\\ one\\ arg', 'argument')).to.deep.equal(
      {
        type: 'literal',
        value: 'I am one arg'
      }
    );
    done();
  });
  it("parses and escapes $", (done) => {
    expect(parse('\\$dollar_dollar_bill', 'argument')).to.deep.equal(
      {
        type: 'literal',
        value: '$dollar_dollar_bill'
      }
    );
    done();
  });
  it("parses and escapes >", (done) => {
    expect(parse('\\>\\ no\\ redirect', 'argument')).to.deep.equal(
      {
        type: 'literal',
        value: '> no redirect'
      }
    );
    done();
  });
  it("parses and escapes mid-word", (done) => {
    expect(parse('dollar_\\$dollar_bill', 'argument')).to.deep.equal(
      {
        type: 'literal',
        value: 'dollar_$dollar_bill'
      }
    );
    done();
  });
});
