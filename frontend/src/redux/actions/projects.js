import { api } from "./auth"

export const GET_PROJECTS_PAGE = "GET_PROJECTS_PAGE"
export const GET_PROJECTS_BY_WORK = "GET_PROJECTS_BY_WORK"
export const CREATE_PROJECT = "CREATE_PROJECT"
export const UPDATE_PROJECT = "UPDATE_PROJECT"
export const DELETE_PROJECT = "DELETE_PROJECT"
export const PROJECTS_ERROR = "PROJECTS_ERROR"

export const getProjectsPageAction = (params) => (dispatch) => {
  return api
    .get("/projects", params)
    .then((page) => {
      dispatch({ type: GET_PROJECTS_PAGE, payload: page })
      return page
    })
    .catch((err) => {
      dispatch({ type: PROJECTS_ERROR, payload: err.message })
      throw err
    })
}

export const getProjectsByWorkAction = (workId) => (dispatch) => {
  return api
    .get(`/projects/work/${workId}`)
    .then((projects) => {
      dispatch({ type: GET_PROJECTS_BY_WORK, payload: projects })
      return projects
    })
    .catch((err) => {
      dispatch({ type: PROJECTS_ERROR, payload: err.message })
      throw err
    })
}

export const createProjectAction =
  (surveyorId, workId, projectFile) => (dispatch) => {
    const form = new FormData()
    form.append("surveyorId", surveyorId)
    form.append("workId", workId)
    form.append("projectFile", projectFile)
    return api
      .post("/projects", form, { isForm: true })
      .then(({ projectId }) => api.get(`/projects/${projectId}`))
      .then((created) => {
        dispatch({ type: CREATE_PROJECT, payload: created })
        return created
      })
      .catch((err) => {
        dispatch({ type: PROJECTS_ERROR, payload: err.message })
        throw err
      })
  }

export const updateProjectStatusAction =
  (projectId, status, reason) => (dispatch) => {
    return api
      .patch(`/projects/${projectId}/status`, { status, reason })
      .then((updated) => {
        dispatch({ type: UPDATE_PROJECT, payload: updated })
        return updated
      })
      .catch((err) => {
        dispatch({ type: PROJECTS_ERROR, payload: err.message })
        throw err
      })
  }

export const deleteProjectAction = (projectId) => (dispatch) => {
  return api
    .delete(`/projects/${projectId}`)
    .then(() => {
      dispatch({ type: DELETE_PROJECT, payload: projectId })
    })
    .catch((err) => {
      dispatch({ type: PROJECTS_ERROR, payload: err.message })
      throw err
    })
}
