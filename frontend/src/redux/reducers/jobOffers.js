import {
  GET_JOB_OFFERS,
  GET_JOB_OFFERS_PAGE,
  GET_JOB_OFFER,
  CREATE_JOB_OFFER,
  UPDATE_JOB_OFFER,
  DELETE_JOB_OFFER,
  JOB_OFFERS_ERROR,
} from "../actions/jobOffers"

export const JOB_OFFER_STATUS = {
  DRAFT: { label: "Bozza", tone: "neutral" },
  OPEN: { label: "Posizione aperta", tone: "positive" },
  CLOSED: { label: "Posizione chiusa", tone: "neutral" },
}

const initialState = {
  list: [],
  page: null,
  current: null,
  error: null,
}

const jobOffersReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_JOB_OFFERS:
      return { ...state, list: action.payload, error: null }

    case GET_JOB_OFFERS_PAGE:
      return { ...state, page: action.payload, error: null }

    case GET_JOB_OFFER:
      return { ...state, current: action.payload, error: null }

    case CREATE_JOB_OFFER:
      return {
        ...state,
        list: [...state.list, action.payload],
        page: state.page
          ? { ...state.page, content: [...state.page.content, action.payload] }
          : state.page,
      }

    case UPDATE_JOB_OFFER:
      return {
        ...state,
        list: state.list.map((o) =>
          o.id === action.payload.id ? action.payload : o,
        ),
        page: state.page
          ? {
              ...state.page,
              content: state.page.content.map((o) =>
                o.id === action.payload.id ? action.payload : o,
              ),
            }
          : state.page,
        current:
          state.current?.id === action.payload.id
            ? action.payload
            : state.current,
      }

    case DELETE_JOB_OFFER:
      return {
        ...state,
        list: state.list.filter((o) => o.id !== action.payload),
        page: state.page
          ? {
              ...state.page,
              content: state.page.content.filter(
                (o) => o.id !== action.payload,
              ),
            }
          : state.page,
      }

    case JOB_OFFERS_ERROR:
      return { ...state, error: action.payload }

    default:
      return state
  }
}

export default jobOffersReducer
