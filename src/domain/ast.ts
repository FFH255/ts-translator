export const enum NodeType {
  Programm,
  Numeric,
  Identifier,
  BinaryExpression,
  UnaryExpression,
  VariableDeclaration,
}

export class Statement {
  constructor(public kind: NodeType) {}
}

export class VariableDeclarationStatement extends Statement {
  constructor(public identifier: string, public value: Expression) {
    super(NodeType.VariableDeclaration)
  }
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

export class UnaryExpression extends Expression {
  constructor(public value: Expression, public operator: string) {
    super(NodeType.UnaryExpression)
  }
}
