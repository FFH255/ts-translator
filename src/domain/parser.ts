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
    this.tokens.expect([TokenType.StartAnalysis, TokenType.StartSynthesis], "")
    do {
      this.tokens.expect(TokenType.Float, "")
    } while (this.tokens.check(TokenType.Float))
    this.tokens.expect([TokenType.EndAnalysis, TokenType.EndSynthesis], "")
  }

  private parseVariableDeclaration(): Statement {
    do {
      this.tokens.expect(TokenType.Int, "")
    } while (this.tokens.at().type === TokenType.Int)

    this.tokens.expect(TokenType.Colon, "")

    const ident = this.tokens.expect(TokenType.Identifier, "")

    this.tokens.expect(TokenType.Allocation, "")

    const rhs = this.parseExpression()

    return new VariableDeclarationStatement(ident.value, rhs)
  }

  private parseExpression(): Expression {
    return this.parseLogicalExpression()
  }

  private parseLogicalExpression(): Expression {
    let left = this.parseAddiviteExpression()

    while (this.tokens.at().type === TokenType.LogicalOperator) {
      const operation = this.tokens.eat().value
      const right = this.parseAddiviteExpression()
      left = new BinaryExpression(left, right, operation)
    }

    return left
  }

  private parseAddiviteExpression(): Expression {
    let left = this.parseMultiplicativeExpression()

    while (this.tokens.at().type === TokenType.AdditiveOperator) {
      const operation = this.tokens.eat().value
      const right = this.parseMultiplicativeExpression()
      left = new BinaryExpression(left, right, operation)
    }

    return left
  }

  private parseMultiplicativeExpression(): Expression {
    let left = this.parseUnaryExpression()

    while (this.tokens.at().type === TokenType.MultiplicativeOperator) {
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
    while (this.tokens.check(TokenType.Function)) {
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
        throw new Error(`Неизвестный токен ${token.type} ${token.value}`)
    }
  }

  parse(tokens: Tokens): Program {
    this.tokens = tokens
    const program = new Program([])

    this.tokens.expect(TokenType.Begin, "")

    this.parseSets()

    while (!tokens.check(TokenType.End)) {
      program.boby.push(this.parseStatement())
    }

    this.tokens.expect(TokenType.End, "")

    this.tokens.expect(TokenType.EOF, "")

    return program
  }
}
