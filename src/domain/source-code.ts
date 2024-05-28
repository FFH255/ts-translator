export class SourceCode {
  private readonly symbols: string[]

  constructor(input: string) {
    this.symbols = input.split("")
  }

  notEOF(): boolean {
    return !!this.symbols.length
  }

  at(): string {
    return this.symbols[0]
  }

  eat(): string {
    return this.symbols.shift() || ""
  }
}
