import {
  GET_QUOTES_PAGE,
  GET_QUOTES_BY_WORK,
  CREATE_QUOTE,
  UPDATE_QUOTE,
  DELETE_QUOTE,
  QUOTES_ERROR,
} from "../actions/quotes"

export const QUOTE_STATUS = {
  PENDING: { label: "In attesa", tone: "pending" },
  ACCEPTED: { label: "Accettato", tone: "positive" },
  REJECTED: { label: "Rifiutato", tone: "negative" },
  EXPIRED: { label: "Scaduto", tone: "neutral" },
}

const initialState = {
  page: null,
  byWork: [],
  error: null,
}

const quotesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_QUOTES_PAGE:
      return { ...state, page: action.payload, error: null }

    case GET_QUOTES_BY_WORK:
      return { ...state, byWork: action.payload, error: null }

    case CREATE_QUOTE:
      return { ...state, byWork: [...state.byWork, action.payload] }

    case UPDATE_QUOTE:
      return {
        ...state,
        byWork: state.byWork.map((q) =>
          q.id === action.payload.id ? action.payload : q,
        ),
      }

    case DELETE_QUOTE:
      return {
        ...state,
        byWork: state.byWork.filter((q) => q.id !== action.payload),
      }

    case QUOTES_ERROR:
      return { ...state, error: action.payload }

    default:
      return state
  }
}

export default quotesReducer
