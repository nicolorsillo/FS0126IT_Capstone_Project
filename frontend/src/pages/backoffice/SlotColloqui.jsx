import { Fragment, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import PageTop from "../../components/PageTop"
import StatusBadge from "../../components/StatusBadge"
import Loader from "../../components/Loader"
import ErrorBanner from "../../components/ErrorBanner"
import FileViewerModal from "../../components/FileViewerModal"
import {
  getMySlotsAction,
  createSlotAction,
  deleteSlotAction,
  getApplicationByInterviewSlotAction,
} from "../../redux/actions/interviews"
import { ApiError } from "../../redux/actions/auth"
import { APPLICATION_STATUS } from "../../redux/reducers/applications"
import { INTERVIEW_SLOT_STATUS } from "../../redux/reducers/interviews"
import {
  dayHeadingIt,
  groupSlotsByDay,
  timeIt,
} from "../../redux/reducers/interviews"

const STATUSES = Object.keys(INTERVIEW_SLOT_STATUS)

const BookingDetails = ({ application, onOpenFile }) => {
  if (!application) return <Loader label="Carico la candidatura…" />
  return (
    <div className="d-flex flex-wrap gap-4 align-items-center py-2">
      <div>
        <p className="text-steel small mb-1">Candidato</p>
        <p className="mb-0">
          {application.user.name} {application.user.surname} —{" "}
          {application.user.email}
        </p>
      </div>
      <div>
        <p className="text-steel small mb-1">Offerta</p>
        <p className="mb-0">{application.jobOffer.title}</p>
      </div>
      <div>
        <p className="text-steel small mb-1">Stato candidatura</p>
        <StatusBadge map={APPLICATION_STATUS} status={application.status} />
      </div>
      <div>
        <p className="text-steel small mb-1">CV</p>
        <button
          type="button"
          className="btn btn-link p-0 text-blueprint"
          onClick={() => onOpenFile(application.cvUrl)}
        >
          Apri CV
        </button>
      </div>
    </div>
  )
}

const SlotColloqui = () => {
  const dispatch = useDispatch()
  const slots = useSelector((state) => state.interviews.mySlots)
  const applicationBySlot = useSelector(
    (state) => state.interviews.applicationBySlot,
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [slotDate, setSlotDate] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState("")
  const [search, setSearch] = useState("")
  const [expanded, setExpanded] = useState(() => new Set())
  const [previewUrl, setPreviewUrl] = useState(null)

  useEffect(() => {
    dispatch(getMySlotsAction())
      .catch(() => setError("Non riusciamo a caricare gli slot."))
      .finally(() => setLoading(false))
  }, [dispatch])

  const handleCreate = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError("")
    try {
      await dispatch(createSlotAction(new Date(slotDate).toISOString()))
      setSlotDate("")
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Creazione non riuscita.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  const remove = async (slotId) => {
    try {
      await dispatch(deleteSlotAction(slotId))
    } catch (err) {
      setError(
        err instanceof ApiError ? err.message : "Eliminazione non riuscita.",
      )
    }
  }

  const toggleBooking = (slotId) => {
    setExpanded((current) => {
      const next = new Set(current)
      if (next.has(slotId)) {
        next.delete(slotId)
      } else {
        next.add(slotId)
        if (!applicationBySlot[slotId]) {
          dispatch(getApplicationByInterviewSlotAction(slotId)).catch(() =>
            setError(
              "Non riusciamo a caricare la candidatura per questo slot.",
            ),
          )
        }
      }
      return next
    })
  }

  const filteredSlots = slots.filter((slot) => {
    if (status && slot.status !== status) return false
    if (search) {
      const haystack =
        `${dayHeadingIt(slot.slotDate)} ${timeIt(slot.slotDate)}`.toLowerCase()
      if (!haystack.includes(search.toLowerCase())) return false
    }
    return true
  })
  const dayGroups = groupSlotsByDay(filteredSlots)

  return (
    <div>
      <PageTop smalltitle="Selezione del personale" title="Slot colloqui" />
      <div className="bo-content">
        <div className="bo-card" style={{ maxWidth: 480 }}>
          <h3 className="h5 mb-3">Aggiungi uno slot</h3>
          <form
            onSubmit={handleCreate}
            className="d-flex gap-2 align-items-end flex-wrap"
          >
            <div>
              <label className="form-label">Data e ora</label>
              <input
                type="datetime-local"
                required
                className="form-control"
                value={slotDate}
                onChange={(e) => setSlotDate(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Invio…" : "Crea slot"}
            </button>
          </form>
          <p className="text-steel small mt-3 mb-0">
            Gli slot vengono generati automaticamente ogni notte per la
            settimana successiva (lun–ven, 9–13 e 14–18); qui puoi aggiungerne
            altri manualmente.
          </p>
        </div>

        <div className="bo-filters">
          <select
            className="form-select"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">Tutti gli stati</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {INTERVIEW_SLOT_STATUS[s].label}
              </option>
            ))}
          </select>
          <input
            type="search"
            className="form-control"
            placeholder="Cerca per giorno o ora…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {loading && <Loader label="Carico gli slot…" />}
        <ErrorBanner message={error} />

        {!loading && !error && (
          <div className="bo-table-wrap">
            <table className="bo-table">
              <thead>
                <tr>
                  <th>Ora</th>
                  <th>Stato</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {dayGroups.map((day) => (
                  <Fragment key={day.key}>
                    <tr className="bo-table-group-row">
                      <td colSpan={3}>{dayHeadingIt(day.date)}</td>
                    </tr>
                    {day.slots.map((slot) => (
                      <Fragment key={slot.id}>
                        <tr>
                          <td className="mono">{timeIt(slot.slotDate)}</td>
                          <td>
                            <StatusBadge
                              map={INTERVIEW_SLOT_STATUS}
                              status={slot.status}
                            />
                          </td>
                          <td className="text-end">
                            {slot.status === "AVAILABLE" && (
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => remove(slot.id)}
                              >
                                Elimina
                              </button>
                            )}
                            {slot.status === "BOOKED" && (
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-dark"
                                onClick={() => toggleBooking(slot.id)}
                              >
                                {expanded.has(slot.id)
                                  ? "Nascondi candidatura"
                                  : "Vedi candidatura"}
                              </button>
                            )}
                          </td>
                        </tr>
                        {slot.status === "BOOKED" && expanded.has(slot.id) && (
                          <tr className="bo-table-group-row">
                            <td colSpan={3}>
                              <BookingDetails
                                application={applicationBySlot[slot.id]}
                                onOpenFile={setPreviewUrl}
                              />
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    ))}
                  </Fragment>
                ))}
                {dayGroups.length === 0 && (
                  <tr>
                    <td colSpan={3} className="empty-note">
                      Nessuno slot.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <FileViewerModal url={previewUrl} onClose={() => setPreviewUrl(null)} />
    </div>
  )
}

export default SlotColloqui
