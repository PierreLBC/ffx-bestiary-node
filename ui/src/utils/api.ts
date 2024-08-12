const { VITE_API_URL: API_URL } = import.meta.env

export async function get(requestedEndpoint: string, payload?: Record<string, string>) {
  const url = buildUrl(requestedEndpoint)
  const urLParams = payload ? new URLSearchParams(payload) : ''
  const initOptions = { headers: getHeaders() }

  return fetch(`${url}?${urLParams}`, initOptions)
}

export async function post(requestEndpoint: string, payload: any): Promise<Response> {
  const url = buildUrl(requestEndpoint)

  return fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(payload)
  })
}

function buildUrl(requestedEndpoint: string) {
  return API_URL + (requestedEndpoint.startsWith('/') ? requestedEndpoint : '/' + requestedEndpoint)
}

function getHeaders(): HeadersInit {
  const headers: HeadersInit = { 'Content-Type': 'application/json' }
  const token = localStorage.getItem('jwt-token')

  if (token) {
    headers['x-access-token'] = token
  }

  return headers
}
