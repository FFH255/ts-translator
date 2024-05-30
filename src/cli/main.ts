/* eslint-disable no-constant-condition */
import { Environment } from "../domain/environment.ts"
import { Interpreter } from "../domain/interpreter.ts"
import { Lexer } from "../domain/lexer.ts"
import { Parser } from "../domain/parser.ts"
import { SourceCode } from "../domain/source-code.ts"

const lexer = new Lexer()
const parser = new Parser()
const interpreter = new Interpreter()
const env = new Environment()

while (true) {
  const input = prompt("> ")
  if (!input || input.includes("exit")) {
    Deno.exit(1)
  }

  const src = new SourceCode(input)

  try {
    const tokens = lexer.tokenize(src)

    const program = parser.parse(tokens)

    const result = interpreter.interpret(program, env)

    console.log(program, result)
  } catch (e) {
    console.error(e)
  }
}
