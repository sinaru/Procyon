export default class Network {
}

Network.get = async (path, options) => {
  const urlParams = Object.entries(options.params || []).map((item) => `${item[0]}=${item[1]}`).join('&');
  const url = `${path}?${urlParams}`;
  // eslint-disable-next-line no-return-await
  return await fetch(url);
};

Network.jsonPost = async (path, options) => {
  const response = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(options),
  });
  return response.json();
};

Network.jsonGet = async (...args) => {
  const response = await Network.get(...args);
  return response.json();
};
