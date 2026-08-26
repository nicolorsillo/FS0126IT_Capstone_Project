import { api } from "./auth"

export const GET_JOB_OFFERS = "GET_JOB_OFFERS"
export const GET_JOB_OFFERS_PAGE = "GET_JOB_OFFERS_PAGE"
export const GET_JOB_OFFER = "GET_JOB_OFFER"
export const CREATE_JOB_OFFER = "CREATE_JOB_OFFER"
export const UPDATE_JOB_OFFER = "UPDATE_JOB_OFFER"
export const DELETE_JOB_OFFER = "DELETE_JOB_OFFER"
export const JOB_OFFERS_ERROR = "JOB_OFFERS_ERROR"

export const getJobOffersAction = (params) => (dispatch) => {
  return api
    .get("/job-offers", params)
    .then((page) => {
      dispatch({ type: GET_JOB_OFFERS, payload: page.content ?? [] })
      return page
    })
    .catch((err) => {
      dispatch({ type: JOB_OFFERS_ERROR, payload: err.message })
      throw err
    })
}

export const getJobOffersPageAction = (params) => (dispatch) => {
  return api
    .get("/job-offers", params)
    .then((page) => {
      dispatch({ type: GET_JOB_OFFERS_PAGE, payload: page })
      return page
    })
    .catch((err) => {
      dispatch({ type: JOB_OFFERS_ERROR, payload: err.message })
      throw err
    })
}

export const getJobOfferByIdAction = (jobOfferId) => (dispatch) => {
  return api
    .get(`/job-offers/${jobOfferId}`)
    .then((offer) => {
      dispatch({ type: GET_JOB_OFFER, payload: offer })
      return offer
    })
    .catch((err) => {
      dispatch({ type: JOB_OFFERS_ERROR, payload: err.message })
      throw err
    })
}

export const createJobOfferAction = (payload) => (dispatch) => {
  return api
    .post("/job-offers", payload)
    .then(({ jobOfferId }) => api.get(`/job-offers/${jobOfferId}`))
    .then((created) => {
      dispatch({ type: CREATE_JOB_OFFER, payload: created })
      return created
    })
    .catch((err) => {
      dispatch({ type: JOB_OFFERS_ERROR, payload: err.message })
      throw err
    })
}

export const updateJobOfferAction = (jobOfferId, payload) => (dispatch) => {
  return api
    .put(`/job-offers/${jobOfferId}`, payload)
    .then((updated) => {
      dispatch({ type: UPDATE_JOB_OFFER, payload: updated })
      return updated
    })
    .catch((err) => {
      dispatch({ type: JOB_OFFERS_ERROR, payload: err.message })
      throw err
    })
}

export const updateJobOfferStatusAction =
  (jobOfferId, status) => (dispatch) => {
    return api
      .patch(`/job-offers/${jobOfferId}/status`, { status })
      .then((updated) => {
        dispatch({ type: UPDATE_JOB_OFFER, payload: updated })
        return updated
      })
      .catch((err) => {
        dispatch({ type: JOB_OFFERS_ERROR, payload: err.message })
        throw err
      })
  }

export const deleteJobOfferAction = (jobOfferId) => (dispatch) => {
  return api
    .delete(`/job-offers/${jobOfferId}`)
    .then(() => {
      dispatch({ type: DELETE_JOB_OFFER, payload: jobOfferId })
    })
    .catch((err) => {
      dispatch({ type: JOB_OFFERS_ERROR, payload: err.message })
      throw err
    })
}
