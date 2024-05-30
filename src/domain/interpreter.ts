import {
  BinaryExpression,
  NumericExpression,
  Program,
  Statement,
} from "./ast.ts"
import { Environment } from "./environment.ts"
import { IdentifierExpression } from "./ast.ts"

const enum ValueType {
  Number,
}

export class RuntimeValue {
  constructor(public type: ValueType) {}
}

export class NumberValue extends RuntimeValue {
  constructor(public value: number) {
    super(ValueType.Number)
  }
}

export class Interpreter {
  private evaluateProgram(program: Program, env: Environment): RuntimeValue {
    let last: RuntimeValue | null = null

    for (const statement of program.boby) {
      last = this.interpret(statement, env)
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

  private evaluateBinaryExpression(
    exp: BinaryExpression,
    env: Environment
  ): RuntimeValue {
    const lhs = this.interpret(exp.left, env)
    const rhs = this.interpret(exp.right, env)
    if (lhs instanceof NumberValue && rhs instanceof NumberValue) {
      return this.evaluateNumericBinaryExpression(lhs, rhs, exp.operator)
    }
    throw new Error()
  }

  private evaluateIdentifier(
    exp: IdentifierExpression,
    env: Environment
  ): RuntimeValue {
    return env.lookup(exp.value)
  }

  interpret(astNode: Statement, env: Environment): RuntimeValue {
    if (astNode instanceof NumericExpression) {
      return new NumberValue(astNode.value)
    } else if (astNode instanceof BinaryExpression) {
      return this.evaluateBinaryExpression(astNode, env)
    } else if (astNode instanceof Program) {
      return this.evaluateProgram(astNode, env)
    } else if (astNode instanceof IdentifierExpression) {
      return this.evaluateIdentifier(astNode, env)
    }
    throw new Error() // TODO: throw custom error
  }
}
