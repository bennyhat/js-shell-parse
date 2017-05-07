var expect = require('chai').expect;
var parse = require('../parser');

describe("interpolation in quotes", () => {
  it("parses and interpolates variables", (done) => {
    expect(parse('"interpolated $variable"', 'argument')).to.deep.equal(
      {
        type: 'concatenation',
        pieces: [
          {type: "literal", value: "interpolated "},
          {type: "variable", name: "variable"}
        ]
      }
    );
    done();
  });
  it("parses and interpolates variable substitutions", (done) => {
    expect(parse('"interpolated ${variable/sub/rep}"', 'argument')).to.deep.equal(
      {
        type: 'concatenation',
        pieces: [
          { type: "literal", value: "interpolated " },
          { type: "variableSubstitution", expression: "variable/sub/rep" }
        ]
      }
    );
    done();
  });
  it("parses and interpolates back-ticks", (done) => {
    expect(parse('"interpolated `backtick command`"', 'argument')).to.deep.equal(
      {
        type: 'concatenation',
        pieces: [
          { type: "literal", value:"interpolated " },
          { type: "commandSubstitution",
            commands: [
              { type: 'command',
                command: { type: 'literal', value: 'backtick' },
                args: [
                  {type: 'literal', value: 'command'}
                ],
                redirects: [],
                env: {},
                control: ';',
                next: null }
            ]
          }
        ]
      }
    );
    done();
  });
  it("parses and interpolates sub-shell output", (done) => {
    expect(parse('"interpolated $(command1; command2)"', 'argument')).to.deep.equal(
      {
        type: 'concatenation',
        pieces: [
          { type: "literal", value:"interpolated " },
          { type: "commandSubstitution",
            commands: [
              { type: 'command',
                command: { type: 'literal', value: 'command1' },
                args: [],
                redirects: [],
                env: {},
                control: ';',
                next: null },
              { type: 'command',
                command: { type: 'literal', value: 'command2' },
                args: [],
                redirects: [],
                env: {},
                control: ';',
                next: null }
            ]
          }]
      }
    );
    done();
  });
});
