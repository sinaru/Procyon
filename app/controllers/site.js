import defaultExport from '../../lib/controller.js'

export default class SiteController extends defaultExport{
  async welcome() {
    await this.render('site/welcome')
  }
}
