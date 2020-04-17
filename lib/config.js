class Config {
  constructor (configJson = {}) {
    if (configJson.api) this.apiUrl = new URL(configJson.api);
  }
}

export default Config;
