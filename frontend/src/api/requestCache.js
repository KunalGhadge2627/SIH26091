const dataCache = new Map();
const requestCache = new Map();

export const readCachedData = (key) => dataCache.get(key) || null;

export const getCachedRequest = (key, request) => {
  if (dataCache.has(key)) return Promise.resolve(dataCache.get(key));
  if (requestCache.has(key)) return requestCache.get(key);

  const pendingRequest = request()
    .then((data) => {
      dataCache.set(key, data);
      requestCache.delete(key);
      return data;
    })
    .catch((error) => {
      requestCache.delete(key);
      throw error;
    });

  requestCache.set(key, pendingRequest);
  return pendingRequest;
};
