var expect = require('chai').expect;
var parse = require('../parser');

describe("expected parsing errors", () => {
  it("fails to parse unbalanced parentheses", (done) => {
    let syntaxFailure = () => {
      parse('echo ( this will fail')
    };
    expect(syntaxFailure).to.throw(/SyntaxError/);
    done();
  });
  it("errors with correct location of syntax error", (done) => {
    try {
      parse('echo ( this will fail')
    } catch (err) {
      expect(err.location.start.offset).to.equal(5);
      done();
    }
  });
  it("fails to parse unbalanced parentheses as a continuationStart", (done) => {
    let syntaxFailure = () => {
      parse('( this will fail', 'continuationStart')
    };
    expect(syntaxFailure).to.throw(/SyntaxError/);
    done();
  });
});
