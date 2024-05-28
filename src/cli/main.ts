import { Lexer } from "../domain/lexer.ts"
import { SourceCode } from "../domain/source-code.ts"

const input = "= + -"

const src = new SourceCode(input)

const lexer = new Lexer()

const tokens = lexer.tokenize(src)

console.log(tokens)
