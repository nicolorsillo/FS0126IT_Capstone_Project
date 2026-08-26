import {
  GET_ROLES,
  CREATE_ROLE,
  UPDATE_ROLE,
  DELETE_ROLE,
  ROLES_ERROR,
} from "../actions/roles"

const initialState = {
  list: [],
  error: null,
}

const rolesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_ROLES:
      return { ...state, list: action.payload, error: null }

    case CREATE_ROLE:
      return { ...state, list: [...state.list, action.payload] }

    case UPDATE_ROLE:
      return {
        ...state,
        list: state.list.map((r) =>
          r.id === action.payload.id ? action.payload : r,
        ),
      }

    case DELETE_ROLE:
      return {
        ...state,
        list: state.list.filter((r) => r.id !== action.payload),
      }

    case ROLES_ERROR:
      return { ...state, error: action.payload }

    default:
      return state
  }
}

export default rolesReducer
