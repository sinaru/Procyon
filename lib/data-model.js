class DataModel {
  constructor(attr = {}) {
    this.__eventObj__ = document.createElement('div'); // to have an event emitter
    this.attributes = attr;
  }

  get savePath () {
    return `${this.apiHref}/post`
  }

  get updatePath () {
    return `${this.apiHref}/put`
  }

  get getPath() {
    return `${this.apiHref}/get`;
  }

  get deletePath() {
    return `${this.apiHref}/delete`;
  }

  get batchPath () {
    return `${this.apiHref}/batch`
  }

  get apiHref() {
    return `${procyon.config.apiUrl}${this.constructor.name.toLowerCase()}`;
  }

  static async find(id) {
    const obj = new this();
    const response = await axios.get(obj.getPath, { params: { id } });
    obj.object2attr(response.data);
    return obj;
  }

  get(name) {
    return this.attributes[name];
  }

  set(name, value) {
    this.attributes[name] = value;
  }

  object2attr(object) {
    this.attributes = object;
  }

  async save() {
    try {
      const response = this.isNew()
        ? await axios.post(this.savePath, this.attributes)
        : await axios.post(this.updatePath, this.attributes);
      this.object2attr(response.data);
      this.dispatch('saved');
    } catch (e) {
      if (e.isAxiosError) throw e; // todo handle

      const module = await import('./data-model-error.js');
      const ErrorKlass = module.default;
      throw new ErrorKlass(this, 'Failed to save record');
    }
  }

  async delete() {
    try {
      const response = await axios.get(this.deletePath, { params: { id: this.get('id') } });
      return true
    } catch (e) {
      return false;
    }
  }

  isNew() {
    return !Object.prototype.hasOwnProperty.call(this.attributes, 'id');
  }

  when(eventName) {
    return new Promise(resolve => {
      this.__eventObj__.addEventListener(eventName, resolve)
    })
  }

  dispatch(eventName) {
    this.__eventObj__.dispatchEvent(new Event(eventName))
  }
}

DataModel.all = async function () {
  const model = new this()
  const response = await axios.get(model.batchPath, { params: { action: 'all' } })
  return response.data.map((item) => new this(item))
}

DataModel.count = async function () {
  const models = await this.all()
  return models.length
}

export default DataModel;
