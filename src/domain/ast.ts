export const enum NodeType {
  Programm,
  Numeric,
  Identifier,
  BinaryExpression,
}

export class Statement {
  constructor(public kind: NodeType) {}
}

export class Program extends Statement {
  constructor(public boby: Statement[]) {
    super(NodeType.Programm)
  }
}

export class Expression extends Statement {}

export class NumericExpression extends Expression {
  constructor(public value: number) {
    super(NodeType.Numeric)
  }
}

export class IdentifierExpression extends Expression {
  constructor(public value: string) {
    super(NodeType.Identifier)
  }
}

export class BinaryExpression extends Expression {
  constructor(
    public left: Expression,
    public right: Expression,
    public operator: string
  ) {
    super(NodeType.BinaryExpression)
  }
}
