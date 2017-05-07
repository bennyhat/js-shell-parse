var test = require('tape')
var parse = require('../parser')

test('case clauses - complex', function (t) {
  var expected = {
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
      },
      {
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
      },
      {
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
      },
      {
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
      },
      {
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

  var actual = parse('case foo in c | d) more_stuff;; [yY] | [Nn][oO] ) bracket_expression; * ) echo bar & ;; *) echo baz;;& * ) echo foo;& esac')[0]

  t.deepEqual(actual, expected)
  t.end()
})

