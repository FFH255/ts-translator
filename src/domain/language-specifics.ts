export const enum TokenType {
  Begin,
  End,
  Identifier,
  Equals,
  BinaryOperation,
  Plus,
  Minus,
}

export type Keywords = { [key: string]: TokenType }

export const KEYWORDS: Keywords = {
  Начало: TokenType.Begin,
  "Конец синтеза": TokenType.End,
  "=": TokenType.Equals,
  "+": TokenType.Plus,
  "-": TokenType.Minus,
}
