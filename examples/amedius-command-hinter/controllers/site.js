import BaseController from './base.js';

export default class extends BaseController {
  async index() {
    this.addStyle('site/index');
    await this.render('site/index');
  }

  async about() {
    await this.render('site/about');
  }
}
