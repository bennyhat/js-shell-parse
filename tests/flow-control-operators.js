var expect = require('chai').expect;
var parse = require('../parser');

describe("flow control operators", () => {
  let expectedCommandList = [
    {
      type: 'command',
      command: { type: 'literal', value: 'echo' },
      args: [
        { type: 'literal', value: 'ok' }
      ],
      redirects: [],
      env: {},
      control: ';',
      next: null
    },
    {
      type: 'command',
      command: { type: 'literal', value: 'echo' },
      args: [
        { type: 'literal', value: 'ok2' }
      ],
      redirects: [],
      env: {},
      control: ';',
      next: null
    },
  ];

  it("parses and separates command with ;", (done) => {
    expect(parse('echo ok;echo ok2;')).to.deep.equal(expectedCommandList);
    done();
  });
  it("parses and separates command with \\n", (done) => {
    expect(parse('echo ok\necho ok2\n')).to.deep.equal(expectedCommandList);
    done();
  });
  it("parses and separates command with &", (done) => {
    expectedCommandList[0].control = '&';
    expect(parse('echo ok & echo ok2;')).to.deep.equal(expectedCommandList);
    done();
  });
});
