var test = require('tape')
var parse = require('../parser')

test('case clauses - simple', function (t) {
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
            type: 'glob',
            value: '*'
          }
        ],
        body: {
          control: ';',
          value: [
            {
              "type": "command",
              "command": {
                "type": "literal",
                "value": "lol"
              },
              "args": [],
              "redirects": [],
              "env": {},
              "control": ";",
              "next": null
            },
            {
              "type": "command",
              "command": {
                "type": "literal",
                "value": "more_lol"
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
            type: 'literal',
            value: 'b'
          }
        ],
        body: {
          control: ';;',
          value: [
            {
              "type": "command",
              "command": {
                "type": "literal",
                "value": "looool"
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
            type: 'literal',
            value: '-e'
          }
        ],
        body: {
          control: ';',
          value: [
            {
              "type": "command",
              "command": {
                "type": "literal",
                "value": "even_more"
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

  var actual = parse('case foo in * ) lol; more_lol; b ) looool;; -e) even_more; esac')[0]

  t.deepEqual(actual, expected)
  t.end()
})

