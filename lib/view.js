const RenderState = {
  NOT_RENDERED: 'not_rendered',
  RENDERED: 'rendered',
  RENDERING: 'rendering'
}

class View {
  constructor (options = {}) {
    this.components = options.components
    this.data = options.data
    this.model = options.model
    this._bindedEls = []
    this.renderState = RenderState.NOT_RENDERED
  }

  bindings () {

  }

  get templateData () {
    return { model: this.model, ...this.data }
  }

  async render () {
    if (this.renderState === RenderState.RENDERING) return
    if(!this.el) {
      this.el = document.createElement('div')
    }
    this.renderState = RenderState.RENDERING
    const templatesStr = await this.templateStr()
    this.template = ejs.compile(templatesStr)
    this.HTML = this.template(this.templateData)
    this.el.innerHTML = this.HTML
    if(this.components) {
      for(const   item of Object.entries(this.components)) {
        await item[1].render()
        const el = this.el.querySelector(`[data-component="${item[0]}"]`)
        el.replaceWith(item[1].el)
      }
    }
    this.bindings()
    this.renderState = RenderState.RENDERED
  }

  bind (selector, event, handler) {
    const el = this.el.querySelector(selector)
    this.addToBindedElements(el)
    el[event] = async (ev) => {
      await handler.bind(this)(ev)
      // await this.bindRender()
    }
  }

  async bindRender () {
    if (this.hasFocus()) {
      await new Promise(resolve => {
        setTimeout(async () => {
          await this.bindRender()
          resolve()
        }, 500)
      })
    }
    await this.render()
  }

  hasFocus () {
    const activeElement = document.activeElement
    return this._bindedEls.some((el) => {
      return el === activeElement
    })
  }

  addToBindedElements (el) {
    this._bindedEls.push(el)
  }

  async templateStr () {
    if (this._templateStr) return this._templateStr
    const response = await fetch(xapp.relativeUrl(`app/templates/${this.templatePath}.ejs`))
    this._templateStr = await response.text()
    return this._templateStr
  }
}

export { View }
