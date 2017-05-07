var expect = require('chai').expect;
var parse = require('../parser');

describe("case condition - simple", function () {
  it("parses a body with multiple statements in it", function (done) {
    expect(parse('case foo in * ) lol; more_lol; foo) another;; esac')[0]).to.deep.equal(
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
                value: 'foo'
              }
            ],
            body: {
              control: ';;',
              value: [
                {
                  "type": "command",
                  "command": {
                    "type": "literal",
                    "value": "another"
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
  it("parses a pattern with a flag in it", function (done) {
    expect(parse('case foo in -e) even_more; esac')[0]).to.deep.equal(
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
    );
    done();
  });
});
