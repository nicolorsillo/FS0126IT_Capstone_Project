import {
  GET_MY_SLOTS,
  GET_AVAILABLE_SLOTS,
  CREATE_SLOT,
  DELETE_SLOT,
  GET_INTERVIEW_BY_APPLICATION,
  GET_APPLICATION_BY_SLOT,
  CREATE_INTERVIEW,
  DELETE_INTERVIEW,
  INTERVIEWS_ERROR,
} from "../actions/interviews"

export const INTERVIEW_STATUS = {
  TO_SCHEDULE: { label: "Da programmare", tone: "pending" },
  SCHEDULED: { label: "Programmato", tone: "attention" },
  CLOSED: { label: "Concluso", tone: "neutral" },
}

export const INTERVIEW_SLOT_STATUS = {
  AVAILABLE: { label: "Disponibile", tone: "positive" },
  BOOKED: { label: "Prenotato", tone: "attention" },
  EXPIRED: { label: "Scaduto", tone: "neutral" },
}

export const dateTimeIt = (value) => {
  if (!value) return "—"
  return new Date(value).toLocaleString("it-IT", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const timeIt = (value) => {
  if (!value) return "—"
  return new Date(value).toLocaleTimeString("it-IT", {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export const dayHeadingIt = (value) => {
  if (!value) return "—"
  const label = new Date(value).toLocaleDateString("it-IT", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  })
  return label.charAt(0).toUpperCase() + label.slice(1)
}

export const groupSlotsByDay = (slots) => {
  const sorted = [...slots].sort(
    (a, b) => new Date(a.slotDate) - new Date(b.slotDate),
  )
  const groups = []
  for (const slot of sorted) {
    const dayKey = slot.slotDate.slice(0, 10)
    const current = groups.at(-1)
    if (current?.key === dayKey) {
      current.slots.push(slot)
    } else {
      groups.push({ key: dayKey, date: slot.slotDate, slots: [slot] })
    }
  }
  return groups
}

const initialState = {
  availableSlots: [],
  mySlots: [],
  interviewsByApplication: {},
  applicationBySlot: {},
  error: null,
}

const interviewsReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_AVAILABLE_SLOTS:
      return { ...state, availableSlots: action.payload, error: null }

    case GET_MY_SLOTS:
      return { ...state, mySlots: action.payload, error: null }

    case CREATE_SLOT:
      return { ...state, mySlots: [...state.mySlots, action.payload] }

    case DELETE_SLOT:
      return {
        ...state,
        mySlots: state.mySlots.filter((s) => s.id !== action.payload),
      }

    case GET_INTERVIEW_BY_APPLICATION:
      return {
        ...state,
        interviewsByApplication: {
          ...state.interviewsByApplication,
          [action.payload.applicationId]: action.payload.interview,
        },
      }

    case GET_APPLICATION_BY_SLOT:
      return {
        ...state,
        applicationBySlot: {
          ...state.applicationBySlot,
          [action.payload.slotId]: action.payload.application,
        },
      }

    case CREATE_INTERVIEW:
      return {
        ...state,
        interviewsByApplication: {
          ...state.interviewsByApplication,
          [action.payload.applicationId]: action.payload.interview,
        },
        availableSlots: state.availableSlots.filter(
          (s) => s.id !== action.payload.interview.interviewSlot.id,
        ),
      }

    case DELETE_INTERVIEW: {
      const next = { ...state.interviewsByApplication }
      delete next[action.payload]
      return { ...state, interviewsByApplication: next }
    }

    case INTERVIEWS_ERROR:
      return { ...state, error: action.payload }

    default:
      return state
  }
}

export default interviewsReducer
