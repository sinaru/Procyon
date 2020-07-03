const RenderState = {
  NOT_RENDERED: 'not_rendered',
  RENDERED: 'rendered',
  RENDERING: 'rendering',
};

class View {
  constructor(options = {}) {
    this.components = options.components;
    this.data = options.data;
    this.model = options.model;
    this.bindedElements = [];
    this.renderState = RenderState.NOT_RENDERED;
  }

  /* eslint class-methods-use-this: "off" */
  bindings() {}

  get templateData() {
    return { model: this.model, ...this.data };
  }

  async render() {
    if (this.renderState === RenderState.RENDERING) return;
    if (!this.el) {
      this.el = document.createElement('div');
    }
    this.renderState = RenderState.RENDERING;
    const templatesStr = await this.templateStr();
    this.template = ejs.compile(templatesStr);
    this.HTML = this.template(this.templateData);
    this.el.innerHTML = this.HTML;
    if (this.components) {
      Object.entries(this.components).forEach(async (item) => {
        await item[1].render();
        const el = this.el.querySelector(`[data-component="${item[0]}"]`);
        el.replaceWith(item[1].el);
      });
    }
    this.bindings();
    this.renderState = RenderState.RENDERED;
  }

  bind(selector, event, handler) {
    const el = this.el.querySelector(selector);
    this.addToBindedElements(el);
    el[event] = async (ev) => {
      await handler.bind(this)(ev);
    };
  }

  async bindRender() {
    if (this.hasFocus()) {
      await new Promise((resolve) => {
        setTimeout(async () => {
          await this.bindRender();
          resolve();
        }, 500);
      });
    }
    await this.render();
  }

  hasFocus() {
    const { activeElement } = document;
    return this.bindedElements.some((el) => el === activeElement);
  }

  addToBindedElements(el) {
    this.bindedElements.push(el);
  }

  async templateStr() {
    if (this.cachedTemplateStr) return this.cachedTemplateStr;
    const response = await fetch(procyon.relativeUrl(`${procyon.appFolder}/templates/${this.templatePath}.ejs`));
    this.cachedTemplateStr = await response.text();
    return this.cachedTemplateStr;
  }
}

export default View;
