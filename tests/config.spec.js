import Config from '../src/config'

const config = new Config();

test('.api is undefined when not specified', () => {
  expect(config.apiUrl).toBeNull()
})

