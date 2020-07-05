export default class Network {
}

Network.get = async (path, options) => {
  const urlParams = Object.entries(options.params || []).map((item) => `${item[0]}=${item[1]}`).join('&');
  const url = `${path}?${urlParams}`;
  // eslint-disable-next-line no-return-await
  return await fetch(url);
};

Network.post = async (path, options) => {
  // eslint-disable-next-line no-return-await
  const response = await fetch(path, {
    method: 'post',
    body: JSON.stringify(options),
  });
  return response.json();
};

Network.json = async (...args) => {
  const response = await Network.get(...args);
  return response.json();
};
