export class SourceCode {
  private readonly symbols: string[]
  private readonly length: number

  constructor(input: string) {
    this.symbols = input.split("")
    this.length = input.length
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

  position(): number {
    return this.length - this.symbols.length
  }

  check(str: string): boolean {
    return str.split("").every((char, i) => char === this.symbols[i])
  }
}
