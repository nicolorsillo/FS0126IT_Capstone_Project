import {
  GET_USERS_PAGE,
  GET_USERS_DIRECTORY,
  UPDATE_USER_ROLE,
  USERS_ERROR,
} from "../actions/users"

const initialState = {
  page: null,
  directory: [],
  error: null,
}

const usersReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_USERS_PAGE:
      return { ...state, page: action.payload, error: null }

    case GET_USERS_DIRECTORY:
      return { ...state, directory: action.payload, error: null }

    case UPDATE_USER_ROLE:
      return {
        ...state,
        page: state.page
          ? {
              ...state.page,
              content: state.page.content.map((u) =>
                u.id === action.payload.id ? action.payload : u,
              ),
            }
          : state.page,
        directory: state.directory.map((u) =>
          u.id === action.payload.id ? action.payload : u,
        ),
      }

    case USERS_ERROR:
      return { ...state, error: action.payload }

    default:
      return state
  }
}

export default usersReducer
