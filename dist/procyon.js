/******/ (function(modules) { // webpackBootstrap
/******/ 	// install a JSONP callback for chunk loading
/******/ 	function webpackJsonpCallback(data) {
/******/ 		var chunkIds = data[0];
/******/ 		var moreModules = data[1];
/******/
/******/
/******/ 		// add "moreModules" to the modules object,
/******/ 		// then flag all "chunkIds" as loaded and fire callback
/******/ 		var moduleId, chunkId, i = 0, resolves = [];
/******/ 		for(;i < chunkIds.length; i++) {
/******/ 			chunkId = chunkIds[i];
/******/ 			if(Object.prototype.hasOwnProperty.call(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 				resolves.push(installedChunks[chunkId][0]);
/******/ 			}
/******/ 			installedChunks[chunkId] = 0;
/******/ 		}
/******/ 		for(moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				modules[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(parentJsonpFunction) parentJsonpFunction(data);
/******/
/******/ 		while(resolves.length) {
/******/ 			resolves.shift()();
/******/ 		}
/******/
/******/ 	};
/******/
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading chunks
/******/ 	// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 	// Promise = chunk loading, 0 = chunk loaded
/******/ 	var installedChunks = {
/******/ 		"main": 0
/******/ 	};
/******/
/******/
/******/
/******/ 	// script path function
/******/ 	function jsonpScriptSrc(chunkId) {
/******/ 		return __webpack_require__.p + "" + chunkId + ".procyon.js"
/******/ 	}
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/ 	// This file contains only the entry chunk.
/******/ 	// The chunk loading function for additional chunks
/******/ 	__webpack_require__.e = function requireEnsure(chunkId) {
/******/ 		var promises = [];
/******/
/******/
/******/ 		// JSONP chunk loading for javascript
/******/
/******/ 		var installedChunkData = installedChunks[chunkId];
/******/ 		if(installedChunkData !== 0) { // 0 means "already installed".
/******/
/******/ 			// a Promise means "currently loading".
/******/ 			if(installedChunkData) {
/******/ 				promises.push(installedChunkData[2]);
/******/ 			} else {
/******/ 				// setup Promise in chunk cache
/******/ 				var promise = new Promise(function(resolve, reject) {
/******/ 					installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 				});
/******/ 				promises.push(installedChunkData[2] = promise);
/******/
/******/ 				// start chunk loading
/******/ 				var script = document.createElement('script');
/******/ 				var onScriptComplete;
/******/
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.src = jsonpScriptSrc(chunkId);
/******/
/******/ 				// create error before stack unwound to get useful stacktrace later
/******/ 				var error = new Error();
/******/ 				onScriptComplete = function (event) {
/******/ 					// avoid mem leaks in IE.
/******/ 					script.onerror = script.onload = null;
/******/ 					clearTimeout(timeout);
/******/ 					var chunk = installedChunks[chunkId];
/******/ 					if(chunk !== 0) {
/******/ 						if(chunk) {
/******/ 							var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 							var realSrc = event && event.target && event.target.src;
/******/ 							error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 							error.name = 'ChunkLoadError';
/******/ 							error.type = errorType;
/******/ 							error.request = realSrc;
/******/ 							chunk[1](error);
/******/ 						}
/******/ 						installedChunks[chunkId] = undefined;
/******/ 					}
/******/ 				};
/******/ 				var timeout = setTimeout(function(){
/******/ 					onScriptComplete({ type: 'timeout', target: script });
/******/ 				}, 120000);
/******/ 				script.onerror = script.onload = onScriptComplete;
/******/ 				document.head.appendChild(script);
/******/ 			}
/******/ 		}
/******/ 		return Promise.all(promises);
/******/ 	};
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// on error function for async loading
/******/ 	__webpack_require__.oe = function(err) { console.error(err); throw err; };
/******/
/******/ 	var jsonpArray = window["webpackJsonp"] = window["webpackJsonp"] || [];
/******/ 	var oldJsonpFunction = jsonpArray.push.bind(jsonpArray);
/******/ 	jsonpArray.push = webpackJsonpCallback;
/******/ 	jsonpArray = jsonpArray.slice();
/******/ 	for(var i = 0; i < jsonpArray.length; i++) webpackJsonpCallback(jsonpArray[i]);
/******/ 	var parentJsonpFunction = oldJsonpFunction;
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src lazy recursive":
/*!***********************************!*\
  !*** ./src lazy namespace object ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function webpackEmptyAsyncContext(req) {\n\t// Here Promise.resolve().then() is used instead of new Promise() to prevent\n\t// uncaught exception popping up in devtools\n\treturn Promise.resolve().then(function() {\n\t\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\t\te.code = 'MODULE_NOT_FOUND';\n\t\tthrow e;\n\t});\n}\nwebpackEmptyAsyncContext.keys = function() { return []; };\nwebpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;\nmodule.exports = webpackEmptyAsyncContext;\nwebpackEmptyAsyncContext.id = \"./src lazy recursive\";\n\n//# sourceURL=webpack:///./src_lazy_namespace_object?");

/***/ }),

/***/ "./src lazy recursive ^.*\\/.*\\/controllers\\/.*\\.js$":
/*!*****************************************************************!*\
  !*** ./src lazy ^.*\/.*\/controllers\/.*\.js$ namespace object ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function webpackEmptyAsyncContext(req) {\n\t// Here Promise.resolve().then() is used instead of new Promise() to prevent\n\t// uncaught exception popping up in devtools\n\treturn Promise.resolve().then(function() {\n\t\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\t\te.code = 'MODULE_NOT_FOUND';\n\t\tthrow e;\n\t});\n}\nwebpackEmptyAsyncContext.keys = function() { return []; };\nwebpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;\nmodule.exports = webpackEmptyAsyncContext;\nwebpackEmptyAsyncContext.id = \"./src lazy recursive ^.*\\\\/.*\\\\/controllers\\\\/.*\\\\.js$\";\n\n//# sourceURL=webpack:///./src_lazy_^.*\\/.*\\/controllers\\/.*\\.js$_namespace_object?");

/***/ }),

/***/ "./src lazy recursive ^.*\\/.*\\/views\\/.*\\.js$":
/*!***********************************************************!*\
  !*** ./src lazy ^.*\/.*\/views\/.*\.js$ namespace object ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("function webpackEmptyAsyncContext(req) {\n\t// Here Promise.resolve().then() is used instead of new Promise() to prevent\n\t// uncaught exception popping up in devtools\n\treturn Promise.resolve().then(function() {\n\t\tvar e = new Error(\"Cannot find module '\" + req + \"'\");\n\t\te.code = 'MODULE_NOT_FOUND';\n\t\tthrow e;\n\t});\n}\nwebpackEmptyAsyncContext.keys = function() { return []; };\nwebpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;\nmodule.exports = webpackEmptyAsyncContext;\nwebpackEmptyAsyncContext.id = \"./src lazy recursive ^.*\\\\/.*\\\\/views\\\\/.*\\\\.js$\";\n\n//# sourceURL=webpack:///./src_lazy_^.*\\/.*\\/views\\/.*\\.js$_namespace_object?");

/***/ }),

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _imports_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./imports.js */ \"./src/imports.js\");\n/* harmony import */ var _router_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./router.js */ \"./src/router.js\");\n/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./config.js */ \"./src/config.js\");\n\n\n\n\nfunction requireOne(file) {\n  const script = document.createElement('script');\n  return new Promise((resolve) => {\n    script.onload = resolve;\n    script.src = file;\n    document.head.appendChild(script);\n  });\n}\n\nfunction requireFiles(files) {\n  if (typeof files === 'string') return requireOne(files);\n\n  return Promise.all((files).map((file) => requireOne(file)));\n}\n\nclass App {\n  constructor(appFolder = 'app', config = {}) {\n    this.config = new _config_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"](config);\n    this.appFolder = appFolder;\n    this.classReferences = {};\n    this.setBootUrl();\n    this.setBasePath();\n    this.boot()\n      .then(() => this.prepareRequest())\n      .then(() => this.processRequest());\n    window.procyon = this;\n  }\n\n  static get currentURL() {\n    return new URL(window.location.href);\n  }\n\n  static get rootElement() {\n    return document.querySelector('#app');\n  }\n\n  static param(name) {\n    const url = new URL(window.location);\n    return url.searchParams.get(name);\n  }\n\n  async boot() {\n    await this.constructor.loadLib();\n    this.route = new _router_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]();\n    await this.route.whenReady();\n  }\n\n  async prepareRequest() {\n    const resource = this.route.resource();\n    await resource.load();\n  }\n\n  async processRequest() {\n    const resource = this.route.resource();\n    const module = await __webpack_require__(\"./src lazy recursive ^.*\\\\/.*\\\\/controllers\\\\/.*\\\\.js$\")(`${procyon.subPath()}/${this.appFolder}/controllers/${resource.className()}.js`);\n    const ControllerKlass = module.default;\n    const controller = new ControllerKlass();\n    try {\n      controller.performBeforeAction();\n      const returnVal = controller.performAction(resource.methodName(), ...this.route.args());\n      if (returnVal instanceof Promise) {\n        await returnVal;\n      }\n    } catch (e) {\n      console.error(`Procyon: ${e.message}`)\n      throw e\n    }\n  }\n\n  static async loadLib() {\n    await requireFiles([\n      'vendor/ejs.js',\n      'vendor/axios.min.js',\n    ]);\n  }\n\n  basePath() {\n    return this.cachedBasePath;\n  }\n\n  setBootUrl() {\n    this.bootUrl = window.location;\n  }\n\n  subPath() {\n    const url = new URL(this.bootUrl);\n    return url.pathname.split('/').slice(0, -1).join('/');\n  }\n\n  setBasePath() {\n    const url = this.bootUrl;\n    this.cachedBasePath = `${url.protocol}//${url.host}`;\n  }\n\n  baseUrl() {\n    return new URL(this.basePath());\n  }\n\n  pathUrl(path, params = {}) {\n    const url = new URL(this.bootUrl.origin + this.bootUrl.pathname);\n    url.searchParams.set('path', path);\n    Object.entries(params).forEach(([key, value]) => {\n      url.searchParams.set(key, value);\n    });\n    return url.href;\n  }\n\n  relativeUrl(url) {\n    return new URL(`${this.basePath()}/${url}`);\n  }\n\n  appUrl(url) {\n    return new URL(`${this.basePath()}/${this.appFolder}/${url}`);\n  }\n\n  appendClass(className, classDef) {\n    this.classReferences[className] = classDef;\n  }\n\n  classDef(className) {\n    return this.classReferences[className];\n  }\n\n  appendElement(el) {\n    this.constructor.rootElement.append(el);\n  }\n\n  visit(path, params = {}) {\n    window.location = this.pathUrl(path, params);\n  }\n\n  reload() {\n    window.location.reload();\n    window.location.reload();\n  }\n\n  addStyles(stylePaths) {\n    stylePaths.forEach((style) => {\n      const styleUrl = this.appUrl(`styles/${style}.css`)\n      const cssTag = document.createElement( \"link\" );\n      cssTag.rel = \"stylesheet\";\n      cssTag.href = styleUrl.href;\n      document.head.append(cssTag);\n    })\n  }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (App);\n\n\n//# sourceURL=webpack:///./src/app.js?");

/***/ }),

