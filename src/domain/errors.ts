export class SyntexError extends Error {
  constructor(message: string, public from: number, public to: number) {
    super(message)
  }
}
