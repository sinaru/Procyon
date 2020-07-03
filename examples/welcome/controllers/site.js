import { Controller } from '/dist/procyon.js';

export default class extends Controller {
  async welcome() {
    this.addStyle('site/index');
    await this.render('site/welcome');
  }

  async about() {
    await this.render('site/about');
  }
}
