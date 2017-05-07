var expect = require('chai').expect;
var parse = require('../parser');
var unroll = require('unroll');
unroll.use(it);

describe("partial input", () => {
  unroll('fails to parse #input',
    (done, testArgs) => {
      let syntaxFailure = () => {
        parse(testArgs['input'])
      };
      expect(syntaxFailure).to.throw(/SyntaxError/);
      done();
    },
    [
      ['input'],
      ["echo '"],
      ['echo "'],
      ['echo `start'],
      ['echo $('],
      ['echo ${'],
      ['if'],
      ['while'],
      ['until']
    ]
  );
  unroll('parses continuation of #input',
    (done, testArgs) => {
      try {
        parse(testArgs['input'])
      } catch (err) {
        let continuation = testArgs['input'].slice(err.location.start.offset);
        let syntaxPass = () => {
          parse(continuation, 'continuationStart');
        };
        expect(syntaxPass).to.not.throw(/SyntaxError/);
        done();
      }
    },
    [
      ['input'],
      ["echo '"],
      ['echo "'],
      ['echo `start'],
      ['echo $('],
      ['echo ${'],
      ['if'],
      ['while'],
      ['until']
    ]
  );
});
