import Resource from './resource.js';

class Router {
  static pathParam() {
    return procyon.constructor.currentURL.searchParams.get('path');
  }

  static anchor() {
    return procyon.constructor.currentURL.hash.substring(1);
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
    let routeKey = '/'
    if (this.hasPath()) routeKey = this.constructor.pathParam();
    else if(this.hasAnchor()) routeKey = this.constructor.anchor();
    return this.routes[routeKey];
  }

  hasPath() {
    return !!this.constructor.pathParam();
  }

  hasAnchor() {
    return !!procyon.constructor.currentURL.hash;
  }

  path() {
    return this.constructor.pathParam();
  }
}

export default Router;
