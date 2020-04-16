class Config {
  constructor (configJson) {
    this.apiUrl = new URL(configJson.api);
  }
}

export default Config;
