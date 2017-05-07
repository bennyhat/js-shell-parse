var expect = require('chai').expect;
var parse = require('../parser');

describe("sub-shells", () => {
  it("parses and separates sub-shell commands with ;", (done) => {
    expect(parse('( cd /foo; echo * )')).to.deep.equal(
      [{
        type: 'subshell',
        statements: [{
          type: 'command',
          command: { type: 'literal', value: 'cd' },
          args: [
            { type: 'literal', value: '/foo' }
          ],
          redirects: [],
          env: {},
          control: ';',
          next: null
        }, {
          type: 'command',
          command: { type: 'literal', value: 'echo' },
          args: [
            { type: 'glob', value: '*' }
          ],
          redirects: [],
          env: {},
          control: ';',
          next: null
        }],
        control: ';',
        next: null
      }]
    );
    done();
  });
});
