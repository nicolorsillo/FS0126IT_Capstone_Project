import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { getMyApplicationsAction } from "../../../redux/actions/applications"
import {
  getAvailableSlotsAction,
  getInterviewByApplicationAction,
  createInterviewAction,
  deleteInterviewAction,
} from "../../../redux/actions/interviews"
import { ApiError } from "../../../redux/actions/auth"
import Loader from "../../../components/Loader"
import EmptyState from "../../../components/EmptyState"
import ErrorBanner from "../../../components/ErrorBanner"
import {
  dateTimeIt,
  dayHeadingIt,
  groupSlotsByDay,
  timeIt,
} from "../../../redux/reducers/interviews"

const ColloquiDisponibili = () => {
  const dispatch = useDispatch()
  const myApplications = useSelector((state) => state.applications.mine)
  const slots = useSelector((state) => state.interviews.availableSlots)
  const interviewsByApplication = useSelector(
    (state) => state.interviews.interviewsByApplication,
  )
  const [applicationId, setApplicationId] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [booking, setBooking] = useState("")

  const applications = myApplications.filter((a) => a.status === "INTERVIEWING")

  useEffect(() => {
    dispatch(getMyApplicationsAction())
      .then((allApplications) => {
        const eligible = allApplications.filter(
          (a) => a.status === "INTERVIEWING",
        )
        setApplicationId(eligible[0]?.id ?? "")
        return Promise.all([
          dispatch(getAvailableSlotsAction()),
          Promise.all(
            eligible.map((a) =>
              dispatch(getInterviewByApplicationAction(a.id)),
            ),
          ),
        ])
      })
      .catch(() => setError("Non riusciamo a caricare gli slot disponibili."))
      .finally(() => setLoading(false))
  }, [dispatch])

  const book = async (slot) => {
    if (!applicationId) {
      setError("Seleziona la candidatura per cui vuoi prenotare il colloquio.")
      return
    }
    setBooking(slot.id)
    setError("")
    try {
      await dispatch(createInterviewAction(applicationId, slot.id))
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Prenotazione non riuscita.",
      )
      dispatch(getAvailableSlotsAction()).catch(() => {})
    } finally {
      setBooking("")
    }
  }

  const cancelBooking = async () => {
    const current = interviewsByApplication[applicationId]
    if (!current) return
    try {
      await dispatch(deleteInterviewAction(current.id, applicationId))
      dispatch(getAvailableSlotsAction()).catch(() => {})
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Impossibile annullare la prenotazione.",
      )
    }
  }

  const currentBooking = interviewsByApplication[applicationId]

  return (
    <div>
      <p className="smalltitle">Colloqui</p>
      <h2 className="h3 mb-4">Prenota uno slot con le risorse umane</h2>

      <ErrorBanner message={error} />

      {applications.length > 1 && (
        <div className="mb-4" style={{ maxWidth: 420 }}>
          <label className="form-label" htmlFor="application-select">
            Per quale candidatura?
          </label>
          <select
            id="application-select"
            className="form-select"
            value={applicationId}
            onChange={(event) => setApplicationId(event.target.value)}
          >
            {applications.map((application) => (
              <option key={application.id} value={application.id}>
                {application.jobOffer.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading && <Loader label="Carico gli slot disponibili…" />}

      {!loading && applications.length === 0 && (
        <EmptyState
          title="Nessun colloquio da programmare"
          description="Puoi scegliere uno slot quando una tua candidatura passa in fase di colloquio."
        />
      )}

      {!loading && currentBooking && (
        <div className="oc-card">
          <p className="smalltitle">Colloquio programmato</p>
          <p className="h5 mb-3">
            {dateTimeIt(currentBooking.interviewSlot.slotDate)}
          </p>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={cancelBooking}
          >
            Annulla prenotazione
          </button>
        </div>
      )}

      {!loading &&
        applications.length > 0 &&
        !currentBooking &&
        slots.length === 0 && (
          <EmptyState
            title="Nessuno slot disponibile al momento"
            description="Torna a controllare più tardi."
          />
        )}

      {!loading &&
        applications.length > 0 &&
        !currentBooking &&
        slots.length > 0 && (
          <div className="d-grid gap-4">
            {groupSlotsByDay(slots).map((day) => (
              <div key={day.key}>
                <p className="slot-day__heading">{dayHeadingIt(day.date)}</p>
                <div className="d-flex flex-wrap gap-2">
                  {day.slots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      className="slot-pill"
                      disabled={booking === slot.id}
                      onClick={() => book(slot)}
                    >
                      {timeIt(slot.slotDate)}
                      {booking === slot.id ? " …" : ""}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
    </div>
  )
}

export default ColloquiDisponibili
