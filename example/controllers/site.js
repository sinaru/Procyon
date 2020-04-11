import defaultExport from '/lib/controller'

export default class SiteController extends defaultExport{
  async welcome() {
    await this.render('site/welcome')
  }
}
