import Resource from './resource.js';

class Router {
  static pathParam() {
    return xapp.constructor.currentURL.searchParams.get('path');
  }

  async whenReady() {
    const jsonUrl = xapp.relativeUrl('routes.json');
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

    return routeObj.args.flatMap((item) => xapp.constructor.param(item.param));
  }

  hasPath() {
    return this.constructor.pathParam();
  }
}

export default Router;
