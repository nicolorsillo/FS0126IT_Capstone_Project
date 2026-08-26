import {
  GET_PROJECTS_PAGE,
  GET_PROJECTS_BY_WORK,
  CREATE_PROJECT,
  UPDATE_PROJECT,
  DELETE_PROJECT,
  PROJECTS_ERROR,
} from "../actions/projects"

export const PROJECT_STATUS = {
  IN_PROGRESS: { label: "In lavorazione", tone: "pending" },
  COMPLETED: { label: "Approvato", tone: "positive" },
  ON_HOLD: { label: "Sospeso", tone: "attention" },
  CANCELLED: { label: "Annullato", tone: "neutral" },
  REJECTED: { label: "Rifiutato", tone: "negative" },
}

const initialState = {
  page: null,
  byWork: [],
  error: null,
}

const projectsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_PROJECTS_PAGE:
      return { ...state, page: action.payload, error: null }

    case GET_PROJECTS_BY_WORK:
      return { ...state, byWork: action.payload, error: null }

    case CREATE_PROJECT:
      return { ...state, byWork: [...state.byWork, action.payload] }

    case UPDATE_PROJECT:
      return {
        ...state,
        byWork: state.byWork.map((p) =>
          p.id === action.payload.id ? action.payload : p,
        ),
      }

    case DELETE_PROJECT:
      return {
        ...state,
        byWork: state.byWork.filter((p) => p.id !== action.payload),
      }

    case PROJECTS_ERROR:
      return { ...state, error: action.payload }

    default:
      return state
  }
}

export default projectsReducer
