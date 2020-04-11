import './imports.js';
import Router from './router.js';

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
  constructor(appFolder = 'app') {
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
    const returnVal = controller.performAction(resource.methodName(), ...this.route.args());
    if (returnVal instanceof Promise) {
      await returnVal;
    }
  }

  static async loadLib() {
    await requireFiles([
      'vendor/ejs.js',
      'vendor/axios.min.js',
    ]);
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

  visit(path, params) {
    const url = this.relativeUrl('index.html');
    url.searchParams.set('path', path);
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    window.location = url;
  }

  addStyles(stylePaths) {
    stylePaths.forEach((style) => {
      const styleUrl = this.appUrl(`styles/${style}.css`)
      const cssTag = document.createElement( "link" );
      cssTag.rel = "stylesheet";
      cssTag.href = styleUrl.href;
      document.head.append(cssTag);
    })
  }
}

export default App;
