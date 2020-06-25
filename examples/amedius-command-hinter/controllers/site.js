import BaseController from './base.js';
import Code from '../models/code.js';

export default class extends BaseController {
  async index() {
    const code = new Code();
    this.addStyle('site/index');
    await this.render('site/index', { model: code });
  }

  async about() {
    await this.render('site/about');
  }
}
