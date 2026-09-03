import { api } from "./auth"

export const GET_PERMISSIONS = "GET_PERMISSIONS"
export const PERMISSIONS_ERROR = "PERMISSIONS_ERROR"

export const getPermissionsAction = () => (dispatch) => {
  return api
    .get("/permissions")
    .then((permissions) => {
      dispatch({ type: GET_PERMISSIONS, payload: permissions })
      return permissions
    })
    .catch((err) => {
      dispatch({ type: PERMISSIONS_ERROR, payload: err.message })
      throw err
    })
}
