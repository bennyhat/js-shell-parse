var expect = require('chai').expect;
var parse = require('../parser');

describe("case condition - complex", () => {
  it("parses a patterns with ORs in them", (done) => {
    expect(parse('case foo in c | d) more_stuff;; esac')[0]).to.deep.equal(
      {
        type: 'case',
        selection: {
          type: 'literal',
          value: 'foo'
        },
        optionList: [
          {
            type: 'caseOption',
            patternList: [
              {
                type: 'literal',
                value: 'c'
              },
              '|',
              {
                type: 'literal',
                value: 'd'
              }
            ],
            body: {
              control: ';;',
              value: [
                {
                  "type": "command",
                  "command": {
                    "type": "literal",
                    "value": "more_stuff"
                  },
                  "args": [],
                  "redirects": [],
                  "env": {},
                  "control": ";",
                  "next": null
                }
              ]
            }
          }],
        control: ';',
        next: null
      }
    );
    done();
  });
  it("parses a patterns with bracket expression in them", (done) => {
    expect(parse('case foo in [yY] | [Nn][oO] ) bracket_expression; esac')[0]).to.deep.equal(
      {
        type: 'case',
        selection: {
          type: 'literal',
          value: 'foo'
        },
        optionList: [{
          type: 'caseOption',
          patternList: [
            {
              type: 'bracketExpression',
              value: {
                "type": "literal",
                "value": "yY"
              }
            },
            '|',
            {
              type: 'bracketExpression',
              value: {
                "type": "literal",
                "value": "Nn"
              }
            },
            {
              type: 'bracketExpression',
              value: {
                "type": "literal",
                "value": "oO"
              }
            }
          ],
          body: {
            control: ';',
            value: [
              {
                "type": "command",
                "command": {
                  "type": "literal",
                  "value": "bracket_expression"
                },
                "args": [],
                "redirects": [],
                "env": {},
                "control": ";",
                "next": null
              }
            ]
          }
        }],
        control: ';',
        next: null
      }
    );
    done();
  });
  it("parses a body with a non-; control character in it", (done) => {
    expect(parse('case foo in * ) echo bar & ;; esac')[0]).to.deep.equal(
      {
        type: 'case',
        selection: {
          type: 'literal',
          value: 'foo'
        },
        optionList: [{
          type: 'caseOption',
          patternList: [
            {
              type: 'glob',
              value: '*'
            }
          ],
          body: {
            control: ';;',
            value: [
              {
                type: 'command',
                command: {
                  type: 'literal',
                  value: 'echo'
                },
                args: [
                  {
                    type: 'literal',
                    value: 'bar'
                  }
                ],
                redirects: [],
                env: {},
                control: '&',
                next: null
              },
            ]
          }
        }],
        control: ';',
        next: null
      }
    );
    done();
  });
  it("parses a ;;& case control operator", (done) => {
    expect(parse('case foo in *) echo baz;;& esac')[0]).to.deep.equal(
      {
        type: 'case',
        selection: {
          type: 'literal',
          value: 'foo'
        },
        optionList: [{
          type: 'caseOption',
          patternList: [
            {
              type: 'glob',
              value: '*'
            }
          ],
          body: {
            control: ';;&',
            value: [
              {
                type: 'command',
                command: {
                  type: 'literal',
                  value: 'echo'
                },
                args: [
                  {
                    type: 'literal',
                    value: 'baz'
                  }
                ],
                redirects: [],
                env: {},
                control: ';',
                next: null
              },
            ]
          }
        }],
        control: ';',
        next: null
      }
    );
    done();
  });
  it("parses a ;& case control operator", (done) => {
    expect(parse('case foo in * ) echo foo;& esac')[0]).to.deep.equal(
      {
        type: 'case',
        selection: {
          type: 'literal',
          value: 'foo'
        },
        optionList: [{
          type: 'caseOption',
          patternList: [
            {
              type: 'glob',
              value: '*'
            }
          ],
          body: {
            control: ';&',
            value: [
              {
                type: 'command',
                command: {
                  type: 'literal',
                  value: 'echo'
                },
                args: [
                  {
                    type: 'literal',
                    value: 'foo'
                  }
                ],
                redirects: [],
                env: {},
                control: ';',
                next: null
              },
            ]
          }
        }],
        control: ';',
        next: null
      }
    );
    done();
  });
  it("parses and correctly concatenates brackets in pattern", (done) => {
    expect(parse('case foo in [aA]*) echo foo;& esac')[0]).to.deep.equal(
      {
        type: 'case',
        selection: {
          type: 'literal',
          value: 'foo'
        },
        optionList: [{
          type: 'caseOption',
          patternList: [
            {
              type: 'bracketExpression',
              value: {
                "type": "literal",
                "value": "aA"
              }
            },
            {
              type: 'glob',
              value: '*'
            }
          ],
          body: {
            control: ';&',
            value: [
              {
                type: 'command',
                command: {
                  type: 'literal',
                  value: 'echo'
                },
                args: [
                  {
                    type: 'literal',
                    value: 'foo'
                  }
                ],
                redirects: [],
                env: {},
                control: ';',
                next: null
              },
            ]
          }
        }],
        control: ';',
        next: null
      }
    );
    done();
  });
});
