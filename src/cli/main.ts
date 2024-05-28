import { Lexer } from "../domain/lexer.ts"
import { SourceCode } from "../domain/source-code.ts"

const input =
  "+ - * / 1 = 123 1.2 ав111 Конец Начало Анализ Синтез КонецАнализа : ; :="

const src = new SourceCode(input)

const lexer = new Lexer()

const tokens = lexer.tokenize(src)

console.log(tokens)
