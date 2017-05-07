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
        body: [
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
        body: [
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
      }],
    control: ';',
    next: null
  }

  var actual = parse('case foo in c | d) more_stuff;; [yY] | [Nn][oO] ) bracket_expression; esac')[0]

  t.deepEqual(actual, expected)
  t.end()
})

