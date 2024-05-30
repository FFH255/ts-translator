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

const input =
  "Начало Анализ 1.5 КонецАнализа 1: аа1 =: 10 2: аа2 =: аа1 * 2 Конец"

const src = new SourceCode(input)

try {
  const tokens = lexer.tokenize(src)

  const program = parser.parse(tokens)

  interpreter.interpret(program, env)

  console.log(env)
} catch (e) {
  console.error(e)
}
