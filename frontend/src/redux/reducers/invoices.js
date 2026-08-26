import {
  GET_INVOICES_PAGE,
  GET_INVOICES_BY_WORK,
  CREATE_INVOICE,
  UPDATE_INVOICE,
  DELETE_INVOICE,
  INVOICES_ERROR,
} from "../actions/invoices"

export const INVOICE_STATUS = {
  PENDING: { label: "Da saldare", tone: "pending" },
  PAID: { label: "Pagata", tone: "positive" },
  OVERDUE: { label: "Scaduta", tone: "negative" },
  CANCELLED: { label: "Annullata", tone: "neutral" },
}

const initialState = {
  page: null,
  byWork: [],
  error: null,
}

const invoicesReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_INVOICES_PAGE:
      return { ...state, page: action.payload, error: null }

    case GET_INVOICES_BY_WORK:
      return { ...state, byWork: action.payload, error: null }

    case CREATE_INVOICE:
      return { ...state, byWork: [...state.byWork, action.payload] }

    case UPDATE_INVOICE:
      return {
        ...state,
        byWork: state.byWork.map((i) =>
          i.id === action.payload.id ? action.payload : i,
        ),
      }

    case DELETE_INVOICE:
      return {
        ...state,
        byWork: state.byWork.filter((i) => i.id !== action.payload),
      }

    case INVOICES_ERROR:
      return { ...state, error: action.payload }

    default:
      return state
  }
}

export default invoicesReducer
