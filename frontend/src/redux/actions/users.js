import { api } from "./auth"

export const GET_USERS_PAGE = "GET_USERS_PAGE"
export const GET_USERS_DIRECTORY = "GET_USERS_DIRECTORY"
export const UPDATE_USER_ROLE = "UPDATE_USER_ROLE"
export const USERS_ERROR = "USERS_ERROR"

export const getUsersPageAction = (params) => (dispatch) => {
  return api
    .get("/users", params)
    .then((page) => {
      dispatch({ type: GET_USERS_PAGE, payload: page })
      return page
    })
    .catch((err) => {
      dispatch({ type: USERS_ERROR, payload: err.message })
      throw err
    })
}

export const getUsersDirectoryAction = (params) => (dispatch) => {
  return api
    .get("/users", params)
    .then((page) => {
      dispatch({ type: GET_USERS_DIRECTORY, payload: page.content })
      return page
    })
    .catch((err) => {
      dispatch({ type: USERS_ERROR, payload: err.message })
      throw err
    })
}

export const updateUserRoleAction = (email, role) => (dispatch) => {
  return api
    .patchBody("/users/role", { email, role })
    .then((updated) => {
      dispatch({ type: UPDATE_USER_ROLE, payload: updated })
      return updated
    })
    .catch((err) => {
      dispatch({ type: USERS_ERROR, payload: err.message })
      throw err
    })
}

export const removeUserRoleAction = (email, role) => (dispatch) => {
  return api
    .deleteBody("/users/role", { email, role })
    .then((updated) => {
      dispatch({ type: UPDATE_USER_ROLE, payload: updated })
      return updated
    })
    .catch((err) => {
      dispatch({ type: USERS_ERROR, payload: err.message })
      throw err
    })
}

export const updateMeAction = (payload) => () => api.put("/users/me", payload)

export const changePasswordAction = (payload) => () =>
  api.patchBody("/users/me/password", payload)

export const deleteMeAction = () => () => api.delete("/users/me")
