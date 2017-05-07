var expect = require('chai').expect;
var parse = require('../parser');

describe("comments", () => {
  it("parses and ignores inline comments", (done) => {
    expect(parse('a="b" # very important! do not touch')[0]).to.deep.equal(
      {
        type: 'variableAssignment',
        name: 'a',
        value: {type: 'literal', value: 'b'},
        control: ';',
        next: null
      }
    );
    done();
  });
  it("parses and ignores other comments", (done) => {
    expect(parse(`
        # leading with a comment also works
        a=b
      `)[0]).to.deep.equal(
      {
        type: 'variableAssignment',
        name: 'a',
        value: {type: 'literal', value: 'b'},
        control: ';',
        next: null
      }
    );
    done();
  });
});
