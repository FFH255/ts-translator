import {
  BinaryExpression,
  Expression,
  IdentifierExpression,
  NumericExpression,
  Program,
  Statement,
  VariableDeclarationStatement,
} from "./ast.ts"
import { TokenType, Tokens } from "./lexer.ts"

export class Parser {
  private tokens = new Tokens([])

  private parseStatement(): Statement {
    return this.parseVariableDeclaration()
  }

  private parseVariableDeclaration(): Statement {
    if (this.tokens.at().type === TokenType.Identifier) {
      const ident = this.tokens.eat()
      if (this.tokens.at().type === TokenType.Allocation) {
        this.tokens.eat()
        const rhs = this.parseExpression()
        return new VariableDeclarationStatement(ident.value, rhs)
      }
    }
    throw new Error() // throw named error
  }

  private parseExpression(): Expression {
    return this.parseAddiviteExpression()
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
    let left = this.parsePrimaryExpression()

    while (this.tokens.at().type === TokenType.MultiplicativeOperator) {
      const operation = this.tokens.eat().value
      const right = this.parsePrimaryExpression()
      left = new BinaryExpression(left, right, operation)
    }

    return left
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

    while (tokens.notEOF()) {
      program.boby.push(this.parseStatement())
    }

    return program
  }
}
