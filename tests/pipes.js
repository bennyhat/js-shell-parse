var expect = require('chai').expect;
var parse = require('../parser');

describe("pipes", () => {
  it("parses pipe operators as redirects", (done) => {
    expect(parse("first | second")).to.deep.equal(
      [
        {
          "type": "command",
          "command": {
            "type": "literal",
            "value": "first"
          },
          "args": [],
          "redirects": [
            {
              "type": "pipe",
              "command": {
                "type": "command",
                "command": {
                  "type": "literal",
                  "value": "second"
                },
                "args": [],
                "redirects": [],
                "env": {},
                "control": ";",
                "next": null
              }
            }
          ],
          "env": {},
          "control": ";",
          "next": null
        },
      ]
    );
    done();
  });
});
