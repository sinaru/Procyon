import { Controller } from '../../lib/controller.js'

export default class SiteController extends Controller{
  async welcome() {
    await this.render('site/welcome')
  }
}
