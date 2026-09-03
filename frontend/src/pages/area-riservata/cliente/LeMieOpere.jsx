import { useEffect, useState } from "react"
import { Link } from "react-router"
import { Row, Col } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import {
  getMyWorksAction,
  createWorkAction,
} from "../../../redux/actions/works"
import { ApiError } from "../../../redux/actions/auth"
import { WORK_STATUS, WORK_TYPE } from "../../../redux/reducers/works"
import StatusBadge from "../../../components/StatusBadge"
import Loader from "../../../components/Loader"
import EmptyState from "../../../components/EmptyState"
import ErrorBanner from "../../../components/ErrorBanner"

const LeMieOpere = () => {
  const { user } = useSelector((state) => state.auth)
  const works = useSelector((state) => state.works.mine)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ type: "PROJECTING", description: "" })
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState("")

  useEffect(() => {
    dispatch(getMyWorksAction(user.id))
      .catch(() => setError("Non riusciamo a caricare le tue opere."))
      .finally(() => setLoading(false))
  }, [user.id, dispatch])

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.description.trim()) {
      setFormError("Descrivi brevemente il lavoro che vuoi richiedere.")
      return
    }
    setSubmitting(true)
    setFormError("")
    try {
      await dispatch(createWorkAction(form))
      setForm({ type: "PROJECTING", description: "" })
      setShowForm(false)
    } catch (err) {
      setFormError(
        err instanceof ApiError ? err.message : "Invio non riuscito. Riprova.",
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 mb-4">
        <div>
          <p className="smalltitle">Le mie opere</p>
          <h2 className="h3 mb-0">Richieste e cantieri in corso</h2>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? "Annulla" : "+ Nuova richiesta"}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="oc-card mb-4 d-grid gap-3">
          <div>
            <label className="form-label" htmlFor="work-type">
              Tipo di lavoro
            </label>
            <select
              id="work-type"
              className="form-select"
              value={form.type}
              onChange={(event) =>
                setForm((f) => ({ ...f, type: event.target.value }))
              }
            >
              <option value="PROJECTING">{WORK_TYPE.PROJECTING}</option>
              <option value="BUILDING">{WORK_TYPE.BUILDING}</option>
            </select>
          </div>
          <div>
            <label className="form-label" htmlFor="work-description">
              Descrizione
            </label>
            <textarea
              id="work-description"
              className="form-control"
              rows={4}
              placeholder="Es. Ristrutturazione bagno e cucina, 60 m², piano terra."
              value={form.description}
              onChange={(event) =>
                setForm((f) => ({ ...f, description: event.target.value }))
              }
            />
          </div>
          <ErrorBanner message={formError} />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
            style={{ justifySelf: "start" }}
          >
            {submitting ? "Invio…" : "Invia richiesta"}
          </button>
        </form>
      )}

      {loading && <Loader label="Carico le tue opere…" />}
      <ErrorBanner message={error} />

      {!loading && !error && works.length === 0 && (
        <EmptyState
          title="Non hai ancora nessuna richiesta"
          description="Apri una nuova richiesta di progettazione o costruzione per iniziare."
        />
      )}

      <Row className="g-3">
        {works.map((work) => (
          <Col md={6} key={work.id}>
            <Link
              to={`/area-riservata/opere/${work.id}`}
              className="work-card h-100"
            >
              <div className="work-card__top">
                <span className="work-card__type">{WORK_TYPE[work.type]}</span>
                <StatusBadge map={WORK_STATUS} status={work.status} />
              </div>
              <p className="work-card__desc">{work.description}</p>
              <p className="work-card__id">
                RIF. {work.id.slice(0, 8).toUpperCase()}
              </p>
            </Link>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default LeMieOpere
