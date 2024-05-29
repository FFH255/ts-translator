/* eslint-disable no-constant-condition */
import { Lexer } from "../domain/lexer.ts"
import { Parser } from "../domain/parser.ts"
import { SourceCode } from "../domain/source-code.ts"
import { Interpreter } from "../domain/interpreter.ts"

const lexer = new Lexer()
const parser = new Parser()
const interpreter = new Interpreter()

while (true) {
  const input = prompt("> ")
  if (!input || input.includes("exit")) {
    Deno.exit(1)
  }

  const src = new SourceCode(input)

  const tokens = lexer.tokenize(src)

  const program = parser.parse(tokens)

  const result = interpreter.interpret(program)

  console.log(tokens, "\n", program, "\n", result)
}
