class Resource {
  constructor(controller, action) {
    this.controller = controller;
    this.action = action;
  }

  async load() {
    const path = this.relativePath();
    await import(path);
  }

  relativePath() {
    return `${procyon.subPath()}/${procyon.appFolder}/controllers/${this.controller}.js`;
  }

  classDef() {
    return procyon.classDef(this.controller);
  }

  className() {
    return this.controller;
  }

  methodName() {
    return this.action;
  }
}

export default Resource;
