import { TokenType } from "./language-specifics"
import { SourceCode } from "./source-code"

export class Token {
  constructor(public type: TokenType, public value: string) {}
}

export class Lexer {
  tokenize(src: SourceCode): Token[] {
    const tokens = new Array<Token>()
    while (src.notEOF()) {
      switch (src.eat()) {
        case "=": {
          tokens.push(new Token(TokenType.Equals, "="))
          break
        }
        case "+": {
          tokens.push(new Token(TokenType.Plus, "+"))
          break
        }
        case "-": {
          tokens.push(new Token(TokenType.Minus, "-"))
          break
        }
      }
    }
    return tokens
  }
}
