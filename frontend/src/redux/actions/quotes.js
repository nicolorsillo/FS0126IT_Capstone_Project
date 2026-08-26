import { api } from "./auth"

export const GET_QUOTES_PAGE = "GET_QUOTES_PAGE"
export const GET_QUOTES_BY_WORK = "GET_QUOTES_BY_WORK"
export const CREATE_QUOTE = "CREATE_QUOTE"
export const UPDATE_QUOTE = "UPDATE_QUOTE"
export const DELETE_QUOTE = "DELETE_QUOTE"
export const QUOTES_ERROR = "QUOTES_ERROR"

export const getQuotesPageAction = (params) => (dispatch) => {
  return api
    .get("/quotes", params)
    .then((page) => {
      dispatch({ type: GET_QUOTES_PAGE, payload: page })
      return page
    })
    .catch((err) => {
      dispatch({ type: QUOTES_ERROR, payload: err.message })
      throw err
    })
}

export const getQuotesByWorkAction = (workId) => (dispatch) => {
  return api
    .get(`/quotes/work/${workId}`)
    .then((quotes) => {
      dispatch({ type: GET_QUOTES_BY_WORK, payload: quotes })
      return quotes
    })
    .catch((err) => {
      dispatch({ type: QUOTES_ERROR, payload: err.message })
      throw err
    })
}

export const createQuoteAction = (payload) => (dispatch) => {
  return api
    .post("/quotes", payload)
    .then(({ quoteId }) => api.get(`/quotes/${quoteId}`))
    .then((created) => {
      dispatch({ type: CREATE_QUOTE, payload: created })
      return created
    })
    .catch((err) => {
      dispatch({ type: QUOTES_ERROR, payload: err.message })
      throw err
    })
}

export const updateQuoteStatusAction = (quoteId, status) => (dispatch) => {
  return api
    .patch(`/quotes/${quoteId}/status`, { status })
    .then((updated) => {
      dispatch({ type: UPDATE_QUOTE, payload: updated })
      return updated
    })
    .catch((err) => {
      dispatch({ type: QUOTES_ERROR, payload: err.message })
      throw err
    })
}

export const deleteQuoteAction = (quoteId) => (dispatch) => {
  return api
    .delete(`/quotes/${quoteId}`)
    .then(() => {
      dispatch({ type: DELETE_QUOTE, payload: quoteId })
    })
    .catch((err) => {
      dispatch({ type: QUOTES_ERROR, payload: err.message })
      throw err
    })
}
