var expect = require('chai').expect;
var parse = require('../parser');

describe("command chaining", () => {
  it("parses and chains commands with &&", (done) => {
    expect(parse('echo ok && echo ok2\n')).to.deep.equal([
      {
        type: 'command',
        command: {
          type: 'literal',
          value: 'echo'
        },
        args: [
          {
            type: 'literal',
            value: 'ok'
          }
        ],
        redirects: [],
        env: {},
        control: '&&',
        next: {
          type: 'command',
          command: {
            type: 'literal',
            value: 'echo'
          },
          args: [
            {
              type: 'literal',
              value: 'ok2'
            }
          ],
          redirects: [],
          env: {},
          control: ';',
          next: null
        }
      }
    ]);
    done();
  });
  it("parses and chains commands with ||", (done) => {
    expect(parse('echo ok || echo ok2\n')).to.deep.equal([
      {
        type: 'command',
        command: {
          type: 'literal',
          value: 'echo'
        },
        args: [
          {
            type: 'literal',
            value: 'ok'
          }
        ],
        redirects: [],
        env: {},
        control: '||',
        next: {
          type: 'command',
          command: {
            type: 'literal',
            value: 'echo'
          },
          args: [
            {
              type: 'literal',
              value: 'ok2'
            }
          ],
          redirects: [],
          env: {},
          control: ';',
          next: null
        }
      }
    ]);
    done();
  });
});
