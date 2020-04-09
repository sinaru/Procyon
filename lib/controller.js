class Controller {
  get layout () {
    return 'basic'
  }

  async performAction(action, ...args) {
    await this[action](...args)
  }

  async render (view, options) {
    const module = await import(`/pwa/app/views/${view}.js`)
    const vi = new module.default(options)
    await vi.render()
    await this.renderToPage({content: vi.el })
  }

  async renderToPage(data) {
    const response = await fetch(xapp.relativeUrl(`app/layouts/${this.layout}.html`))
    const layoutHtml = await response.text()
    this.el = document.createElement('div')
    this.el.innerHTML = layoutHtml
    for (let [key, value] of Object.entries(data)) {
      this.el.querySelector(`div[data-hook="${key}"]`).replaceWith(value)
    }
    xapp.appendElement(this.el)
  }
}

export { Controller }
