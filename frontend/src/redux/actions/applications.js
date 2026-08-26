import { api } from "./auth"

export const GET_APPLICATIONS_PAGE = "GET_APPLICATIONS_PAGE"
export const GET_MY_APPLICATIONS = "GET_MY_APPLICATIONS"
export const GET_APPLICATIONS_BY_JOB_OFFER = "GET_APPLICATIONS_BY_JOB_OFFER"
export const CREATE_APPLICATION = "CREATE_APPLICATION"
export const UPDATE_APPLICATION = "UPDATE_APPLICATION"
export const DELETE_APPLICATION = "DELETE_APPLICATION"
export const APPLICATIONS_ERROR = "APPLICATIONS_ERROR"

export const getApplicationsPageAction = (params) => (dispatch) => {
  return api
    .get("/applications", params)
    .then((page) => {
      dispatch({ type: GET_APPLICATIONS_PAGE, payload: page })
      return page
    })
    .catch((err) => {
      dispatch({ type: APPLICATIONS_ERROR, payload: err.message })
      throw err
    })
}

export const getMyApplicationsAction = () => (dispatch) => {
  return api
    .get("/applications/me")
    .then((applications) => {
      dispatch({ type: GET_MY_APPLICATIONS, payload: applications })
      return applications
    })
    .catch((err) => {
      dispatch({ type: APPLICATIONS_ERROR, payload: err.message })
      throw err
    })
}

export const getApplicationsByJobOfferAction = (jobOfferId) => (dispatch) => {
  return api
    .get(`/applications/job-offer/${jobOfferId}`)
    .then((applications) => {
      dispatch({ type: GET_APPLICATIONS_BY_JOB_OFFER, payload: applications })
      return applications
    })
    .catch((err) => {
      dispatch({ type: APPLICATIONS_ERROR, payload: err.message })
      throw err
    })
}

export const createApplicationAction = (jobOfferId, cvFile) => (dispatch) => {
  const form = new FormData()
  form.append("jobOfferId", jobOfferId)
  form.append("cv", cvFile)
  return api
    .post("/applications", form, { isForm: true })
    .then(({ applicationId }) => api.get(`/applications/${applicationId}`))
    .then((created) => {
      dispatch({ type: CREATE_APPLICATION, payload: created })
      return created
    })
    .catch((err) => {
      dispatch({ type: APPLICATIONS_ERROR, payload: err.message })
      throw err
    })
}

export const updateApplicationStatusAction =
  (applicationId, status) => (dispatch) => {
    return api
      .patch(`/applications/${applicationId}/status`, { status })
      .then((updated) => {
        dispatch({ type: UPDATE_APPLICATION, payload: updated })
        return updated
      })
      .catch((err) => {
        dispatch({ type: APPLICATIONS_ERROR, payload: err.message })
        throw err
      })
  }

export const deleteApplicationAction = (applicationId) => (dispatch) => {
  return api
    .delete(`/applications/${applicationId}`)
    .then(() => {
      dispatch({ type: DELETE_APPLICATION, payload: applicationId })
    })
    .catch((err) => {
      dispatch({ type: APPLICATIONS_ERROR, payload: err.message })
      throw err
    })
}
