var expect = require('chai').expect;
var parse = require('../parser');

describe("nested back-ticks", () => {
  it("parses and nests back-ticks (not recommended)", (done) => {
    expect(parse('`outer \\`middle \\\\\\`inner\\\\\\`\\``', 'argument')).to.deep.equal(
      {
        type: 'commandSubstitution',
        commands: [
          {
            type: 'command',
            command: {type: 'literal', value: 'outer'},
            args: [{
              type: "commandSubstitution",
              commands: [
                {
                  type: 'command',
                  command: {
                    type: 'literal',
                    value: 'middle'
                  },
                  args: [{
                    type: "commandSubstitution",
                    commands: [
                      {
                        type: 'command',
                        command: {
                          type: 'literal',
                          value: 'inner'
                        },
                        args: [],
                        redirects: [],
                        env: {},
                        control: ';',
                        next: null
                      }
                    ]
                  }],
                  redirects: [],
                  env: {},
                  control: ';',
                  next: null
                }
              ]
            }],
            redirects: [],
            env: {},
            control: ';',
            next: null
          }
        ],
      }
    );
    done();
  });
});
