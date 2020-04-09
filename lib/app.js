import './imports.js'
import { Router } from './router.js'

function require (files) {
  if ('string' == typeof files) return requireOne(files)

  return Promise.all((files).map(file => requireOne(file)))
}

function requireOne (file) {
  const script = document.createElement('script')
  return new Promise((resolve) => {
    script.onload = resolve
    script.src = file
    document.head.appendChild(script)
  })
}

class App {
  constructor () {
    this._classReferences = {}
    this.setBootUrl()
    this.setBasePath()
    this.boot()
      .then(() => this.prepareRequest())
      .then(() => this.processRequest())
  }

  async boot () {
    await this.loadLib()
    this.route = new Router()
    await this.route.whenReady()
  }

  async prepareRequest() {
    const resource = this.route.resource()
    await resource.load()
  }

  async processRequest () {
    const resource = this.route.resource()
    const module = await import(`/pwa/app/controllers/${resource.className()}.js`)
    const controller = new module.default;
    const returnVal = controller.performAction(resource.methodName(), ...this.route.args())
    if (returnVal instanceof Promise) {
      await returnVal
    }
  }

  async loadLib () {
    await require([
      'vendor/ejs.js',
      'vendor/axios.min.js'
    ])
  }

  basePath () {
    return this._basePath
  }

  setBootUrl() {
    this._bootUrl = window.location;
  }

  setBasePath () {
    const url = this._bootUrl
    this._basePath = `${url.protocol}//${url.host}/${url.pathname.split('/')[1]}`
  }

  baseUrl() {
    return new URL(this.basePath())
  }

  pathUrl(path, params = {}) {
    const url = this.relativeUrl('index.html')
    url.searchParams.set('path', path)
    for(let [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value)
    }
    return url.href;
  }

  relativeUrl (url) {
    return new URL(`${this.basePath()}/${url}`)
  }

  appendClass(className, classDef) {
    this._classReferences[className] = classDef;
  }

  classDef(className) {
    return this._classReferences[className];
  }

  url () {
    return new URL(window.location.href)
  }

  rootElement() {
    return document.querySelector('#app');
  }

  appendElement(el) {
    this.rootElement().append(el)
  }

  visit(path, params) {
    const url = this.relativeUrl('index.html')
    url.searchParams.set('path', path)
    for(let [key, value] of Object.entries(params)) {
      url.searchParams.set(key, value)
    }
    window.location = url
  }

  param(name) {
    const url = new URL(window.location)
    return url.searchParams.get(name)
  }
}

window.xapp = window.xapp ? window.xapp : new App()
