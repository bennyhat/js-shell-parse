var expect = require('chai').expect;
var parse = require('../parser');

describe("concatenation", () => {
  it("parses and flattens concatenated literals", (done) => {
    expect(parse('"two "\' strings\'', 'argument')).to.deep.equal(
      {
        type: 'literal',
        value: 'two  strings'
      }
    );
    done();
  });
  it("parses and concatenates variables and literals", (done) => {
    expect(parse('$var"and a string"', 'argument')).to.deep.equal(
      {
        type: 'concatenation',
        pieces: [
          {
            type: 'variable',
            name: 'var'
          },
          {
            type: 'literal',
            value: 'and a string'
          }
        ]
      }
    );
    done();
  });
  it("parses and concatenates alternating quote contexts", (done) => {
    expect(parse('"it\'s easy to switch "\'"back"\'" and "\'"forth"\'', 'argument')).to.deep.equal(
      {
        type: 'literal',
        value: 'it\'s easy to switch "back" and "forth"'
      }
    );
    done();
  });
});
