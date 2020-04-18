import View from '/lib/view.js'

export default class IndexView extends View {
  get templatePath() {
    return 'notes/index'
  }

  bindings() {
    this.bind('#content', 'onchange', this.onContentChange)
    this.bind('#submit', 'onclick', this.onSubmit)
  }

  async onSubmit(event) {
    await this.model.save()
  }

  onContentChange(event) {
    this.model.set('content', event.target.value)
  }
}
