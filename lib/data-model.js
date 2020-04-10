class DataModel {
  constructor(attr = {}) {
    this.attributes = attr;
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
    } catch (e) {
      if (e.isAxiosError) throw e; // todo handle

      const module = await import('./data-model-error.js');
      const ErrorKlass = module.default;
      throw new ErrorKlass(this, 'Failed to save record');
    }
  }

  isNew() {
    return !Object.prototype.hasOwnProperty.call(this.attributes, 'id');
  }
}

export default DataModel;