/***/ "./src/components/list.js":
/*!********************************!*\
  !*** ./src/components/list.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _view_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../view.js */ \"./src/view.js\");\n\n\nclass List extends _view_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"] {\n  constructor (options = { size: 2 }) {\n    super()\n    this.index = parseInt(procyon.constructor.param('page') || 0, 0)\n    this.length = options.length\n    this.size = options.size\n    this.loader = options.loader\n    this.html = options.html\n    this.showLink = options.showLink\n    this.deleteLink = options.deleteLink\n    if (options.cssClass) this.cssClass = options.cssClass\n  }\n\n  async render () {\n    if (!this.el) {\n      this.el = document.createElement('div')\n      this.el.classList.add('list-component')\n      if (this.cssClass) {\n        this.el.classList.add(this.cssClass)\n      }\n    }\n\n    await this.renderItems()\n    await this.renderPagination()\n  }\n\n  async renderItems () {\n    if (!this.content) {\n      this.content = document.createElement('div')\n      this.content.classList.add('items')\n      this.el.appendChild(this.content)\n    } else {\n      this.content.innerHTML = ''\n    }\n    const items = await this.loader(this.index * this.size, this.size)\n    items.forEach((item) => this.renderItem(item))\n  }\n\n  renderItem (item) {\n    const el = this.html(item)\n    el.classList.add('item')\n    const show = document.createElement('div')\n    show.classList.add('btn-group')\n    show.classList.add('btn-group-sm')\n    show.setAttribute('role', 'group')\n    const showEl = this.showLinkEl(item)\n    const delEl = this.deleteLinkEl(item)\n    show.appendChild(showEl)\n    show.appendChild(delEl)\n    el.appendChild(show)\n    this.content.appendChild(el)\n  }\n\n  deleteLinkEl (item) {\n    const deleteLink = this.deleteLink(item)\n    return this.link(deleteLink, 'Delete')\n  }\n\n  showLinkEl (item) {\n    const showLink = this.showLink(item)\n    return this.link(showLink, 'View')\n  }\n\n  link (showLink, text) {\n    const link = document.createElement('a')\n    link.innerHTML = text\n    link.classList.add('btn')\n    link.classList.add('btn-secondary')\n    link.href = showLink\n    return link\n  }\n\n  async renderPagination () {\n    if (!this.pagination) {\n      this.pagination = document.createElement('nav')\n      this.pagination.classList.add('pagination-wrapper')\n      const ul = document.createElement('ul')\n      ul.classList.add('pagination')\n      this.pagination.appendChild(ul)\n      this.el.appendChild(this.pagination)\n    }\n    this.pagination.querySelectorAll('a').forEach((link) => link.remove())\n    const ul = this.pagination.querySelector('ul')\n    let times = 0\n    const len = await this.length()\n    for (let i = 0; i < len; i += this.size) {\n      const link = document.createElement('a');\n      link.classList.add('page-link')\n      link.setAttribute('data-index', times)\n      link.innerText = `${times + 1}`\n      link.setAttribute('href', '#')\n      link.onclick = this.onPaginationClick.bind(this)\n      const li = document.createElement('li')\n      li.classList.add('page-item')\n      if (times === this.index) {\n        li.classList.add('current', 'active')\n      }\n      li.setAttribute('data-index', times)\n      li.appendChild(link)\n      ul.appendChild(li)\n      times += 1\n    }\n  }\n\n  onPaginationClick (event) {\n    this.pagination.querySelectorAll('li.current').forEach((el) => el.classList.remove('current', 'active'))\n    event.target.classList.add('current', 'active')\n    event.target.parentElement.classList.add('current', 'active')\n    this.index = parseInt(event.target.dataset.index, 0)\n    this.renderItems().then(() => {})\n    event.preventDefault()\n  }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (List);\n\n\n//# sourceURL=webpack:///./src/components/list.js?");

/***/ }),

