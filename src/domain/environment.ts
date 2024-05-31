import { RuntimeValue } from "./interpreter.ts"

export class Environment {
  private variables = new Map<string, RuntimeValue>()

  declare(name: string, value: RuntimeValue): RuntimeValue {
    if (this.variables.has(name)) {
      throw new Error(`Переменная ${name} уже объявлена`)
    }
    this.variables.set(name, value)
    return value
  }

  assign(name: string, value: RuntimeValue): RuntimeValue {
    this.variables.set(name, value)
    return value
  }

  lookup(name: string): RuntimeValue {
    const value = this.variables.get(name)
    if (!value) {
      throw new Error(`Не удалось найти переменную "${name}"`)
    }
    return value
  }

  getVars(): Map<string, RuntimeValue> {
    return this.variables
  }
}
