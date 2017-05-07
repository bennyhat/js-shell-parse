script
 = spaceNL* statements:statementList?

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

chainedStatement
 = operator:('&&' / '||') spaceNL* statement:statement

subshell "a subshell"
 = "(" space* statements:statementList  space* ")"

command "a single command"
 = pre:((variableAssignment / redirect) space+)*
   name:(commandName / builtinCommandName)
   post:(space+ (redirect / argument))*
   pipe:(space* pipe)?

condition
 = test:script

ifBlock "an if/elif/else statement"
 = "if" spaceNL+ test:condition
   "then" spaceNL+ body:script
   elifBlocks:elifBlock*
   elseBody:("else" script)?
   "fi"

caseBlock "a case block"
 = "case" space+ selection:concatenation spaceNL+
   "in" spaceNL+ optionList:caseOption+
   "esac"

caseOption "a case option"
 = "("? patternList:casePattern+ space* ")" body:caseBody spaceNL*

casePattern "a case pattern"
 = casePatternExpression / casePatternBracketExpression

casePatternExpression
 = concatenation:concatenation space? pipe:"|"? space?

casePatternBracketExpression
 = "["? concatenation:concatenation space? pipe:"|"? space?

caseBody "a case body"
 = statementList:caseStatement+ control:caseControlOperator?

caseStatement
 = spaceNL* statement:statement control:controlOperator

elifBlock
 = "elif" spaceNL+ test:condition "then" spaceNL+ body:script

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

bashExtensions
 = time / declare

time "time builtin"
 = "time" space+ flags:("-" [a-z]+ space+)* statements:statementList

declare "declare builtin"
 = ("declare" / "typeset") command:[^\n]+ (";" / "\n")

variableAssignment "a variable assignment"
 = name:writableVariableName '=' value:argument?

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

concatenation "concatenation of strings and/or variables"
 = pieces:( glob
          / bareword
          / environmentVariable
          / variableSubstitution
          / commandSubstitution
          / singleQuote
          / doubleQuote
          )+

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

writableVariableName = [a-zA-Z0-9_]+
readableVariableName = writableVariableName / '?'  /* todo, other special vars */

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

controlOperator
 = space* op:('&' / ';' / '\n')

caseControlOperator
 = space* op:(';;&' / ';;' / ';&' / ';' / '&' )

pipe =
 "|" spaceNL* command:command

space "whitespace"
 = " " / "\t"

spaceNL = space / "\n" / comment

comment "a comment"
  = '#' [^\n]* ("\n" / EOF)

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
