import {
  GET_WORKS_PAGE,
  GET_MY_WORKS,
  GET_WORK,
  CREATE_WORK,
  UPDATE_WORK,
  DELETE_WORK,
  WORKS_ERROR,
} from "../actions/works"

export const WORK_TYPE = {
  PROJECTING: "Progettazione",
  BUILDING: "Costruzione",
}

export const WORK_STATUS = {
  OPEN: { label: "Aperta", tone: "pending" },
  IN_PROGRESS: { label: "In corso", tone: "attention" },
  COMPLETED: { label: "Completata", tone: "positive" },
  CANCELLED: { label: "Annullata", tone: "neutral" },
}

const initialState = {
  page: null,
  mine: [],
  current: null,
  error: null,
}

const worksReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_WORKS_PAGE:
      return { ...state, page: action.payload, error: null }

    case GET_MY_WORKS:
      return { ...state, mine: action.payload, error: null }

    case GET_WORK:
      return { ...state, current: action.payload, error: null }

    case CREATE_WORK:
      return { ...state, mine: [...state.mine, action.payload] }

    case UPDATE_WORK:
      return {
        ...state,
        current:
          state.current?.id === action.payload.id
            ? action.payload
            : state.current,
      }

    case DELETE_WORK:
      return { ...state, current: null }

    case WORKS_ERROR:
      return { ...state, error: action.payload }

    default:
      return state
  }
}

export default worksReducer
