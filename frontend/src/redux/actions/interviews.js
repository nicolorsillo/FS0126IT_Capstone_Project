import { api } from "./auth"

export const GET_MY_SLOTS = "GET_MY_SLOTS"
export const GET_AVAILABLE_SLOTS = "GET_AVAILABLE_SLOTS"
export const CREATE_SLOT = "CREATE_SLOT"
export const DELETE_SLOT = "DELETE_SLOT"
export const GET_INTERVIEW_BY_APPLICATION = "GET_INTERVIEW_BY_APPLICATION"
export const GET_APPLICATION_BY_SLOT = "GET_APPLICATION_BY_SLOT"
export const CREATE_INTERVIEW = "CREATE_INTERVIEW"
export const DELETE_INTERVIEW = "DELETE_INTERVIEW"
export const INTERVIEWS_ERROR = "INTERVIEWS_ERROR"

export const getMySlotsAction = () => (dispatch) => {
  return api
    .get("/interview-slots/me")
    .then((slots) => {
      dispatch({ type: GET_MY_SLOTS, payload: slots })
      return slots
    })
    .catch((err) => {
      dispatch({ type: INTERVIEWS_ERROR, payload: err.message })
      throw err
    })
}

export const getAvailableSlotsAction = () => (dispatch) => {
  return api
    .get("/interview-slots/available")
    .then((slots) => {
      dispatch({ type: GET_AVAILABLE_SLOTS, payload: slots })
      return slots
    })
    .catch((err) => {
      dispatch({ type: INTERVIEWS_ERROR, payload: err.message })
      throw err
    })
}

export const createSlotAction = (slotDate) => (dispatch) => {
  return api
    .post("/interview-slots", { slotDate })
    .then(({ interviewSlotId }) =>
      api.get(`/interview-slots/${interviewSlotId}`),
    )
    .then((created) => {
      dispatch({ type: CREATE_SLOT, payload: created })
      return created
    })
    .catch((err) => {
      dispatch({ type: INTERVIEWS_ERROR, payload: err.message })
      throw err
    })
}

export const deleteSlotAction = (slotId) => (dispatch) => {
  return api
    .delete(`/interview-slots/${slotId}`)
    .then(() => {
      dispatch({ type: DELETE_SLOT, payload: slotId })
    })
    .catch((err) => {
      dispatch({ type: INTERVIEWS_ERROR, payload: err.message })
      throw err
    })
}

export const getInterviewByApplicationAction =
  (applicationId) => (dispatch) => {
    return api
      .get(`/interviews/application/${applicationId}`)
      .then((interview) => {
        dispatch({
          type: GET_INTERVIEW_BY_APPLICATION,
          payload: { applicationId, interview },
        })
        return interview
      })
      .catch((err) => {
        dispatch({ type: INTERVIEWS_ERROR, payload: err.message })
        throw err
      })
  }

export const getApplicationByInterviewSlotAction = (slotId) => (dispatch) => {
  return api
    .get(`/interviews/slot/${slotId}`)
    .then((application) => {
      dispatch({
        type: GET_APPLICATION_BY_SLOT,
        payload: { slotId, application },
      })
      return application
    })
    .catch((err) => {
      dispatch({ type: INTERVIEWS_ERROR, payload: err.message })
      throw err
    })
}

export const createInterviewAction =
  (applicationId, interviewSlotId) => (dispatch) => {
    return api
      .post("/interviews", { applicationId, interviewSlotId })
      .then(({ interviewId }) => api.get(`/interviews/${interviewId}`))
      .then((created) => {
        dispatch({
          type: CREATE_INTERVIEW,
          payload: { applicationId, interview: created },
        })
        return created
      })
      .catch((err) => {
        dispatch({ type: INTERVIEWS_ERROR, payload: err.message })
        throw err
      })
  }

export const deleteInterviewAction =
  (interviewId, applicationId) => (dispatch) => {
    return api
      .delete(`/interviews/${interviewId}`)
      .then(() => {
        dispatch({ type: DELETE_INTERVIEW, payload: applicationId })
      })
      .catch((err) => {
        dispatch({ type: INTERVIEWS_ERROR, payload: err.message })
        throw err
      })
  }
