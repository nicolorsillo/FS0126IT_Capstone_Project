import {
  GET_APPLICATIONS_PAGE,
  GET_MY_APPLICATIONS,
  GET_APPLICATIONS_BY_JOB_OFFER,
  CREATE_APPLICATION,
  UPDATE_APPLICATION,
  DELETE_APPLICATION,
  APPLICATIONS_ERROR,
} from "../actions/applications"

export const APPLICATION_STATUS = {
  SUBMITTED: { label: "Inviata", tone: "pending" },
  IN_REVIEW: { label: "In valutazione", tone: "attention" },
  INTERVIEWING: { label: "Colloquio", tone: "attention" },
  DECLINED: { label: "Non selezionata", tone: "negative" },
  CLOSED: { label: "Chiusa", tone: "neutral" },
}

const initialState = {
  page: null,
  mine: [],
  byJobOffer: [],
  error: null,
}

const applicationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_APPLICATIONS_PAGE:
      return { ...state, page: action.payload, error: null }

    case GET_MY_APPLICATIONS:
      return { ...state, mine: action.payload, error: null }

    case GET_APPLICATIONS_BY_JOB_OFFER:
      return { ...state, byJobOffer: action.payload, error: null }

    case CREATE_APPLICATION:
      return { ...state, mine: [...state.mine, action.payload] }

    case UPDATE_APPLICATION:
      return {
        ...state,
        page: state.page
          ? {
              ...state.page,
              content: state.page.content.map((a) =>
                a.id === action.payload.id ? action.payload : a,
              ),
            }
          : state.page,
        mine: state.mine.map((a) =>
          a.id === action.payload.id ? action.payload : a,
        ),
      }

    case DELETE_APPLICATION:
      return {
        ...state,
        mine: state.mine.filter((a) => a.id !== action.payload),
      }

    case APPLICATIONS_ERROR:
      return { ...state, error: action.payload }

    default:
      return state
  }
}

export default applicationsReducer
