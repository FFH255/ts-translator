import {
  BinaryExpression,
  NumericExpression,
  Program,
  Statement,
} from "./ast.ts"

const enum ValueType {
  Number,
}

export class RuntimeValue {
  constructor(public type: ValueType) {}
}

class NumberValue extends RuntimeValue {
  constructor(public value: number) {
    super(ValueType.Number)
  }
}

export class Interpreter {
  private evaluateProgram(program: Program): RuntimeValue {
    let last: RuntimeValue | null = null

    for (const statement of program.boby) {
      last = this.interpret(statement)
    }

    if (last === null) {
      throw new Error()
    }

    return last
  }

  private evaluateNumericBinaryExpression(
    lhs: NumberValue,
    rhs: NumberValue,
    operator: string
  ): NumberValue {
    let result: number
    if (operator == "+") {
      result = lhs.value + rhs.value
    } else if (operator == "-") {
      result = lhs.value - rhs.value
    } else if (operator == "*") {
      result = lhs.value * rhs.value
    } else if (operator == "/") {
      // TODO: Division by zero checks
      result = lhs.value / rhs.value
    } else {
      result = lhs.value % rhs.value
    }

    return new NumberValue(result)
  }

  private evaluateBinaryExpression(exp: BinaryExpression): RuntimeValue {
    const lhs = this.interpret(exp.left)
    const rhs = this.interpret(exp.right)
    if (lhs instanceof NumberValue && rhs instanceof NumberValue) {
      return this.evaluateNumericBinaryExpression(lhs, rhs, exp.operator)
    }
    throw new Error()
  }

  interpret(astNode: Statement): RuntimeValue {
    if (astNode instanceof NumericExpression) {
      return new NumberValue(astNode.value)
    } else if (astNode instanceof BinaryExpression) {
      return this.evaluateBinaryExpression(astNode)
    } else if (astNode instanceof Program) {
      return this.evaluateProgram(astNode)
    }
    throw new Error() // TODO: throw custom error
  }
}
