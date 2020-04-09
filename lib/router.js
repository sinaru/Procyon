import { Resource } from './resource.js'

class Router {
  constructor () {

  }

  async whenReady () {
    const jsonUrl = xapp.relativeUrl('routes.json')
    const response = await fetch(jsonUrl)
    this.routes = await response.json()
  }

  resource () {
    const routeKey = this.hasPath() ? this.pathParam() : '/'
    const routeObj = this.routes[routeKey]
    const controller = routeObj['controller']
    const action = routeObj['action']
    return new Resource(controller, action)
  }

  args() {
    const routeKey = this.hasPath() ? this.pathParam() : '/'
    const routeObj = this.routes[routeKey]
    if(!routeObj.args) return []

    return routeObj.args.flatMap((item) => {
      return xapp.param(item.param)
    })
  }

  pathParam() {
    return xapp.url().searchParams.get('path')
  }

  hasPath() {
    return this.pathParam()
  }
}

export { Router }
