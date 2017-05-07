var expect = require('chai').expect;
var parse = require('../parser');

describe("short example", () => {
  it("parses a very simple command", (done) => {
    expect(parse('ls\n')).to.deep.equal(
      [{
        type: 'command',
        command: {type: 'literal', value: 'ls'},
        args: [],
        redirects: [],
        env: {},
        next: null,
        control: ';',
      }]
    );
    done();
  });
});