/***/ "./src/config.js":
/*!***********************!*\
  !*** ./src/config.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nclass Config {\n  constructor (configJson = {}) {\n    this.apiUrl = null;\n    if (configJson.api) this.apiUrl = new URL(configJson.api);\n  }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Config);\n\n\n//# sourceURL=webpack:///./src/config.js?");

/***/ }),

/***/ "./src/controller.js":
/*!***************************!*\
  !*** ./src/controller.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"default\", function() { return Controller; });\nclass Controller {\n  constructor () {\n    this.styles = [];\n  }\n  static get layout() {\n    return 'basic';\n  }\n\n  performBeforeAction() {\n  }\n\n  async performAction(action, ...args) {\n    await this[action](...args);\n    if(this.styles.length > 0) {\n      procyon.addStyles(this.styles)\n    }\n  }\n\n  async render(view, options) {\n    const module = await __webpack_require__(\"./src lazy recursive ^.*\\\\/.*\\\\/views\\\\/.*\\\\.js$\")(`${procyon.subPath()}/${procyon.appFolder}/views/${view}.js`);\n    const Klass = module.default;\n    const vi = new Klass(options);\n    await vi.render();\n    vi.el.dataset.path = procyon.route.path();\n    await this.renderToPage({ content: vi.el });\n    return vi;\n  }\n\n  async renderToPage(data) {\n    const response = await fetch(procyon.relativeUrl(`${procyon.appFolder}/layouts/${this.constructor.layout}.html`));\n    const layoutHtml = await response.text();\n    this.el = document.createElement('div');\n    this.el.innerHTML = layoutHtml;\n    Object.entries(data).forEach(([key, value]) => {\n      this.el.querySelector(`div[data-hook=\"${key}\"]`).replaceWith(value);\n    });\n    procyon.appendElement(this.el);\n  }\n\n  addStyle(stylePath) {\n    this.styles.push(stylePath);\n  }\n}\n\n\n//# sourceURL=webpack:///./src/controller.js?");

/***/ }),

