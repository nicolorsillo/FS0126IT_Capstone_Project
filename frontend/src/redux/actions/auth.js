const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001"

const TOKEN_KEY = "oc_token"

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

export class ApiError extends Error {
  constructor(message, status, errorsList) {
    super(message)
    this.status = status
    this.errorsList = errorsList
  }
}

function buildQuery(params) {
  if (!params) return ""
  const search = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "")
      search.set(key, value)
  })
  const query = search.toString()
  return query ? `?${query}` : ""
}

async function request(
  path,
  { method = "GET", body, params, isForm = false } = {},
) {
  const headers = {}
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`
  if (body !== undefined && !isForm)
    headers["Content-Type"] = "application/json"

  const response = await fetch(`${BASE_URL}${path}${buildQuery(params)}`, {
    method,
    headers,
    body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
  })

  if (response.status === 204) return null

  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    const message =
      data?.message || "Si è verificato un errore imprevisto. Riprova."
    throw new ApiError(message, response.status, data?.errorsList)
  }

  return data
}

export const api = {
  get: (path, params) => request(path, { method: "GET", params }),
  post: (path, body, opts = {}) =>
    request(path, { method: "POST", body, ...opts }),
  put: (path, body, opts = {}) =>
    request(path, { method: "PUT", body, ...opts }),
  patch: (path, params) => request(path, { method: "PATCH", params }),
  patchBody: (path, body) => request(path, { method: "PATCH", body }),
  delete: (path) => request(path, { method: "DELETE" }),
  deleteBody: (path, body) => request(path, { method: "DELETE", body }),
}

export const SET_USER = "SET_USER"
export const CLEAR_USER = "CLEAR_USER"
export const SET_INITIALIZING = "SET_INITIALIZING"
export const AUTH_ERROR = "AUTH_ERROR"

export const bootstrapAuthAction = () => (dispatch) => {
  if (!getToken()) return Promise.resolve()

  return api
    .get("/users/me")
    .then((me) => dispatch({ type: SET_USER, payload: me }))
    .catch(() => {
      setToken(null)
      dispatch({ type: CLEAR_USER })
    })
    .finally(() => dispatch({ type: SET_INITIALIZING, payload: false }))
}

export const loginAction = (email, password) => (dispatch) => {
  return api
    .post("/auth/login", { email, password })
    .then(({ accessToken }) => {
      setToken(accessToken)
      return api.get("/users/me")
    })
    .then((me) => {
      dispatch({ type: SET_USER, payload: me })
      return me
    })
    .catch((err) => {
      dispatch({ type: AUTH_ERROR, payload: err.message })
      throw err
    })
}

export const registerAction = (payload) => (dispatch) => {
  return api.post("/auth/register", payload).catch((err) => {
    dispatch({ type: AUTH_ERROR, payload: err.message })
    throw err
  })
}

export const logoutAction = () => (dispatch) => {
  setToken(null)
  dispatch({ type: CLEAR_USER })
}

export const refreshAuthAction = () => (dispatch) => {
  return api.get("/users/me").then((me) => {
    dispatch({ type: SET_USER, payload: me })
    return me
  })
}
