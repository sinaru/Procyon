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

class Router {
  static pathParam() {
    return procyon.constructor.currentURL.searchParams.get('path');
  }

  static anchor() {
    return procyon.constructor.currentURL.hash.substring(1);
  }

  static hasAnchor() {
    return !!procyon.constructor.currentURL.hash;
  }

  async whenReady() {
    const jsonUrl = procyon.appUrl('routes.json');
    const response = await fetch(jsonUrl);
    this.routes = await response.json();
  }

  resource() {
    const routeObj = this.routeReference();
    const { controller } = routeObj;
    const { action } = routeObj;
    return new Resource(controller, action);
  }

  args() {
    const routeObj = this.routeReference();
    if (!routeObj.args) return [];

    return routeObj.args.map((item) => procyon.constructor.param(item));
  }

  routeReference() {
    let routeKey = '/';
    if (this.hasPath()) routeKey = this.constructor.pathParam();
    else if (this.constructor.hasAnchor()) routeKey = this.constructor.anchor();
    return this.routes[routeKey];
  }

  hasPath() {
    return !!this.constructor.pathParam();
  }

  path() {
    return this.constructor.pathParam();
  }
}

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

class Controller {
  constructor() {
    this.styles = [];
  }

  static get layout() {
    return 'basic';
  }

  // eslint-disable-next-line class-methods-use-this
  performBeforeAction() {
  }

  async performAction(action, ...args) {
    await this[action](...args);
    if (this.styles.length > 0) {
      procyon.addStyles(this.styles);
    }
  }