/***/ "./src/data-model.js":
/*!***************************!*\
  !*** ./src/data-model.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nclass DataModel {\n  constructor(attr = {}) {\n    this.emitter = document.createElement('div'); // to have an event emitter\n    this.attributes = attr;\n  }\n\n  get savePath() {\n    return `${this.apiHref}/post`;\n  }\n\n  get updatePath() {\n    return `${this.apiHref}/put`;\n  }\n\n  get getPath() {\n    return `${this.apiHref}/get`;\n  }\n\n  get deletePath() {\n    return `${this.apiHref}/delete`;\n  }\n\n  get batchPath() {\n    return `${this.apiHref}/batch`;\n  }\n\n  get apiHref() {\n    return `${procyon.config.apiUrl}${this.constructor.name.toLowerCase()}`;\n  }\n\n  static async find(id) {\n    const obj = new this();\n    const response = await axios.get(obj.getPath, { params: { id } });\n    obj.object2attr(response.data);\n    return obj;\n  }\n\n  get(name) {\n    return this.attributes[name];\n  }\n\n  set(name, value) {\n    this.attributes[name] = value;\n  }\n\n  object2attr(object) {\n    this.attributes = object;\n  }\n\n  async save() {\n    try {\n      const response = this.isNew()\n        ? await axios.post(this.savePath, this.attributes)\n        : await axios.post(this.updatePath, this.attributes);\n      this.object2attr(response.data);\n      this.dispatch('saved');\n    } catch (e) {\n      if (e.isAxiosError) throw e; // todo handle\n\n      const module = await __webpack_require__.e(/*! import() */ 0).then(__webpack_require__.bind(null, /*! ./data-model-error.js */ \"./src/data-model-error.js\"));\n      const ErrorKlass = module.default;\n      throw new ErrorKlass(this, 'Failed to save record');\n    }\n  }\n\n  async delete() {\n    try {\n      const response = await axios.get(this.deletePath, { params: { id: this.get('id') } });\n      return true;\n    } catch (e) {\n      return false;\n    }\n  }\n\n  isNew() {\n    return !Object.prototype.hasOwnProperty.call(this.attributes, 'id');\n  }\n\n  when(eventName) {\n    return new Promise((resolve) => {\n      this.emitter.addEventListener(eventName, resolve, { once: true });\n    });\n  }\n\n  dispatch(eventName) {\n    this.emitter.dispatchEvent(new Event(eventName));\n  }\n}\n\nDataModel.all = async function () {\n  const model = new this();\n  const response = await axios.get(model.batchPath, { params: { action: 'all' } });\n  return response.data.map((item) => new this(item));\n};\n\nDataModel.count = async function () {\n  const models = await this.all();\n  return models.length;\n};\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (DataModel);\n\n\n//# sourceURL=webpack:///./src/data-model.js?");

/***/ }),

