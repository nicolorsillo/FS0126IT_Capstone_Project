import { GET_PERMISSIONS, PERMISSIONS_ERROR } from "../actions/permissions"

const initialState = {
  list: [],
  error: null,
}

const permissionsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PERMISSIONS:
      return { ...state, list: action.payload, error: null }

    case PERMISSIONS_ERROR:
      return { ...state, error: action.payload }

    default:
      return state
  }
}

export default permissionsReducer
