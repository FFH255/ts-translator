/* eslint-disable no-empty */

// 1. Функции
// 2. Отрицание
// 3. Мультипликатив
// 4. Адитив
// 5. And
// 6. Or

import {
  BinaryExpression,
  Expression,
  FunctionExpression,
  IdentifierExpression,
  NumericExpression,
  Program,
  Statement,
  UnaryExpression,
  VariableDeclarationStatement,
} from "./ast.ts"
import { CompileError } from "./errors.ts"
import { Token, TokenType, Tokens } from "./tokens.ts"

export class Parser {
  private tokens = new Tokens([])

  private parseStatement(): Statement {
    return this.parseVariableDeclaration()
  }

  private parseSets() {
    do {
      this.parseSet()
      this.tokens.at().type === TokenType.Semicolon
    } while (this.tokens.safeExpect(TokenType.Semicolon))
  }

  private parseSet() {
    this.tokens.expect(
      [TokenType.StartAnalysis, TokenType.StartSynthesis],
      `Определение должно начинаться со слов "Анализ" или "Синтез"`
    )
    do {
      this.tokens.expect(
        TokenType.Float,
        `После слов "Анализ" или "Синтез" должно идти хоты бы одно вещественное число`
      )
    } while (this.tokens.check(TokenType.Float) && this.tokens.notEOF())
    this.tokens.expect(
      [TokenType.EndAnalysis, TokenType.EndSynthesis],
      `Определение должно заканчиваться словами "Конец Анализа" или "Конец Синтеза"`
    )
  }

  private parseVariableDeclaration(): Statement {
    do {
      this.tokens.expect(
        TokenType.Int,
        "Оператор должен содержать хотя бы одну метку целого типа"
      )
    } while (this.tokens.at().type === TokenType.Int && this.tokens.notEOF())

    this.tokens.expect(TokenType.Colon, `После меток должно стоять ":"`)

    const ident = this.tokens.expect(
      TokenType.Identifier,
      `После ":" должно следовать название переменной`
    )

    this.tokens.expect(
      TokenType.Allocation,
      `После названия переменной должен стоять знак "=:"`
    )

    const rhs = this.parseExpression()

    return new VariableDeclarationStatement(ident.value, rhs)
  }

  private parseExpression(): Expression {
    return this.parseLogicalExpression()
  }

  private parseLogicalExpression(): Expression {
    let left = this.parseAddiviteExpression()

    while (
      this.tokens.at().type === TokenType.LogicalOperator &&
      this.tokens.notEOF()
    ) {
      const operation = this.tokens.eat().value
      const right = this.parseAddiviteExpression()
      left = new BinaryExpression(left, right, operation)
    }

    return left
  }

  private parseAddiviteExpression(): Expression {
    let left = this.parseMultiplicativeExpression()

    while (
      this.tokens.at().type === TokenType.AdditiveOperator &&
      this.tokens.notEOF()
    ) {
      const operation = this.tokens.eat().value
      const right = this.parseMultiplicativeExpression()
      left = new BinaryExpression(left, right, operation)
    }

    return left
  }

  private parseMultiplicativeExpression(): Expression {
    let left = this.parseUnaryExpression()

    while (
      this.tokens.at().type === TokenType.MultiplicativeOperator &&
      this.tokens.notEOF()
    ) {
      const operation = this.tokens.eat().value
      const right = this.parseUnaryExpression()
      left = new BinaryExpression(left, right, operation)
    }

    return left
  }

  private parseUnaryExpression(): Expression {
    if (this.tokens.check(TokenType.AdditiveOperator)) {
      const operator = this.tokens.eat()
      const value = this.parseFunctionExpression()
      return new UnaryExpression(value, operator.value)
    }
    return this.parseFunctionExpression()
  }

  private parseFunctionExpression(): Expression {
    const functions: Token[] = []
    while (this.tokens.check(TokenType.Function) && this.tokens.notEOF()) {
      functions.push(this.tokens.eat())
    }
    let inner = this.parsePrimaryExpression()
    while (functions.length > 0) {
      inner = new FunctionExpression(inner, functions.pop()!)
    }
    return inner
  }

  private parsePrimaryExpression(): Expression {
    const token = this.tokens.at()
    switch (token.type) {
      case TokenType.Identifier:
        return new IdentifierExpression(this.tokens.eat().value)
      case TokenType.Int:
        return new NumericExpression(parseInt(this.tokens.eat().value))
      case TokenType.Float:
        return new NumericExpression(parseFloat(this.tokens.eat().value))
      default:
        throw new CompileError(`Неизвестный токен`, token)
    }
  }

  parse(tokens: Tokens): Program {
    this.tokens = tokens
    const program = new Program([])

    this.tokens.expect(
      TokenType.Begin,
      `Программа должна начинаться словом "Начало"`
    )

    this.parseSets()

    while (!tokens.check(TokenType.End) && tokens.notEOF()) {
      program.boby.push(this.parseStatement())
    }

    this.tokens.expect(
      TokenType.End,
      `Программа должна заканчиваться словом "Конец"`
    )

    this.tokens.expect(
      TokenType.EOF,
      `После слова "Конец" ничего не должно следовать`
    )

    return program
  }
}
