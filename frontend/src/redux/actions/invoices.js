import { api } from "./auth"

export const GET_INVOICES_PAGE = "GET_INVOICES_PAGE"
export const GET_INVOICES_BY_WORK = "GET_INVOICES_BY_WORK"
export const CREATE_INVOICE = "CREATE_INVOICE"
export const UPDATE_INVOICE = "UPDATE_INVOICE"
export const DELETE_INVOICE = "DELETE_INVOICE"
export const INVOICES_ERROR = "INVOICES_ERROR"

export const getInvoicesPageAction = (params) => (dispatch) => {
  return api
    .get("/invoices", params)
    .then((page) => {
      dispatch({ type: GET_INVOICES_PAGE, payload: page })
      return page
    })
    .catch((err) => {
      dispatch({ type: INVOICES_ERROR, payload: err.message })
      throw err
    })
}

export const getInvoicesByWorkAction = (workId) => (dispatch) => {
  return api
    .get(`/invoices/work/${workId}`)
    .then((invoices) => {
      dispatch({ type: GET_INVOICES_BY_WORK, payload: invoices })
      return invoices
    })
    .catch((err) => {
      dispatch({ type: INVOICES_ERROR, payload: err.message })
      throw err
    })
}

export const createInvoiceAction = (payload) => (dispatch) => {
  return api
    .post("/invoices", payload)
    .then(({ invoiceId }) => api.get(`/invoices/${invoiceId}`))
    .then((created) => {
      dispatch({ type: CREATE_INVOICE, payload: created })
      return created
    })
    .catch((err) => {
      dispatch({ type: INVOICES_ERROR, payload: err.message })
      throw err
    })
}

export const updateInvoiceStatusAction = (invoiceId, status) => (dispatch) => {
  return api
    .patch(`/invoices/${invoiceId}/status`, { status })
    .then((updated) => {
      dispatch({ type: UPDATE_INVOICE, payload: updated })
      return updated
    })
    .catch((err) => {
      dispatch({ type: INVOICES_ERROR, payload: err.message })
      throw err
    })
}

export const deleteInvoiceAction = (invoiceId) => (dispatch) => {
  return api
    .delete(`/invoices/${invoiceId}`)
    .then(() => {
      dispatch({ type: DELETE_INVOICE, payload: invoiceId })
    })
    .catch((err) => {
      dispatch({ type: INVOICES_ERROR, payload: err.message })
      throw err
    })
}
