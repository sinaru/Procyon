class Resource {
  constructor(controller, action) {
    this.controller = controller;
    this.action = action;
  }

  async load() {
    const path = this.relativePath()
    await import(path)
  }

  relativePath() {
    return `/pwa/app/controllers/${this.controller}.js`;
  }

  classDef() {
    return xapp.classDef(this.controller);
  }

  className() {
    return this.controller;
  }

  methodName() {
    return this.action;
  }


}

export { Resource }
