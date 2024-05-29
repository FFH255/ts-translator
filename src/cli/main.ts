import { Lexer } from "../domain/lexer.ts"
import { Parser } from "../domain/parser.ts"
import { SourceCode } from "../domain/source-code.ts"

const input = "аа1"

const src = new SourceCode(input)

const lexer = new Lexer()

const tokens = lexer.tokenize(src)

const parser = new Parser()

const program = parser.parse(tokens)

console.log(program)
