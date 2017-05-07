script
 = spaceNL* statements:statementList?

space "whitespace"
 = " " / "\t"

spaceNL = space / "\n" / comment

comment "a comment"
  = '#' [^\n]* ("\n" / EOF)

statementList
 = head:statement
   tail:(controlOperator spaceNL* statement)*
   space* last:controlOperator? spaceNL*

statement
 = statement:( subshell
             / bashExtensions
             / command
             / variableAssignment
             / ifBlock
             / conditionalLoop
             / forLoop
             / caseBlock
             )
   next:(space* chainedStatement)?

subshell "a subshell"
 = "(" space* statements:statementList  space* ")"

bashExtensions
 = time / declare

command "a single command"
 = pre:((variableAssignment / redirect) space+)*
   name:(commandName / builtinCommandName)
   post:(space+ (redirect / argument))*
   pipe:(space* pipe)?

variableAssignment "a variable assignment"
 = name:writableVariableName '=' value:argument?

ifBlock "an if/elif/else statement"
 = "if" spaceNL+ test:condition
   "then" spaceNL+ body:script
   elifBlocks:elifBlock*
   elseBody:("else" script)?
   "fi"

conditionalLoop "a while/until loop"
= kind:("while" / "until") spaceNL+ test:condition
  "do" spaceNL+ body:script
  "done"

forLoop "a for loop"
 = "for" space+ loopVar:writableVariableName spaceNL+
   subjects:("in" (space+ argument)*)?
   space* (";" / "\n") spaceNL*
   "do" spaceNL+
   body:statementList spaceNL*
   "done"

caseBlock "a case block"
 = "case" space+ selection:concatenation spaceNL+
   "in" spaceNL+ optionList:caseOption+
   "esac"

chainedStatement
 = operator:('&&' / '||') spaceNL* statement:statement

time "time builtin"
 = "time" space+ flags:("-" [a-z]+ space+)* statements:statementList

declare "declare builtin"
 = ("declare" / "typeset") command:[^\n]+ (";" / "\n")

redirect
 = moveFd / duplicateFd / redirectFd

moveFd
 = fd:fd? op:('<&' / '>&') dest:fd '-'

duplicateFd
 = src:fd? op:('<&' / '>&') space* dest:fd

redirectFd
 = fd:fd? op:redirectionOperator space* filename:argument

redirectionOperator
 = '>|' / '>>' / '&>>' / '&>' / '<' / '>'

fd
 = digits:[0-9]+ { return parseInt(join(digits), 10) }

commandName "command name"
 = !redirect
   !keyword
   !variableAssignment
   name:(concatenation / builtinCommandName)

builtinCommandName
 = '[[' / '['

argument "command argument"
 = commandName
 / processSubstitution

pipe =
 "|" spaceNL* command:command

writableVariableName = [a-zA-Z0-9_]+

readableVariableName = writableVariableName / '?'  /* todo, other special vars */

condition
 = test:script

elifBlock
 = "elif" spaceNL+ test:condition "then" spaceNL+ body:script

caseOption "a case option"
 = "("? patternList:casePattern+ space* ")" body:caseBody spaceNL*

casePattern "a case pattern"
 = casePatternBracketExpression / casePatternExpression

casePatternExpression
 = concatenation:concatenation space? pipe:"|"? space?

casePatternBracketExpression
 = "[" concatenation:casePatternConcatenation "]" space? pipe:"|"? space?

caseBody "a case body"
 = statementList:caseStatement+ control:caseControlOperator?

caseStatement
 = spaceNL* statement:statement control:caseInnerControlOperator

controlCharacters
 = '&' / ';' / '\n'

caseControlCharacters
 = ';;&' / ';;' / ';&' // ; is not strictly case control

controlOperator
 = space* op:controlCharacters

caseControlOperator
 = space* op:caseControlCharacters

// will either see case control and bail (successfully with no match) - defaults inner to ';'
//  or pick up any regular control characters - if ';' it will steal from and default outer to ';'
caseInnerControlOperator
 = space* op:(&caseControlCharacters / controlCharacters)

commonConcatenation
 = environmentVariable
 / variableSubstitution
 / commandSubstitution
 / singleQuote
 / doubleQuote

casePatternConcatenation "concatenation of strings and/or variables"
 = pieces:( caseGlob
          / caseBareword
          / commonConcatenation
          )+

concatenation "concatenation of strings and/or variables"
 = pieces:( glob
          / bareword
          / commonConcatenation
          )+

caseBareword
 = !'#' cs:caseBarewordChar+

caseBarewordChar
= '\\' chr:caseBarewordMeta { return chr }
/ !caseBarewordMeta chr:.   { return chr }

caseBarewordMeta = [$"';&<>\n()\[\]*?` ]

caseGlob
 = caseBareword* ('*' / '?' / characterRange / braceExpansion)+ caseBareword*

bareword "bareword"
 = !'#' cs:barewordChar+

barewordChar
 = '\\' chr:barewordMeta { return chr }
 / !barewordMeta chr:.   { return chr }

barewordMeta = [$"';&<>\n()\[*?|` ]

glob
 = barewordChar* ('*' / '?' / characterRange / braceExpansion)+ barewordChar*

characterRange
 = $('[' !'-' . '-' !'-' . ']')

braceExpansion
 = (.? !'$') '{' barewordChar+ '}'

singleQuote
 = "'" inner:$([^']*) "'"

doubleQuote
 = '"' contents:(expandsInQuotes / doubleQuoteChar+)* '"'

doubleQuoteChar
 = '\\' chr:doubleQuoteMeta { return chr }
 / '\\\\'                   { return '\\' }
 / !doubleQuoteMeta chr:.   { return chr }

doubleQuoteMeta
 = '"' / '$' / '`'

expandsInQuotes
 = commandSubstitution
 / environmentVariable
 / variableSubstitution

environmentVariable = '$' name:readableVariableName

variableSubstitution = '${' expr:[^}]* '}'

commandSubstitution
 = parenCommandSubstitution / backQuote

parenCommandSubstitution
 = '$(' commands:statementList ')'

backQuote
 = '`' input:backQuoteChar+ '`'

backQuoteChar
 = '\\`'      { return '`' }
 / '\\\\'     { return '\\' }
 / !'`' chr:. { return chr }

processSubstitution
 = rw:[<>] '(' commands:statementList ')'

keyword
 = ( "while"
   / "until"
   / "for"
   / "done" // "done" must come before "do"
   / "do"
   / "case"
   / "esac"
   / "if"
   / "then"
   / "else"
   / "elif"
   / "fi"
   / "[["
   )
   ( spaceNL+ / EOF )

continuationStart
 = &( keyword / '"' / "'" / '`' / "$(" / "${" ) .*

EOF
 = !.