/***/ "./src/imports.js":
/*!************************!*\
  !*** ./src/imports.js ***!
  \************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _resource_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./resource.js */ \"./src/resource.js\");\n/* harmony import */ var _router_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./router.js */ \"./src/router.js\");\n/* harmony import */ var _view_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./view.js */ \"./src/view.js\");\n/* harmony import */ var _controller_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./controller.js */ \"./src/controller.js\");\n/* harmony import */ var _data_model_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./data-model.js */ \"./src/data-model.js\");\n/* harmony import */ var _components_list_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/list.js */ \"./src/components/list.js\");\n/* harmony import */ var _config_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./config.js */ \"./src/config.js\");\n\n\n\n\n\n\n\n\n\n//# sourceURL=webpack:///./src/imports.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: App, Controller, View */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _app_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app.js */ \"./src/app.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"App\", function() { return _app_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]; });\n\n/* harmony import */ var _controller_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./controller.js */ \"./src/controller.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Controller\", function() { return _controller_js__WEBPACK_IMPORTED_MODULE_1__[\"default\"]; });\n\n/* harmony import */ var _view_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./view.js */ \"./src/view.js\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"View\", function() { return _view_js__WEBPACK_IMPORTED_MODULE_2__[\"default\"]; });\n\n\n\n\n\n\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/resource.js":
/*!*************************!*\
  !*** ./src/resource.js ***!
  \*************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nclass Resource {\n  constructor(controller, action) {\n    this.controller = controller;\n    this.action = action;\n  }\n\n  async load() {\n    const path = this.relativePath();\n    await __webpack_require__(\"./src lazy recursive\")(path);\n  }\n\n  relativePath() {\n    return `${procyon.subPath()}/${procyon.appFolder}/controllers/${this.controller}.js`;\n  }\n\n  classDef() {\n    return procyon.classDef(this.controller);\n  }\n\n  className() {\n    return this.controller;\n  }\n\n  methodName() {\n    return this.action;\n  }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Resource);\n\n\n//# sourceURL=webpack:///./src/resource.js?");

/***/ }),

