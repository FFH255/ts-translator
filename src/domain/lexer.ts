import { SourceCode } from "./source-code.ts"

export const enum TokenType {
  Begin,
  End,
  Int,
  Float,
  Identifier,
  Equals,
  AdditiveOperator,
  MultiplicativeOperator,
  LogicalOperator,
  StartAnalysis,
  EndAnalysis,
  StartSynthesis,
  EndSynthesis,
  Colon,
  Semicolon,
  Allocation,
}

export class Token {
  constructor(public type: TokenType, public value: string) {}
}

export type Range<T> = [T, T]

export type Keywords = { [key: string]: TokenType }

export class Lexer {
  private readonly keywords: Keywords = {
    Начало: TokenType.Begin,
    Конец: TokenType.End,
    Анализ: TokenType.StartAnalysis,
    Синтез: TokenType.StartSynthesis,
    КонецСинтеза: TokenType.EndSynthesis,
    КонецАнализа: TokenType.EndSynthesis,
  }

  private readonly skippables = [" ", "\n", "\t"]

  private readonly lettersRange: Range<number> = [
    "А".charCodeAt(0),
    "Я".charCodeAt(0),
  ]

  private readonly numbersRange: Range<number> = [
    "0".charCodeAt(0),
    "9".charCodeAt(0),
  ]

  private readonly booleans = ["&&", "||", "!"]
  private readonly additives = ["+", "-"]
  private readonly multiplicatives = ["*", "/"]

  private isSkippable(str: string) {
    return this.skippables.includes(str)
  }

  private isAlphabetical(symbol: string): boolean {
    const letter = symbol.toUpperCase().charCodeAt(0)
    return this.lettersRange[0] <= letter && letter <= this.lettersRange[1]
  }

  private isNumeric(symbol: string): boolean {
    const symbolCode = symbol.charCodeAt(0)
    return (
      this.numbersRange[0] <= symbolCode && symbolCode <= this.numbersRange[1]
    )
  }

  private isInt(str: string): boolean {
    const regex = /^\d+$/
    return regex.test(str)
  }

  private isFloat(str: string): boolean {
    const regex = /^\d+\.\d+$/
    return regex.test(str)
  }

  private isMultiplicative(symbol: string): boolean {
    return this.multiplicatives.includes(symbol)
  }

  private isAdditive(symbol: string): boolean {
    return this.additives.includes(symbol)
  }

  private isLogical(symbol: string): boolean {
    return this.booleans.includes(symbol)
  }

  private isIdentifier(str: string): boolean {
    const regex = /[а-я]{2}\d+/
    return regex.test(str)
  }

  private isKeyword(str: string): boolean {
    return this.keywords[str] !== undefined
  }

  tokenize(src: SourceCode): Token[] {
    const tokens = new Array<Token>()
    while (src.notEOF()) {
      if (this.isSkippable(src.at())) {
        src.eat()
      } else if (this.isAlphabetical(src.at())) {
        let ident = ""
        while (
          src.notEOF() &&
          (this.isAlphabetical(src.at()) || this.isNumeric(src.at()))
        ) {
          ident += src.eat()
        }
        if (this.isKeyword(ident)) {
          tokens.push(new Token(this.keywords[ident], ident))
        } else if (this.isIdentifier(ident)) {
          tokens.push(new Token(TokenType.Identifier, ident))
        } else {
          // TODO: throw error
        }
      } else if (this.isNumeric(src.at())) {
        let num = ""
        while (src.notEOF() && (this.isNumeric(src.at()) || src.at() === ".")) {
          num += src.eat()
        }
        if (this.isInt(num)) {
          tokens.push(new Token(TokenType.Int, num))
        } else if (this.isFloat(num)) {
          tokens.push(new Token(TokenType.Float, num))
        } else {
          // TODO: throw error
        }
      } else if (this.isAdditive(src.at())) {
        tokens.push(new Token(TokenType.AdditiveOperator, src.eat()))
      } else if (this.isMultiplicative(src.at())) {
        tokens.push(new Token(TokenType.MultiplicativeOperator, src.eat()))
      } else if (this.isLogical(src.at())) {
        tokens.push(new Token(TokenType.LogicalOperator, src.eat()))
      } else if (src.at() === "=") {
        tokens.push(new Token(TokenType.Equals, src.eat()))
      } else if (src.at() === ":") {
        const colon = src.eat()
        if (src.at() === "=") {
          tokens.push(new Token(TokenType.Allocation, colon + src.eat()))
        } else {
          tokens.push(new Token(TokenType.Colon, colon))
        }
      } else if (src.at() === ";") {
        tokens.push(new Token(TokenType.Semicolon, src.eat()))
      }
    }
    return tokens
  }
}
