let expect = require('chai').expect;
let parse = require('../parser');
let unroll = require('unroll');
unroll.use(it);

let path = require('path');
let fs = require('fs');
let fixturesDirectory = path.join(__dirname, 'fixtures/shellcheck-tests')
let fixturesToUnroll = generateFixturesToUnroll(fixturesDirectory);

describe("shell checks", () => {
  unroll('parses #source',
    (done, testArgs) => {
      let source = fs.readFileSync(testArgs['source'], 'utf8');
      let error = undefined;
      let ast = undefined;
      try {
        error = require(testArgs['error'])
      } catch (e) {
      }
      try {
        ast = require(testArgs['ast'])
      } catch (e) {
      }

      if (error) {
        let syntaxFailure = () => {
          parse(source)
        };
        expect(syntaxFailure).to.throw('message' in error ? new RegExp(error.message) : /SyntaxError/);
      }
      else if (ast) {
        expect(parse(source)).to.deep.equal(ast);
      }
      else {
        try {
          expect(parse(source)).to.not.equal(null);
        } catch (e) {
          if (e instanceof parse.SyntaxError) {
            formatParseError(testArgs['source'], source, e)
          }
          throw e
        }
      }
      done();
    },
    fixturesToUnroll
  );
});

function generateFixturesToUnroll(fixturesDirectory) {
  let glob = require("glob");

  let shellCheckList = glob.sync(fixturesDirectory + '/**/source.sh');
  let sourcePathList = ['source'].concat(shellCheckList);
  let astPathList = ['ast'].concat(shellCheckList.map((sourcePath) => {
    return sourcePath.replace('source.sh', 'ast.json');
  }));
  let errorPathList = ['error'].concat(shellCheckList.map((sourcePath) => {
    return sourcePath.replace('source.sh', 'error.json');
  }));
  return sourcePathList.map((element, index) => {
    return [element, astPathList[index], errorPathList[index]];
  });
}

function formatParseError(sourcePath, source, err) {
  let message = sourcePath.replace(fixturesDirectory,'') + ': ' + err.message
  let start = Math.max(0, err.location.start.offset - 8);
  message += '\n  ' + source.slice(start, start + 10).trim() + '\n';
  for (let i = 0; i <= (err.column - start); i++) message += '-';
  message += '^';
  console.error(message)
}
