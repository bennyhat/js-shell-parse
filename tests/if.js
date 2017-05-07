var expect = require('chai').expect;
var parse = require('../parser');

describe("if conditions", () => {
  it("parses conditions with only an if", (done) => {
    expect(parse('if true; then echo 1; fi')[0]).to.deep.equal(
      {
        type: "ifElse",
        test: [{
          type: "command",
          command: {
            type: "literal",
            value: "true"
          },
          args: [],
          redirects: [],
          env: {},
          control: ";",
          next: null
        }],
        body: [{
          type: "command",
          command: {
            type: "literal",
            value: "echo"
          },
          args: [
            {
              type: "literal",
              value: "1"
            }],
          redirects: [],
          env: {},
          control: ";",
          next: null
        }],
        elifBlocks: null,
        elseBody: null,
        next: null,
        control: ';'
      }
    );
    done();
  });
  it("parses conditions with an if and an else", (done) => {
    expect(parse('if true; then echo 1; else echo 2; fi')[0]).to.deep.equal(
      {
        type: "ifElse",
        test: [{
          type: "command",
          command: {
            type: "literal",
            value: "true"
          },
          args: [],
          redirects: [],
          env: {},
          control: ";",
          next: null
        }],
        body: [{
          type: "command",
          command: {
            type: "literal",
            value: "echo"
          },
          args: [
            {
              type: "literal",
              value: "1"
            }],
          redirects: [],
          env: {},
          control: ";",
          next: null
        }],
        elifBlocks: null,
        elseBody: [
          {
            type: 'command',
            command: {
              type: 'literal',
              value: 'echo'
            },
            args: [{
              type: 'literal',
              value: '2'
            }],
            redirects: [],
            env: {},
            control: ';',
            next: null
          }
        ],
        next: null,
        control: ';'
      }
    );
    done();
  });
  it("parses conditions with if, elif and else", (done) => {
    expect(parse('if true; then echo 1; elif false; then echo 3; else echo 2; fi')[0]).to.deep.equal(
      {
        type: "ifElse",
        test: [{
          type: "command",
          command: {
            type: "literal",
            value: "true"
          },
          args: [],
          redirects: [],
          env: {},
          control: ";",
          next: null
        }],
        body: [{
          type: "command",
          command: {
            type: "literal",
            value: "echo"
          },
          args: [
            {
              type: "literal",
              value: "1"
            }],
          redirects: [],
          env: {},
          control: ";",
          next: null
        }],
        elifBlocks: [
          {
            type: 'ifElse',
            test: [{
              type: "command",
              command: {
                type: "literal",
                value: "false"
              },
              args: [],
              redirects: [],
              env: {},
              control: ";",
              next: null
            }],
            body: [{
              type: 'command',
              command: {
                type: 'literal',
                value: 'echo'
              },
              args: [
                {
                  type: 'literal',
                  value: '3'
                }],
              redirects: [],
              env: {},
              control: ';',
              next: null
            }]
          }
        ],
        elseBody: [
          {
            type: 'command',
            command: {
              type: 'literal',
              value: 'echo'
            },
            args: [{
              type: 'literal',
              value: '2'
            }],
            redirects: [],
            env: {},
            control: ';',
            next: null
          }
        ],
        next: null,
        control: ';'
      }
    );
    done();
  });
  it("parses conditions with test conditions in them", (done) => {
    expect(parse('if [ -f somefile ]; then echo 1; fi')[0]).to.deep.equal(
      {
        type: "ifElse",
        test: [{
          type: "command",
          command: '[',
          args: [{
            type: "literal",
            value: "-f"
          }, {
            type: "literal",
            value: "somefile"
          }, {
            type: "literal",
            value: "]"
          }],
          redirects: [],
          env: {},
          control: ";",
          next: null
        }],
        body: [{
          type: "command",

          command: {
            type: "literal",
            value: "echo"
          },
          args: [{
            type: "literal",
            value: "1"
          }],
          redirects: [],
          env: {},
          control: ";",
          next: null
        }],
        elifBlocks: null,
        elseBody: null,
        control: ";",
        next: null
      }
    );
    done();
  });
});
