var expect = require('chai').expect;
var parse = require('../parser');

describe("env vars", () => {
  it("parses them as variable assignments and references", (done) => {
    expect(parse('Y=1 echo $Y')[0]).to.deep.equal(
      {
        type: 'command',
        command: {
          type: 'literal',
          value: "echo"
        },
        args: [
          {
            type: 'variable',
            name: 'Y'
          },
        ],
        redirects: [],
        env: {
          Y: {
            type: 'literal',
            value: '1'
          }
        },
        control: ';',
        next: null
      }
    );
    done();
  });
});