/***/ "./src/router.js":
/*!***********************!*\
  !*** ./src/router.js ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _resource_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./resource.js */ \"./src/resource.js\");\n\n\nclass Router {\n  static pathParam() {\n    return procyon.constructor.currentURL.searchParams.get('path');\n  }\n\n  static anchor() {\n    return procyon.constructor.currentURL.hash.substring(1);\n  }\n\n  async whenReady() {\n    const jsonUrl = procyon.appUrl('routes.json');\n    const response = await fetch(jsonUrl);\n    this.routes = await response.json();\n  }\n\n  resource() {\n    const routeObj = this.routeReference();\n    const { controller } = routeObj;\n    const { action } = routeObj;\n    return new _resource_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"](controller, action);\n  }\n\n  args() {\n    const routeObj = this.routeReference();\n    if (!routeObj.args) return [];\n\n    return routeObj.args.map((item) => procyon.constructor.param(item));\n  }\n\n  routeReference() {\n    let routeKey = '/'\n    if (this.hasPath()) routeKey = this.constructor.pathParam();\n    else if(this.hasAnchor()) routeKey = this.constructor.anchor();\n    return this.routes[routeKey];\n  }\n\n  hasPath() {\n    return !!this.constructor.pathParam();\n  }\n\n  hasAnchor() {\n    return !!procyon.constructor.currentURL.hash;\n  }\n\n  path() {\n    return this.constructor.pathParam();\n  }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (Router);\n\n\n//# sourceURL=webpack:///./src/router.js?");

/***/ }),

/***/ "./src/view.js":
/*!*********************!*\
  !*** ./src/view.js ***!
  \*********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\nconst RenderState = {\n  NOT_RENDERED: 'not_rendered',\n  RENDERED: 'rendered',\n  RENDERING: 'rendering',\n};\n\nclass View {\n  constructor(options = {}) {\n    this.components = options.components;\n    this.data = options.data;\n    this.model = options.model;\n    this.bindedElements = [];\n    this.renderState = RenderState.NOT_RENDERED;\n  }\n\n  /* eslint class-methods-use-this: \"off\" */\n  bindings() {}\n\n  get templateData() {\n    return { model: this.model, ...this.data };\n  }\n\n  async render() {\n    if (this.renderState === RenderState.RENDERING) return;\n    if (!this.el) {\n      this.el = document.createElement('div');\n    }\n    this.renderState = RenderState.RENDERING;\n    const templatesStr = await this.templateStr();\n    this.template = ejs.compile(templatesStr);\n    this.HTML = this.template(this.templateData);\n    this.el.innerHTML = this.HTML;\n    if (this.components) {\n      Object.entries(this.components).forEach(async (item) => {\n        await item[1].render();\n        const el = this.el.querySelector(`[data-component=\"${item[0]}\"]`);\n        el.replaceWith(item[1].el);\n      });\n    }\n    this.bindings();\n    this.renderState = RenderState.RENDERED;\n  }\n\n  bind(selector, event, handler) {\n    const el = this.el.querySelector(selector);\n    this.addToBindedElements(el);\n    el[event] = async (ev) => {\n      await handler.bind(this)(ev);\n    };\n  }\n\n  async bindRender() {\n    if (this.hasFocus()) {\n      await new Promise((resolve) => {\n        setTimeout(async () => {\n          await this.bindRender();\n          resolve();\n        }, 500);\n      });\n    }\n    await this.render();\n  }\n\n  hasFocus() {\n    const { activeElement } = document;\n    return this.bindedElements.some((el) => el === activeElement);\n  }\n\n  addToBindedElements(el) {\n    this.bindedElements.push(el);\n  }\n\n  async templateStr() {\n    if (this.cachedTemplateStr) return this.cachedTemplateStr;\n    const response = await fetch(procyon.relativeUrl(`${procyon.appFolder}/templates/${this.templatePath}.ejs`));\n    this.cachedTemplateStr = await response.text();\n    return this.cachedTemplateStr;\n  }\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (View);\n\n\n//# sourceURL=webpack:///./src/view.js?");

/***/ })

/******/ });