  async render(view, options) {
    const module = await import(`${procyon.subPath()}/${procyon.appFolder}/views/${view}.js`);
    const Klass = module.default;
    const vi = new Klass(options);
    await vi.render();
    vi.el.dataset.path = procyon.route.path();
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

class DataModel {
  constructor(attr = {}) {
    this.emitter = document.createElement('div'); // to have an event emitter
    this.attributes = attr;
  }

  get savePath() {
    return `${this.apiHref}/post`;
  }

  get updatePath() {
    return `${this.apiHref}/put`;
  }

  get getPath() {
    return `${this.apiHref}/get`;
  }

  get deletePath() {
    return `${this.apiHref}/delete`;
  }

  get batchPath() {
    return `${this.apiHref}/batch`;
  }

  get apiHref() {
    return `${procyon.config.apiUrl}${this.constructor.name.toLowerCase()}`;
  }

  static async find(id) {
    const obj = new this();
    const response = await axios.get(obj.getPath, { params: { id } });
    obj.object2attr(response.data);
    return obj;
  }

  get(name) {
    return this.attributes[name];
  }

  set(name, value) {
    this.attributes[name] = value;
  }

  object2attr(object) {
    this.attributes = object;
  }

  async save() {
    try {
      const response = this.isNew()
        ? await axios.post(this.savePath, this.attributes)
        : await axios.post(this.updatePath, this.attributes);
      this.object2attr(response.data);
      this.dispatch('saved');
    } catch (e) {
      if (e.isAxiosError) throw e; // todo handle

      const module = await Promise.resolve().then(function () { return dataModelError; });
      const ErrorKlass = module.default;
      throw new ErrorKlass(this, 'Failed to save record');
    }
  }

  async delete() {
    try {
      await axios.get(this.deletePath, { params: { id: this.get('id') } });
      return true;
    } catch (e) {
      return false;
    }
  }

  isNew() {
    return !Object.prototype.hasOwnProperty.call(this.attributes, 'id');
  }

  when(eventName) {
    return new Promise((resolve) => {
      this.emitter.addEventListener(eventName, resolve, { once: true });
    });
  }

  dispatch(eventName) {
    this.emitter.dispatchEvent(new Event(eventName));
  }
}

DataModel.all = async function () {
  const model = new this();
  const response = await axios.get(model.batchPath, { params: { action: 'all' } });
  return response.data.map((item) => new this(item));
};

DataModel.count = async function () {
  const models = await this.all();
  return models.length;
};

class List extends View {
  constructor(options = { size: 2 }) {
    super();
    this.index = parseInt(procyon.constructor.param('page') || 0, 0);
    this.length = options.length;
    this.size = options.size;
    this.loader = options.loader;
    this.html = options.html;
    this.showLink = options.showLink;
    this.deleteLink = options.deleteLink;
    if (options.cssClass) this.cssClass = options.cssClass;
  }

  async render() {
    if (!this.el) {
      this.el = document.createElement('div');
      this.el.classList.add('list-component');
      if (this.cssClass) {
        this.el.classList.add(this.cssClass);
      }
    }

    await this.renderItems();
    await this.renderPagination();
  }

  async renderItems() {
    if (!this.content) {
      this.content = document.createElement('div');
      this.content.classList.add('items');
      this.el.appendChild(this.content);
    } else {
      this.content.innerHTML = '';
    }
    const items = await this.loader(this.index * this.size, this.size);
    items.forEach((item) => this.renderItem(item));
  }

  renderItem(item) {
    const el = this.html(item);
    el.classList.add('item');
    const show = document.createElement('div');
    show.classList.add('btn-group');
    show.classList.add('btn-group-sm');
    show.setAttribute('role', 'group');
    const showEl = this.showLinkEl(item);
    const delEl = this.deleteLinkEl(item);
    show.appendChild(showEl);
    show.appendChild(delEl);
    el.appendChild(show);
    this.content.appendChild(el);
  }

  deleteLinkEl(item) {
    const deleteLink = this.deleteLink(item);
    return this.constructor.link(deleteLink, 'Delete');
  }

  showLinkEl(item) {
    const showLink = this.showLink(item);
    return this.constructor.link(showLink, 'View');
  }

  static link(showLink, text) {
    const link = document.createElement('a');
    link.innerHTML = text;
    link.classList.add('btn');
    link.classList.add('btn-secondary');
    link.href = showLink;
    return link;
  }

  async renderPagination() {
    if (!this.pagination) {
      this.pagination = document.createElement('nav');
      this.pagination.classList.add('pagination-wrapper');
      const ul = document.createElement('ul');
      ul.classList.add('pagination');
      this.pagination.appendChild(ul);
      this.el.appendChild(this.pagination);
    }
    this.pagination.querySelectorAll('a').forEach((link) => link.remove());
    const ul = this.pagination.querySelector('ul');
    let times = 0;
    const len = await this.length();
    for (let i = 0; i < len; i += this.size) {
      const link = document.createElement('a');
      link.classList.add('page-link');
      link.setAttribute('data-index', times);
      link.innerText = `${times + 1}`;
      link.setAttribute('href', '#');
      link.onclick = this.onPaginationClick.bind(this);
      const li = document.createElement('li');
      li.classList.add('page-item');
      if (times === this.index) {
        li.classList.add('current', 'active');
      }
      li.setAttribute('data-index', times);
      li.appendChild(link);
      ul.appendChild(li);
      times += 1;
    }
  }

  onPaginationClick(event) {
    this.pagination.querySelectorAll('li.current').forEach((el) => el.classList.remove('current', 'active'));
    event.target.classList.add('current', 'active');
    event.target.parentElement.classList.add('current', 'active');
    this.index = parseInt(event.target.dataset.index, 0);
    this.renderItems().then(() => {});
    event.preventDefault();
  }
}

class Config {
  constructor(configJson = {}) {
    this.apiUrl = null;
    if (configJson.api) this.apiUrl = new URL(configJson.api);
  }
}

function requireOne(file) {
  const script = document.createElement('script');
  return new Promise((resolve) => {
    script.onload = resolve;
    script.src = file;
    document.head.appendChild(script);
  });
}

function requireFiles(files) {
  if (typeof files === 'string') return requireOne(files);

  return Promise.all((files).map((file) => requireOne(file)));
}

class App {
  constructor(appFolder = 'app', config = {}) {
    this.config = new Config(config);
    this.appFolder = appFolder;
    this.classReferences = {};
    this.setBootUrl();
    this.setBasePath();
    this.boot()
      .then(() => this.prepareRequest())
      .then(() => this.processRequest());
    window.procyon = this;
  }

  static get currentURL() {
    return new URL(window.location.href);
  }

  static get rootElement() {
    return document.querySelector('#app');
  }

  static param(name) {
    const url = new URL(window.location);
    return url.searchParams.get(name);
  }

  async boot() {
    await this.constructor.loadLib();
    this.route = new Router();
    await this.route.whenReady();
  }

  async prepareRequest() {
    const resource = this.route.resource();
    await resource.load();
  }

  async processRequest() {
    const resource = this.route.resource();
    const module = await import(`${procyon.subPath()}/${this.appFolder}/controllers/${resource.className()}.js`);
    const ControllerKlass = module.default;
    const controller = new ControllerKlass();
    try {
      controller.performBeforeAction();
      const returnVal = controller.performAction(resource.methodName(), ...this.route.args());
      if (returnVal instanceof Promise) {
        await returnVal;
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(`Procyon: ${e.message}`);
      throw e;
    }
  }

  static async loadLib() {
    await requireFiles([
      'vendor/ejs.js',
      'vendor/axios.min.js',
    ]);
  }

  static reload() {
    window.location.reload();
  }

  basePath() {
    return this.cachedBasePath;
  }

  setBootUrl() {
    this.bootUrl = window.location;
  }

  subPath() {
    const url = new URL(this.bootUrl);
    return url.pathname.split('/').slice(0, -1).join('/');
  }

  setBasePath() {
    const url = this.bootUrl;
    this.cachedBasePath = `${url.protocol}//${url.host}`;
  }

  baseUrl() {
    return new URL(this.basePath());
  }

  pathUrl(path, params = {}) {
    const url = new URL(this.bootUrl.origin + this.bootUrl.pathname);
    url.searchParams.set('path', path);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    return url.href;
  }

  relativeUrl(url) {
    return new URL(`${this.basePath()}/${url}`);
  }

  appUrl(url) {
    return new URL(`${this.basePath()}/${this.appFolder}/${url}`);
  }

  appendClass(className, classDef) {
    this.classReferences[className] = classDef;
  }

  classDef(className) {
    return this.classReferences[className];
  }

  appendElement(el) {
    this.constructor.rootElement.append(el);
  }

  visit(path, params = {}) {
    window.location = this.pathUrl(path, params);
  }

  addStyles(stylePaths) {
    stylePaths.forEach((style) => {
      const styleUrl = this.appUrl(`styles/${style}.css`);
      const cssTag = document.createElement('link');
      cssTag.rel = 'stylesheet';
      cssTag.href = styleUrl.href;
      document.head.append(cssTag);
    });
  }
}

class DataModelError extends Error {
  constructor(model, ...args) {
    super(...args);
  }
}

var dataModelError = /*#__PURE__*/Object.freeze({
  __proto__: null,
  'default': DataModelError
});

export { App, Controller, DataModel, List, View };
