import { Token } from "./tokens.ts"

export class SyntexError extends Error {
  constructor(message: string, public from: number, public to: number) {
    super(message)
  }
}

export class CompileError extends Error {
  constructor(message: string, public token: Token) {
    super(message)
  }
}
