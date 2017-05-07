var expect = require('chai').expect;
var parse = require('../parser');

describe("condition built-ins", () => {
  it("parses a condition into a command", (done) => {
    expect(parse('[ 0 ]')[0]).to.deep.equal(
      {
        type: 'command',
        command: "[",
        args: [
          {
            type: 'literal',
            value: '0'
          },
          {
            type: 'literal',
            value: ']'
          },
        ],
        redirects: [],
        env: {},
        control: ';',
        next: null
      }
    );
    done();
  });
});


