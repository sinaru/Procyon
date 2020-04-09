export default class DataModelError extends Error {
  constructor(model, ...args) {
    super(...args);
  }
}
