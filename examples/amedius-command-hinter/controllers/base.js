import { Controller } from '/procyon.js';

export default class BaseController extends Controller {
  performBeforeAction() {
    this.addStyle('bootstrap-4.5.0-dist/css/bootstrap');
    super.performBeforeAction();
  }
}
