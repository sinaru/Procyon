import Resource from './resource.js';

class Router {
  static pathParam() {
    return procyon.constructor.currentURL.searchParams.get('path');
  }

  async whenReady() {
    const jsonUrl = procyon.appUrl('routes.json');
    const response = await fetch(jsonUrl);
    this.routes = await response.json();
  }

  resource() {
    const routeKey = this.hasPath() ? this.constructor.pathParam() : '/';
    const routeObj = this.routes[routeKey];
    const { controller } = routeObj;
    const { action } = routeObj;
    return new Resource(controller, action);
  }

  args() {
    const routeKey = this.hasPath() ? this.constructor.pathParam() : '/';
    const routeObj = this.routes[routeKey];
    if (!routeObj.args) return [];

    return routeObj.args.map((item) => procyon.constructor.param(item));
  }

  hasPath() {
    return !!this.constructor.pathParam();
  }

  path() {
    return this.constructor.pathParam();
  }
}

export default Router;
