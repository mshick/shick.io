import { FetchError } from '../errors'

export const get = (url: string, options: RequestInit = {}) =>
  fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Content-Type': 'application/json'
    }
  }).then(async (res) => {
    if (!res.ok) {
      const info = await res.json()
      throw new FetchError('An error occurred while fetching the data.', {
        info,
        status: res.status
      })
    }

    return res.json()
  })
