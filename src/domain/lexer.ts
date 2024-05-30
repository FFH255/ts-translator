/* eslint-disable @typescript-eslint/no-explicit-any */

import { SyntexError } from "./errors.ts"
import { SourceCode } from "./source-code.ts"
import { Token, TokenType, Tokens } from "./tokens.ts"
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
    Синус: TokenType.Function,
    Косинус: TokenType.Function,
    Тангенс: TokenType.Function,
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

  private readonly logicals = ["&", "|"]
  private readonly booleans = ["&&", "||"]
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
    return this.logicals.includes(symbol)
  }

  private isBoolean(str: string): boolean {
    return this.booleans.includes(str)
  }

  private isIdentifier(str: string): boolean {
    const regex = /[а-я]{2}\d+/
    return regex.test(str)
  }

  private isKeyword(str: string): boolean {
    return this.keywords[str] !== undefined
  }

  tokenize(src: SourceCode): Tokens {
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
          throw new SyntexError(
            `Неизвестная последовательность символов "${ident}"`,
            src.position() - ident.length,
            src.position() - 1
          )
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
          throw new SyntexError(
            `Неправильная запись числа "${num}"`,
            src.position() - num.length,
            src.position() - 1
          )
        }
      } else if (this.isAdditive(src.at())) {
        tokens.push(new Token(TokenType.AdditiveOperator, src.eat()))
      } else if (this.isMultiplicative(src.at())) {
        tokens.push(new Token(TokenType.MultiplicativeOperator, src.eat()))
      } else if (this.isLogical(src.at())) {
        let bool = src.eat()
        while (!this.isSkippable(src.at()) && src.notEOF()) {
          bool += src.eat()
        }
        if (!this.isBoolean(bool)) {
          throw new SyntexError(
            `Неизвестный логический символ "${bool}"`,
            src.position() - bool.length,
            src.position() - 1
          )
        }
        tokens.push(new Token(TokenType.LogicalOperator, bool))
      } else if (src.at() === "=") {
        const equals = src.eat()
        if (src.at() === ":") {
          tokens.push(new Token(TokenType.Allocation, equals + src.eat()))
        } else {
          tokens.push(new Token(TokenType.Equals, equals))
        }
      } else if (src.at() === ":") {
        tokens.push(new Token(TokenType.Colon, src.eat()))
      } else if (src.at() === ";") {
        tokens.push(new Token(TokenType.Semicolon, src.eat()))
      } else {
        throw new SyntexError(
          `Неизвестный символ "${src.at()}"`,
          src.position(),
          src.position()
        )
      }
    }
    tokens.push(new Token(TokenType.EOF, ""))
    return new Tokens(tokens)
  }
}
