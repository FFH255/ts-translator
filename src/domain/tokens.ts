/* eslint-disable @typescript-eslint/no-explicit-any */
// deno-lint-ignore-file no-explicit-any
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
  EOF,
  Function,
}

export class Token {
  constructor(public type: TokenType, public value: string) {}
}

export class Tokens {
  constructor(private tokens: Token[]) {}

  notEOF(): boolean {
    return this.tokens[0]?.type !== TokenType.EOF
  }

  at(): Token {
    return this.tokens[0]
  }

  eat(): Token {
    return this.tokens.shift() as Token
  }

  safeExpect(type: TokenType): Token | undefined {
    if (this.tokens[0].type === type) {
      return this.tokens.shift()
    }
  }

  expect(type: TokenType | TokenType[], err: any): Token {
    const prev = this.tokens.shift() as Token
    if (Array.isArray(type)) {
      if (!prev || !type.includes(prev.type)) {
        throw new Error(err) // TODO: throw named error
      }
      return prev
    } else {
      if (!prev || prev.type != type) {
        throw new Error(
          `Ошидалось: ${type}, но встретилось ${prev.type} ${prev.value}`
        ) // TODO: throw named error
      }

      return prev
    }
  }

  check(type: TokenType): boolean {
    return this.tokens[0].type === type
  }
}
