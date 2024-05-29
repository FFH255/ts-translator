import { Lexer } from "../domain/lexer.ts"
import { Parser } from "../domain/parser.ts"
import { SourceCode } from "../domain/source-code.ts"
import { Interpreter } from "../domain/interpreter.ts"

const input = "1 + 1 * 5 / 1"

const src = new SourceCode(input)

const lexer = new Lexer()

const tokens = lexer.tokenize(src)

const parser = new Parser()

const program = parser.parse(tokens)

const interpreter = new Interpreter()

const result = interpreter.interpret(program)

console.log(tokens, "\n", program, "\n", result)
