import defaultExport from '/lib/controller.js'

export default class SiteController extends defaultExport{
  async welcome() {
    this.addStyle('site/index')
    await this.render('site/welcome')
  }
}
