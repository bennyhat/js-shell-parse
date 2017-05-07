var expect = require('chai').expect;
var parse = require('../parser');

describe("multi-line strings", () => {
  it("parses multi-line strings as one argument", (done) => {
    let multiline = `"This
is a
multiline
string"`;

    expect(parse(multiline, 'argument')).to.deep.equal(
      {
        type: 'literal',
        value: 'This\nis a\nmultiline\nstring'
      }
    );
    done();
  });
});
