export default class Controller {
  constructor () {
    this.styles = [];
  }
  static get layout() {
    return 'basic';
  }

  async performAction(action, ...args) {
    await this[action](...args);
    if(this.styles.length > 0) {
      procyon.addStyles(this.styles)
    }
  }

  async render(view, options) {
    const module = await import(`${procyon.subPath()}/${procyon.appFolder}/views/${view}.js`);
    const Klass = module.default;
    const vi = new Klass(options);
    await vi.render();
    await this.renderToPage({ content: vi.el });
    return vi;
  }

  async renderToPage(data) {
    const response = await fetch(procyon.relativeUrl(`${procyon.appFolder}/layouts/${this.constructor.layout}.html`));
    const layoutHtml = await response.text();
    this.el = document.createElement('div');
    this.el.innerHTML = layoutHtml;
    Object.entries(data).forEach(([key, value]) => {
      this.el.querySelector(`div[data-hook="${key}"]`).replaceWith(value);
    });
    procyon.appendElement(this.el);
  }

  addStyle(stylePath) {
    this.styles.push(stylePath);
  }
}
