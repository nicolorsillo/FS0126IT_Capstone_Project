import {
  getToken,
  SET_USER,
  CLEAR_USER,
  SET_INITIALIZING,
  AUTH_ERROR,
} from "../actions/auth"

const initialState = {
  user: null,
  initializing: Boolean(getToken()),
  error: null,
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER:
      return { ...state, user: action.payload, error: null }

    case CLEAR_USER:
      return { ...state, user: null }

    case SET_INITIALIZING:
      return { ...state, initializing: action.payload }

    case AUTH_ERROR:
      return { ...state, error: action.payload }

    default:
      return state
  }
}

export default authReducer
