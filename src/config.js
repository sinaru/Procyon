class Config {
  constructor(configJson = {}) {
    this.apiUrl = null;
    if (configJson.api) this.apiUrl = new URL(configJson.api);
  }
}

export default Config;
