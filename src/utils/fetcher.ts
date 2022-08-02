export const get = (url, options: RequestInit = {}) =>
  fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json'
    }
  })
    .then((r) => r.json())
    .catch(() => [])
