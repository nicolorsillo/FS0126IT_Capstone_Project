import { api } from "./auth"

export const GET_WORKS_PAGE = "GET_WORKS_PAGE"
export const GET_MY_WORKS = "GET_MY_WORKS"
export const GET_WORK = "GET_WORK"
export const CREATE_WORK = "CREATE_WORK"
export const UPDATE_WORK = "UPDATE_WORK"
export const DELETE_WORK = "DELETE_WORK"
export const WORKS_ERROR = "WORKS_ERROR"

export const getWorksPageAction = (params) => (dispatch) => {
  return api
    .get("/works", params)
    .then((page) => {
      dispatch({ type: GET_WORKS_PAGE, payload: page })
      return page
    })
    .catch((err) => {
      dispatch({ type: WORKS_ERROR, payload: err.message })
      throw err
    })
}

export const getMyWorksAction = (clientId) => (dispatch) => {
  return api
    .get(`/works/client/${clientId}`)
    .then((works) => {
      dispatch({ type: GET_MY_WORKS, payload: works })
      return works
    })
    .catch((err) => {
      dispatch({ type: WORKS_ERROR, payload: err.message })
      throw err
    })
}

export const getWorkByIdAction = (workId) => (dispatch) => {
  return api
    .get(`/works/${workId}`)
    .then((work) => {
      dispatch({ type: GET_WORK, payload: work })
      return work
    })
    .catch((err) => {
      dispatch({ type: WORKS_ERROR, payload: err.message })
      throw err
    })
}

export const createWorkAction = (payload) => (dispatch) => {
  return api
    .post("/works", payload)
    .then(({ workId }) => api.get(`/works/${workId}`))
    .then((created) => {
      dispatch({ type: CREATE_WORK, payload: created })
      return created
    })
    .catch((err) => {
      dispatch({ type: WORKS_ERROR, payload: err.message })
      throw err
    })
}

export const updateWorkStatusAction = (workId, status) => (dispatch) => {
  return api
    .patch(`/works/${workId}/status`, { status })
    .then((updated) => {
      dispatch({ type: UPDATE_WORK, payload: updated })
      return updated
    })
    .catch((err) => {
      dispatch({ type: WORKS_ERROR, payload: err.message })
      throw err
    })
}

export const deleteWorkAction = (workId) => (dispatch) => {
  return api
    .delete(`/works/${workId}`)
    .then(() => {
      dispatch({ type: DELETE_WORK, payload: workId })
    })
    .catch((err) => {
      dispatch({ type: WORKS_ERROR, payload: err.message })
      throw err
    })
}
