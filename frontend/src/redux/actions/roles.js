import { api } from "./auth"

export const GET_ROLES = "GET_ROLES"
export const CREATE_ROLE = "CREATE_ROLE"
export const UPDATE_ROLE = "UPDATE_ROLE"
export const DELETE_ROLE = "DELETE_ROLE"
export const ROLES_ERROR = "ROLES_ERROR"

export const getRolesAction = () => (dispatch) => {
  return api
    .get("/roles")
    .then((roles) => {
      dispatch({ type: GET_ROLES, payload: roles })
      return roles
    })
    .catch((err) => {
      dispatch({ type: ROLES_ERROR, payload: err.message })
      throw err
    })
}

export const createRoleAction = (payload) => (dispatch) => {
  return api
    .post("/roles", payload)
    .then((created) => {
      dispatch({ type: CREATE_ROLE, payload: created })
      return created
    })
    .catch((err) => {
      dispatch({ type: ROLES_ERROR, payload: err.message })
      throw err
    })
}

export const updateRoleAction = (roleId, payload) => (dispatch) => {
  return api
    .put(`/roles/${roleId}`, payload)
    .then((updated) => {
      dispatch({ type: UPDATE_ROLE, payload: updated })
      return updated
    })
    .catch((err) => {
      dispatch({ type: ROLES_ERROR, payload: err.message })
      throw err
    })
}

export const deleteRoleAction = (roleId) => (dispatch) => {
  return api
    .delete(`/roles/${roleId}`)
    .then(() => {
      dispatch({ type: DELETE_ROLE, payload: roleId })
    })
    .catch((err) => {
      dispatch({ type: ROLES_ERROR, payload: err.message })
      throw err
    })
}
