class DataModelError extends Error {
  constructor (model, ...args) {
    super(...args)
    this.model
  }
}

export { DataModelError }
