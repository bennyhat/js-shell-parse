var expect = require('chai').expect;
var parse = require('../parser');

describe("redirecting I/O", () => {
  it("parses and redirects stdin and stdout in same command", (done) => {
    expect(parse('transform < fromfile > tofile', 'command')).to.deep.equal(
      {
        type: 'command',
        command: { type: 'literal', value: 'transform' },
        args: [],
        redirects: [
          { type: 'redirectFd',
            fd: 0,
            op: '<',
            filename: { type: 'literal', value: 'fromfile' } },
          { type: 'redirectFd',
            fd: 1,
            op: '>',
            filename: { type: 'literal', value: 'tofile' } }
        ],
        env: {},
        control: ';',
        next: null
      }
    );
    done();
  });
  it("parses and redirects arbitrary fds", (done) => {
    expect(parse('cmd 6> /dev/null', 'command')).to.deep.equal(
      {
        type: 'command',
        command: { type: 'literal', value: 'cmd' },
        args: [],
        redirects: [
          { type: 'redirectFd',
            fd: 6,
            op: '>',
            filename: { type: 'literal', value: '/dev/null' } }
        ],
        env: {},
        control: ';',
        next: null
      }
    );
    done();
  });
  it("parses and can start command with redirects", (done) => {
    expect(parse('> /dev/null cmd', 'command')).to.deep.equal(
      {
        type: 'command',
        command: { type: 'literal', value: 'cmd' },
        args: [],
        redirects: [
          { type: 'redirectFd',
            fd: 1,
            op: '>',
            filename: { type: 'literal', value: '/dev/null' } }
        ],
        env: {},
        control: ';',
        next: null
      }
    );
    done();
  });
  it("parses and redirect to a reference (duplicate FD)", (done) => {
    expect(parse('cmd 2>&1 >/dev/null', 'command')).to.deep.equal(
      {
        type: 'command',
        command: { type: 'literal', value: 'cmd' },
        args: [],
        redirects: [
          { type: 'duplicateFd',
            srcFd: 2,
            op: '>&',
            destFd: 1 },
          { type: 'redirectFd',
            fd: 1,
            op: '>',
            filename: { type: 'literal', value: '/dev/null' } }
        ],
        env: {},
        control: ';',
        next: null
      }
    );
    done();
  });
});
