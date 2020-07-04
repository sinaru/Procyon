import { View } from '/dist/procyon.js';


export default class IndexView extends View {
  bindings() {
    this.bind('#content', 'onchange', this.onContentChange);
    this.bind('#submit', 'onclick', this.onSubmit);
  }

  async onSubmit() {
    await this.model.save();
  }

  onContentChange(event) {
    this.model.set('content', event.target.value);
  }
}

IndexView.templatePath = 'notes/index';
