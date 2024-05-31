import { CompileError } from "./errors.ts"
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

export class Position {
  constructor(public from: number, public to: number) {}
}

export class Token extends Position {
  constructor(
    public type: TokenType,
    public value: string,
    from: number,
    to: number
  ) {
    super(from, to)
  }
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

  expect(type: TokenType | TokenType[], errorMessage: string): Token {
    const prev = this.tokens.shift() as Token
    if (Array.isArray(type)) {
      if (!prev || !type.includes(prev.type)) {
        throw new CompileError(errorMessage, prev)
      }
      return prev
    } else {
      if (!prev || prev.type != type) {
        throw new CompileError(errorMessage, prev)
      }

      return prev
    }
  }

  check(type: TokenType): boolean {
    return this.tokens[0].type === type
  }
}
