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

const input = `
  Начало
  Анализ 1.5 5.0 КонецАнализа;
  Синтез 1.5 2.0 1.55 КонецСинтеза
  1: аа1 =: 10 * 5 - 2
  2: аа2 =: аа1 - аа1
  3: аа3 =: аа2 || 1
  Конец
`

const src = new SourceCode(input)

try {
  const tokens = lexer.tokenize(src)

  const program = parser.parse(tokens)

  interpreter.interpret(program, env)

  console.log(env)
} catch (e) {
  console.error(e)
}
