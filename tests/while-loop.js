var expect = require('chai').expect;
var parse = require('../parser');

describe("while loop", () => {
  it("parses a while loop", (done) => {
    expect(parse('while true; do echo 1; done')[0]).to.deep.equal(
      {
        type: "whileLoop",
        test: [{
          type: "command",
          command: {
            type: "literal",
            value: "true"
          },
          args: [],
          redirects: [],
          env: {},
          control: ";",
          next: null
        }],
        body: [{
          type: "command",
          command: {
            type: "literal",
            value: "echo"
          },
          args: [
            {
              type: "literal",
              value: "1"
            }],
          redirects: [],
          env: {},
          control: ";",
          next: null
        }],
        next: null,
        control: ';'
      }
    );
    done();
  });
  it("fails to parse an invalid while loop", (done) => {
    let syntaxFailure =() => {
      parse('while echo 1 && do blah; done')
    };
    expect(syntaxFailure).to.throw(/SyntaxError/);
    done();
  });
});
