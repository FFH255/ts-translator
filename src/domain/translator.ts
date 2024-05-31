import { Lexer } from "./lexer"
import { Parser } from "./parser"
import { Interpreter, NumberValue } from "./interpreter"
import { Environment } from "./environment"
import { SourceCode } from "./source-code"

export interface Variable {
  name: string
  value: number
}

export class Translator {
  private lexer = new Lexer()
  private parser = new Parser()
  private interpreter = new Interpreter()
  private env = new Environment()

  translate(input: string) {
    const src = new SourceCode(input)
    const tokens = this.lexer.tokenize(src)
    const program = this.parser.parse(tokens)
    this.interpreter.interpret(program, this.env)
    const vars = Array.from(this.env.getVars().entries()).map<Variable>(
      ([name, value]) => ({
        name: name,
        value: (value as NumberValue).value,
      })
    )
    return vars
  }
}
