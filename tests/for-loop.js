var expect = require('chai').expect;
var parse = require('../parser');

describe("for loop", () => {
  it("parses a for loop", (done) => {
    expect(parse('for x in a b c; do echo $x; done')[0]).to.deep.equal(
      {
        type: "forLoop",
        loopVariable: 'x',
        subjects: [
          {
            type: 'literal',
            value: 'a'
          },
          {
            type: 'literal',
            value: 'b'
          },
          {
            type: 'literal',
            value: 'c'
          }
        ],
        body: [
          {
            type: "command",
            command: {
              type: "literal",
              value: "echo"
            },
            args: [
              {
                type: "variable",
                name: "x"
              }
            ],
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
});
