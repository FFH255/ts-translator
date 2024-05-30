import {
  BinaryExpression,
  FunctionExpression,
  IdentifierExpression,
  NumericExpression,
  Program,
  Statement,
  UnaryExpression,
  VariableDeclarationStatement,
} from "./ast.ts"
import { Environment } from "./environment.ts"

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
    if (operator === "+") {
      result = lhs.value + rhs.value
    } else if (operator === "-") {
      result = lhs.value - rhs.value
    } else if (operator === "*") {
      result = lhs.value * rhs.value
    } else if (operator === "/") {
      // TODO: Division by zero checks
      result = lhs.value / rhs.value
    } else if (operator === "||") {
      result = lhs.value || rhs.value
    } else if (operator === "&&") {
      result = lhs.value && rhs.value
    } else {
      throw new Error() // TODO: throw named error
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

  private evaluateUnaryExpression(
    exp: UnaryExpression,
    env: Environment
  ): RuntimeValue {
    const value = this.interpret(exp.value, env)
    if (!(value instanceof NumberValue)) {
      throw new Error() // throw named error
    }
    switch(exp.operator) {
      case "-":
        return new NumberValue(-1 * value.value)
      case "+": 
        return new NumberValue(value.value)
      default:
        throw new Error() // TODO: throw named error
    }
  }

  private evaluateIdentifier(
    exp: IdentifierExpression,
    env: Environment
  ): RuntimeValue {
    return env.lookup(exp.value)
  }

  private evaluateVariable(
    astNode: VariableDeclarationStatement,
    env: Environment
  ): RuntimeValue {
    const value = this.interpret(astNode.value, env)
    env.declare(astNode.identifier, value)
    return value
  }

  private evaluateFunction(
    exp: FunctionExpression,
    env: Environment
  ): RuntimeValue {
    const value = this.interpret(exp.inner, env)
    if (!(value instanceof NumberValue)) {
      throw new Error() // TODO: throw named error
    }
    switch (exp.operation.value) {
      case "Синус":
        return new NumberValue(Math.sin(value.value))
      case "Косинус":
        return new NumberValue(Math.cos(value.value))
      case "Тангенс":
        return new NumberValue(Math.tan(value.value))
      default:
        throw new Error() // TODO: throw named error
    }
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
    } else if (astNode instanceof VariableDeclarationStatement) {
      return this.evaluateVariable(astNode, env)
    } else if (astNode instanceof UnaryExpression) {
      return this.evaluateUnaryExpression(astNode, env)
    } else if (astNode instanceof FunctionExpression) {
      return this.evaluateFunction(astNode, env)
    }
    throw new Error() // TODO: throw custom error
  }
}
