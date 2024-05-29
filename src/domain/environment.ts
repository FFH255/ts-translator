import { RuntimeValue } from "./interpreter.ts"

export class Environment {
  private variables = new Map<string, RuntimeValue>()

  constructor(private parent?: Environment) {}

  declare(name: string, value: RuntimeValue): RuntimeValue {
    if (this.variables.has(name)) {
      throw new Error()
    }
    this.variables.set(name, value)
    return value
  }

  assign(name: string, value: RuntimeValue): RuntimeValue {
    const env = this.resolve(name)
    env.variables.set(name, value)
    return value
  }

  resolve(name: string): Environment {
    if (this.variables.has(name)) {
      return this
    }
    if (this.parent === undefined) {
      throw new Error() // TODO: throw named error
    }
    return this.parent.resolve(name)
  }
}
