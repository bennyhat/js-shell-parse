var expect = require('chai').expect;
var parse = require('../parser');

describe("variable assignment", () => {
  it("parses simple quoted assignments", (done) => {
    expect(parse('a="b"')).to.deep.equal(
      [{
        type: 'variableAssignment',
        name: 'a',
        value: { type: 'literal', value: 'b' },
        control: ';',
        next: null
      }]
    );
    done();
  });
  it("parses assignments before a command", (done) => {
    expect(parse('a="b" some-command')).to.deep.equal(
      [{
        type: 'command',
        command: { type: 'literal', value: 'some-command' },
        args: [],
        redirects: [],
        env: {
          a: { type: 'literal', value: 'b' }
        },
        control: ';',
        next: null
      }]
    );
    done();
  });
  it("parses empty variable assignments", (done) => {
    expect(parse('a=')).to.deep.equal(
      [{
        type: 'variableAssignment',
        name: 'a',
        value: null,
        control: ';',
        next: null
      }]
    );
    done();
  });
});
