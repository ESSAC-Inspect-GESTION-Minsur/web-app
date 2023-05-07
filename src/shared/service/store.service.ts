interface StoreConstructor<T> {
  initialState: T | null
}

export default class StoreService<T extends Record<string, any>> {
  constructor ({ initialState = null }: StoreConstructor<T>) {
    if (initialState === null) return

    const keys: Array<keyof T> = Object.keys(initialState) as Array<keyof T>
    keys.forEach((key) => {
      if (this.getValue(key) !== null) return
      this.setValue(key, initialState[key])
    })
  }

  private isJsonString (str: string): boolean {
    try {
      JSON.parse(str)
    } catch (e) {
      return false
    }
    return true
  }

  private readonly getValue = <K extends keyof T>(key: K): string | null => {
    return localStorage.getItem(String(key))
  }

  private readonly setValue = <K extends keyof T>(key: K, value: Record<string, any>): void => {
    localStorage.setItem(String(key), JSON.stringify(value))
  }

  get = <K extends keyof T>(key: K): T[K] | null => {
    const value = this.getValue(key)

    if (value === null) return null

    return this.isJsonString(value) ? JSON.parse(value) : value
  }

  set = <K extends keyof T>(key: K, value: T[K]): void => {
    this.setValue(key, value)
  }

  remove = <K extends keyof T>(key: K): void => {
    localStorage.removeItem(String(key))
  }
}
